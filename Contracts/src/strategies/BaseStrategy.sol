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

    event Harvested(uint256 amount, uint256 timestamp);
    event YieldGenerated(uint256 amount);
    event VaultUpdated(address indexed oldVault, address indexed newVault);

    modifier onlyVault() {
        require(msg.sender == vault, "BaseStrategy: Only vault can call");
        _;
    }

    /**
     * @notice Initialize the strategy
     * @param _asset Underlying asset (vETH)
     * @param _name ERC20 name for strategy shares
     * @param _symbol ERC20 symbol for strategy shares
     * @param _baseAPY Base APY in basis points
     */
    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        uint256 _baseAPY
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_baseAPY > 0 && _baseAPY < 50000, "BaseStrategy: Invalid APY"); // Max 500%
        baseAPY = _baseAPY;
        lastYieldUpdate = block.timestamp;
    }

    /**
     * @notice Set the vault address (only owner)
     * @param _vault New vault address
     */
    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "BaseStrategy: Invalid vault address");
        address oldVault = vault;
        vault = _vault;
        emit VaultUpdated(oldVault, _vault);
    }

    /**
     * @notice Generate simulated yield based on time elapsed
     * @dev Calculates yield with randomness for realistic simulation
     */
    function _generateYield() internal {
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        if (timeElapsed > 0 && totalAssets() > 0) {
            // Calculate yield: (principal * APY * time) / (365 days * 10000)
            uint256 baseYield = (totalAssets() * baseAPY * timeElapsed) /
                (365 days * 10000);

            // Add randomness (±20%) for realistic variation
            uint256 randomSeed = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        address(this)
                    )
                )
            );
            uint256 randomFactor = (randomSeed % 40) + 90; // 90-130%
            uint256 yield = (baseYield * randomFactor) / 100;

            accumulatedYield += yield;
            lastYieldUpdate = block.timestamp;

            emit YieldGenerated(yield);
        }
    }

    /**
     * @notice Deposit assets (only vault)
     * @param assets Amount to deposit
     * @param receiver Address receiving shares
     * @return shares Amount of shares minted
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override onlyVault nonReentrant returns (uint256) {
        _generateYield();
        return super.deposit(assets, receiver);
    }

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
     * @return Total assets managed by strategy
     */
    function totalAssets() public view virtual override returns (uint256) {
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this));

        // Calculate pending yield
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        uint256 pendingYield = 0;

        if (timeElapsed > 0 && baseAssets > 0) {
            uint256 baseYield = (baseAssets * baseAPY * timeElapsed) /
                (365 days * 10000);
            uint256 randomSeed = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        address(this)
                    )
                )
            );
            uint256 randomFactor = (randomSeed % 40) + 90;
            pendingYield = (baseYield * randomFactor) / 100;
        }

        return baseAssets + accumulatedYield + pendingYield;
    }

    /**
     * @notice Get strategy balance (alias for totalAssets)
     * @return Total assets in strategy
     */
    function balanceOf() external view returns (uint256) {
        return totalAssets();
    }

    /**
     * @notice Harvest accumulated yield (only vault)
     * @return Amount of yield harvested
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
     * @notice Get current estimated APY
     * @return APY in basis points with random variation
     */
    function estimatedAPY() external view returns (uint256) {
        // Return APY with some random variation (±10%)
        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    address(this)
                )
            )
        );
        uint256 randomFactor = (randomSeed % 20) + 90; // 90-110%
        return (baseAPY * randomFactor) / 100;
    }

    /**
     * @notice Withdraw all assets from strategy (only vault)
     * @return Total amount withdrawn
     */
    function withdrawAll() external onlyVault nonReentrant returns (uint256) {
        _generateYield();
        uint256 total = IERC20(asset()).balanceOf(address(this));

        if (total > 0) {
            IERC20(asset()).safeTransfer(vault, total);
        }

        return total;
    }
}
