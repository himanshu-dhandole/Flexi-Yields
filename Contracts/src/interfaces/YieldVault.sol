// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYieldVault {
    function rebalance() external;
    function harvestAll() external returns (uint256);
    function totalAssets() external view returns (uint256);
    function estimatedVaultAPY() external view returns (uint256);
}