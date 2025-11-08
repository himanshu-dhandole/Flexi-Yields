// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BaseStrategy
 * @notice Base implementation for yield strategies using ERC4626
 * @dev Simulates yield generation with configurable APY
 *
 * Key fixes:
 * - Views are deterministic (no fresh randomness on each view).
 * - Randomness is produced only during state updates (_generateYield).
 * - Added hourly publisher that emits an event once per hour.
 */
abstract contract BaseStrategy is ERC4626, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public vault;
    uint256 public lastHarvest;
    uint256 public totalHarvested;

    // Simulated yield parameters
    uint256 public baseAPY; // Base APY in basis points (e.g., 500 = 5%)
    uint256 public lastYieldUpdate;
    uint256 public accumulatedYield;

    // Last applied random factor (stored as percent, e.g., 100 => 100%)
    uint256 public lastRandomFactor;

    // Hourly estimate control
    uint256 public lastHourlyEstimate;

    event Harvested(uint256 amount, uint256 timestamp);
    event YieldGenerated(uint256 amount);
    event VaultUpdated(address indexed oldVault, address indexed newVault);
    event HourlyEstimate(uint256 estimatedYield, uint256 timestamp);

    modifier onlyVault() {
        require(msg.sender == vault, "BaseStrategy: Only vault can call");
        _;
    }

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        uint256 _baseAPY
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_baseAPY > 0 && _baseAPY < 50000, "BaseStrategy: Invalid APY"); // Max 500%
        baseAPY = _baseAPY;
        lastYieldUpdate = block.timestamp;
        lastRandomFactor = 100; // start neutral (100%)
    }

    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "BaseStrategy: Invalid vault address");
        address oldVault = vault;
        vault = _vault;
        emit VaultUpdated(oldVault, _vault);
    }

    /**
     * @notice Generate simulated yield based on time elapsed
     * @dev Calculates yield and updates state. Randomness applied here only.
     */
    function _generateYield() internal {
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        if (timeElapsed == 0) return;

        // Use explicit baseAssets calculation to avoid recursive totalAssets() call.
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this)) +
            accumulatedYield;
        if (baseAssets == 0) {
            lastYieldUpdate = block.timestamp;
            return;
        }

        // Calculate yield: (principal * APY * time) / (365 days * 10000)
        uint256 baseYield = (baseAssets * baseAPY * timeElapsed) /
            (365 days * 10000);

        // Generate randomness ONCE and store it (±20% like before)
        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    address(this),
                    baseYield
                )
            )
        );
        uint256 randomFactor = (randomSeed % 40) + 90; // 90..129 (i.e., 90%..129%)
        lastRandomFactor = randomFactor;

        uint256 yieldAmount = (baseYield * randomFactor) / 100;

        // Update accumulated yield and last update timestamp
        accumulatedYield += yieldAmount;
        lastYieldUpdate = block.timestamp;

        emit YieldGenerated(yieldAmount);
    }

    /**
     * @notice Deposit assets (only vault)
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override onlyVault nonReentrant returns (uint256) {
        _generateYield();
        return super.deposit(assets, receiver);
    }

    /**
     * @notice Withdraw assets (only vault)
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address /* owner */
    ) public virtual override onlyVault nonReentrant returns (uint256) {
        _generateYield();

        uint256 balance = IERC20(asset()).balanceOf(address(this));
        uint256 withdrawn = assets > balance ? balance : assets;

        if (withdrawn > 0) {
            IERC20(asset()).safeTransfer(receiver, withdrawn);
        }

        return withdrawn;
    }

    /**
     * @notice Calculate total assets including accumulated yield
     * @dev Deterministic: uses stored lastRandomFactor (no fresh randomness).
     */
    function totalAssets() public view virtual override returns (uint256) {
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this)) +
            accumulatedYield;

        // Pending yield since lastYieldUpdate (deterministic, uses stored lastRandomFactor)
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        uint256 pendingYield = 0;

        if (timeElapsed > 0 && baseAssets > 0) {
            uint256 baseYield = (baseAssets * baseAPY * timeElapsed) /
                (365 days * 10000);
            // Use stored lastRandomFactor (set during last state update)
            pendingYield = (baseYield * lastRandomFactor) / 100;
        }

        return baseAssets + pendingYield;
    }

    /**
     * @notice Get strategy balance (alias for totalAssets)
     */
    function balanceOf() external view returns (uint256) {
        return totalAssets();
    }

    /**
     * @notice Harvest accumulated yield (only vault)
     */
    function harvest() external onlyVault nonReentrant returns (uint256) {
        _generateYield();
        uint256 harvestedAmount = accumulatedYield;

        if (harvestedAmount > 0) {
            totalHarvested += harvestedAmount;
            accumulatedYield = 0;
            lastHarvest = block.timestamp;

            emit Harvested(harvestedAmount, block.timestamp);
        }

        return harvestedAmount;
    }

    /**
     * @notice Get current estimated APY (deterministic)
     * @return APY in basis points based on lastRandomFactor
     */
    function estimatedAPY() external view returns (uint256) {
        // Deterministic: report baseAPY adjusted by the last applied random factor
        return (baseAPY * lastRandomFactor) / 100;
    }

    /**
     * @notice Withdraw all assets from strategy (only vault)
     */
    function withdrawAll() external onlyVault nonReentrant returns (uint256) {
        _generateYield();
        uint256 total = IERC20(asset()).balanceOf(address(this));

        if (total > 0) {
            IERC20(asset()).safeTransfer(vault, total);
        }

        return total;
    }

    /**
     * @notice Publish hourly estimated yield and emit an event (callable by anyone)
     * @dev Can be called at most once per hour. Emits HourlyEstimate(estimatedYield, timestamp).
     * @return estimatedYield for next hour (deterministic, uses lastRandomFactor)
     */
    function publishHourlyEstimate() external nonReentrant returns (uint256) {
        require(
            block.timestamp - lastHourlyEstimate >= 1 hours,
            "BaseStrategy: Hourly already published"
        );

        // Determine current effective assets (including accumulated yield)
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this)) +
            accumulatedYield;

        uint256 hourlyBaseYield = (baseAssets * baseAPY * 1 hours) /
            (365 days * 10000);

        uint256 estimatedHourlyYield = (hourlyBaseYield * lastRandomFactor) /
            100;

        lastHourlyEstimate = block.timestamp;
        emit HourlyEstimate(estimatedHourlyYield, block.timestamp);

        return estimatedHourlyYield;
    }

    /**
     * @notice View-only version of hourly estimated yield
     * @dev Simulates next-hour yield without minting or changing state
     * @return estimatedHourlyYield The projected yield for the next hour
     */
    function viewHourlyYield()
        external
        view
        returns (uint256 estimatedHourlyYield)
    {
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this)) +
            accumulatedYield;

        if (baseAssets == 0) return 0;

        // Hourly base yield = principal * APY * 1 hour / (365 days * 10000)
        uint256 hourlyBaseYield = (baseAssets * baseAPY * 1 hours) /
            (365 days * 10000);

        // Apply the last random factor (deterministic)
        estimatedHourlyYield = (hourlyBaseYield * lastRandomFactor) / 100;
    }
}
