// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategyManager {
    struct StrategyInfo {
        address strategy;
        uint256 allocation;
        bool active;
    }
    
    function addStrategy(address strategy, uint256 allocation) external;
    function removeStrategy(uint256 index) external;
    function updateAllocation(uint256 index, uint256 newAllocation) external;
    function getActiveStrategies() external view returns (StrategyInfo[] memory);
    function getTotalAllocation() external view returns (uint256);
    function getStrategyCount() external view returns (uint256);
    function getStrategy(uint256 index) external view returns (
        address strategy,
        uint256 allocation,
        bool active
    );
}