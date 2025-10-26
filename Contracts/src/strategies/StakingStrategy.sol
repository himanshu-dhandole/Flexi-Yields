// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./BaseStrategy.sol";
/**
 * @title StakingStrategy
 * @notice Simulates staking strategy
 * @dev Medium risk, medium yield strategy
 */
contract StakingStrategy is BaseStrategy {
    constructor(IERC20 _asset) 
        BaseStrategy(
            _asset, 
            "Staking Strategy Vault", 
            "stVault", 
            700 // 7% base APY
        ) 
    {}
}