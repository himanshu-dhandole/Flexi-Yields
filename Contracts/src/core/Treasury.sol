// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Vault is Ownable {
    IERC20 public immutable vUSDT;
    mapping(address => uint) public balances;

    constructor(address _vUSDT) Ownable(msg.sender) {
        vUSDT = IERC20(_vUSDT);
    }

    function deposit(uint _amount) external {
        require(_amount > 0 , "Amount must be greater than zero");
        require(vUSDT.allowance(msg.sender , address(this)) > _amount , "Insufficient allowance");
        require(vUSDT.transferFrom(msg.sender , address(this) , _amount) , "Transfer failed"); 
        balances[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        require(balances[msg.sender] >= _amount , "Insufficient balance");
        require(vUSDT.transfer(msg.sender , _amount) , "Transfer failed");
        balances[msg.sender] -= _amount;
    }

    function getBalance(address _user) external view returns (uint) {
        return balances[_user];
    }

}
