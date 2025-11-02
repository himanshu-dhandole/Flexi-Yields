// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IStrategy.sol";
import "./StrategyManager.sol";

contract YieldVault is ERC4626, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    StrategyManager public immutable strategyManager;

    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public lastRebalance;
    uint256 public rebalanceInterval = 1 days;

    uint256 public performanceFee = 1000; // 10% performance fee (basis points)
    uint256 public withdrawalFee = 50; // 0.5% withdrawal fee (basis points)
    address public feeRecipient;

    uint256 private constant MAX_PERFORMANCE_FEE = 2000; // 20%
    uint256 private constant MAX_WITHDRAWAL_FEE = 500; // 5%
    uint256 private constant BASIS_POINTS = 10000;

    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event Rebalanced(uint256 timestamp, uint256 totalAssets);
    event FeesCollected(uint256 amount, string feeType);
    event Harvested(uint256 totalYield);
    event RebalanceIntervalUpdated(uint256 newInterval);
    event PerformanceFeeUpdated(uint256 newFee);
    event WithdrawalFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address indexed newRecipient);
    event EmergencyWithdraw(uint256 amount);

    constructor(
        IERC20 _asset,
        address _strategyManager
    ) ERC4626(_asset) ERC20("FLEX VAULT TOKEN", "FLEX") Ownable(msg.sender) {
        require(
            _strategyManager != address(0),
            "YieldVault: Invalid strategy manager"
        );
        strategyManager = StrategyManager(_strategyManager);
        feeRecipient = msg.sender;
        lastRebalance = block.timestamp;
    }

    function deposit(
        uint256 assets,
        address receiver
    ) public override nonReentrant whenNotPaused returns (uint256) {
        require(assets > 0, "YieldVault: Cannot deposit 0");

        uint256 shares = super.deposit(assets, receiver);
        totalDeposited += assets;

        emit Deposited(receiver, assets, shares);

        // Auto-rebalance if interval has passed
        if (block.timestamp >= lastRebalance + rebalanceInterval) {
            _rebalance();
        }

        return shares;
    }

    function mint(
        uint256 shares,
        address receiver
    ) public override nonReentrant whenNotPaused returns (uint256) {
        require(shares > 0, "YieldVault: Cannot mint 0");

        uint256 assets = super.mint(shares, receiver);
        totalDeposited += assets;

        emit Deposited(receiver, assets, shares);

        if (block.timestamp >= lastRebalance + rebalanceInterval) {
            _rebalance();
        }

        return assets;
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override nonReentrant returns (uint256) {
        require(assets > 0, "YieldVault: Cannot withdraw 0");

        // Compute fee on gross requested assets
        uint256 fee = (assets * withdrawalFee) / BASIS_POINTS;
        uint256 assetsAfterFee = assets - fee;

        // Ensure enough liquidity for the gross assets amount
        uint256 availableBalance = IERC20(asset()).balanceOf(address(this));
        if (availableBalance < assets) {
            _withdrawFromStrategies(assets - availableBalance);
        }

        // Burn shares and pull the gross assets into vault
        // Call withdraw with receiver = address(this) so assets come to vault
        uint256 burnedShares = super.withdraw(assets, address(this), owner);
        totalWithdrawn += assets; // or assetsAfterFee if you want net accounting

        // Transfer fee then send remaining to receiver
        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            emit FeesCollected(fee, "withdrawal");
        }

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);

        emit Withdrawn(receiver, assetsAfterFee, burnedShares);
        return burnedShares;
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override nonReentrant returns (uint256) {
        require(shares > 0, "YieldVault: Cannot redeem 0");

        uint256 expectedAssets = previewRedeem(shares);
        uint256 available = IERC20(asset()).balanceOf(address(this));

        if (available < expectedAssets) {
            _withdrawFromStrategies(expectedAssets - available);
            available = IERC20(asset()).balanceOf(address(this));
        }

        // Check available liquidity again
        uint256 redeemable = available < expectedAssets
            ? available
            : expectedAssets;
        require(redeemable > 0, "YieldVault: Insufficient liquidity");

        // Burn shares directly instead of using super.redeem()
        _burn(owner, shares);

        uint256 fee = (redeemable * withdrawalFee) / BASIS_POINTS;
        uint256 assetsAfterFee = redeemable - fee;

        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            emit FeesCollected(fee, "withdrawal");
        }

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);

        emit Withdrawn(receiver, assetsAfterFee, shares);
        totalWithdrawn += redeemable;

        return assetsAfterFee;
    }

    //*********** Strategy Management ***********

    function totalAssets() public view override returns (uint256) {
        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        uint256 strategiesBalance = _getTotalStrategyBalances();
        return vaultBalance + strategiesBalance;
    }

    function _getTotalStrategyBalances() internal view returns (uint256) {
        uint256 total = 0;
        uint256 strategyCount = strategyManager.getStrategyCount();

        for (uint256 i = 0; i < strategyCount; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (active) {
                try IStrategy(strategy).balanceOf() returns (uint256 balance) {
                    total += balance;
                } catch {
                    // Skip strategy if call fails
                    continue;
                }
            }
        }

        return total;
    }

    function rebalance() external onlyOwner {
        _rebalance();
    }

    function _rebalance() internal {
        // Harvest all strategies first
        _harvestAll();

        uint256 totalBalance = IERC20(asset()).balanceOf(address(this));

        if (totalBalance == 0) return;

        // Allocate to strategies based on allocation percentages
        uint256 strategyCount = strategyManager.getStrategyCount();

        for (uint256 i = 0; i < strategyCount; i++) {
            (
                address strategy,
                uint256 allocation,
                bool active
            ) = strategyManager.getStrategy(i);

            if (active && allocation > 0) {
                uint256 targetAmount = (totalBalance * allocation) /
                    BASIS_POINTS;

                if (targetAmount > 0) {
                    IERC20(asset()).approve(strategy, targetAmount);
                    try
                        IStrategy(strategy).deposit(targetAmount, address(this))
                    {
                        // Deposit successful
                    } catch {
                        // Skip strategy if deposit fails
                        continue;
                    }
                }
            }
        }

        lastRebalance = block.timestamp;
        emit Rebalanced(block.timestamp, totalAssets());
    }

    function _withdrawFromStrategies(uint256 amount) internal {
        uint256 remaining = amount;
        uint256 strategyCount = strategyManager.getStrategyCount();

        for (uint256 i = 0; i < strategyCount && remaining > 0; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (!active) continue;

            try IStrategy(strategy).balanceOf() returns (
                uint256 strategyBalance
            ) {
                if (strategyBalance == 0) continue;

                uint256 toWithdraw = remaining > strategyBalance
                    ? strategyBalance
                    : remaining;

                try
                    IStrategy(strategy).withdraw(
                        toWithdraw,
                        address(this),
                        address(this)
                    )
                returns (uint256 withdrawn) {
                    if (withdrawn > 0) {
                        if (withdrawn >= remaining) remaining = 0;
                        else remaining -= withdrawn;
                    }
                } catch {
                    continue;
                }
            } catch {
                continue;
            }
        }

        // revert only if nothing was pulled
        require(remaining != amount, "YieldVault: Insufficient liquidity");
    }

    function harvestAll() external onlyOwner returns (uint256) {
        return _harvestAll();
    }

    function _harvestAll() internal returns (uint256) {
        uint256 totalYield = 0;
        uint256 strategyCount = strategyManager.getStrategyCount();

        for (uint256 i = 0; i < strategyCount; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);

            if (active) {
                try IStrategy(strategy).harvest() returns (uint256 yield) {
                    totalYield += yield;
                } catch {
                    // Skip strategy if harvest fails
                    continue;
                }
            }
        }

        // Collect performance fee
        if (totalYield > 0) {
            uint256 fee = (totalYield * performanceFee) / BASIS_POINTS;
            if (fee > 0 && feeRecipient != address(0)) {
                emit FeesCollected(fee, "performance");
            }
            emit Harvested(totalYield);
        }

        return totalYield;
    }

    //*********** View Functions ***********

    function getStrategyBalances()
        external
        view
        returns (address[] memory strategyAddresses, uint256[] memory balances)
    {
        uint256 count = strategyManager.getStrategyCount();
        strategyAddresses = new address[](count);
        balances = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            strategyAddresses[i] = strategy;

            if (active) {
                try IStrategy(strategy).balanceOf() returns (uint256 balance) {
                    balances[i] = balance;
                } catch {
                    balances[i] = 0;
                }
            } else {
                balances[i] = 0;
            }
        }

        return (strategyAddresses, balances);
    }

    function getStrategyAPYs()
        external
        view
        returns (address[] memory strategyAddresses, uint256[] memory apys)
    {
        uint256 count = strategyManager.getStrategyCount();
        strategyAddresses = new address[](count);
        apys = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            strategyAddresses[i] = strategy;

            if (active) {
                try IStrategy(strategy).estimatedAPY() returns (uint256 apy) {
                    apys[i] = apy;
                } catch {
                    apys[i] = 0;
                }
            } else {
                apys[i] = 0;
            }
        }

        return (strategyAddresses, apys);
    }

    function estimatedVaultAPY() external view returns (uint256) {
        uint256 totalAssets_ = totalAssets();
        if (totalAssets_ == 0) return 0;

        uint256 weightedAPY = 0;
        uint256 strategyCount = strategyManager.getStrategyCount();

        for (uint256 i = 0; i < strategyCount; i++) {
            (
                address strategy,
                uint256 allocation,
                bool active
            ) = strategyManager.getStrategy(i);

            if (active && allocation > 0) {
                try IStrategy(strategy).estimatedAPY() returns (
                    uint256 strategyAPY
                ) {
                    weightedAPY += (strategyAPY * allocation) / BASIS_POINTS;
                } catch {
                    // Skip strategy if APY call fails
                    continue;
                }
            }
        }

        return weightedAPY;
    }

    function getVaultStats()
        external
        view
        returns (
            uint256 totalDeposited_,
            uint256 totalWithdrawn_,
            uint256 totalAssets_,
            uint256 totalShares
        )
    {
        return (totalDeposited, totalWithdrawn, totalAssets(), totalSupply());
    }

    //*********** Admin Functions ***********

    function setRebalanceInterval(uint256 _interval) external onlyOwner {
        require(_interval >= 1 hours, "YieldVault: Interval too short");
        require(_interval <= 30 days, "YieldVault: Interval too long");
        rebalanceInterval = _interval;
        emit RebalanceIntervalUpdated(_interval);
    }

    function setPerformanceFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_PERFORMANCE_FEE, "YieldVault: Fee too high");
        performanceFee = _fee;
        emit PerformanceFeeUpdated(_fee);
    }

    function setWithdrawalFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_WITHDRAWAL_FEE, "YieldVault: Fee too high");
        withdrawalFee = _fee;
        emit WithdrawalFeeUpdated(_fee);
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "YieldVault: Invalid recipient");
        feeRecipient = _recipient;
        emit FeeRecipientUpdated(_recipient);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdrawAll() external onlyOwner {
        uint256 strategyCount = strategyManager.getStrategyCount();
        uint256 totalWithdrawn_ = 0;

        for (uint256 i = 0; i < strategyCount; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (active) {
                try IStrategy(strategy).withdrawAll() returns (uint256 amount) {
                    totalWithdrawn_ += amount;
                } catch {
                    // Continue even if a strategy fails
                    continue;
                }
            }
        }

        emit EmergencyWithdraw(totalWithdrawn_);
    }
}
