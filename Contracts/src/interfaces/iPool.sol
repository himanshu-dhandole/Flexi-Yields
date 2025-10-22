// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface iPool {
    function deposit(uint256) external;
    function withdrawAll(address to) external returns (uint256);
    function currentYield() external view returns (uint256);
}
