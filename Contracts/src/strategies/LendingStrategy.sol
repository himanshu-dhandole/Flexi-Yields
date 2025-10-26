// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./BaseStrategy.sol";
/**
 * @title LendingStrategy
 * @notice Simulates lending protocol strategy (Aave-like)
 * @dev Lower risk, lower yield strategy
 */
contract LendingStrategy is BaseStrategy {
    constructor(IERC20 _asset) 
        BaseStrategy(
            _asset, 
            "Lending Strategy Vault", 
            "lsVault", 
            400 // 4% base APY
        ) 
    {}
}