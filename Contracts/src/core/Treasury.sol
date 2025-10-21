// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract Vault is Ownable , ReentrancyGuard  {
    struct userData {
        uint lockedBalance;
        uint availableBalance;
    }
    IERC20 public immutable vUSDT;
    mapping(address => userData) public UserData;

    constructor(address _vUSDT) Ownable(msg.sender) {
        vUSDT = IERC20(_vUSDT);
    }

    function deposit(uint _amount) external nonReentrant {
        require(_amount >= 0 , "Amount must be greater than zero");
        require(vUSDT.allowance(msg.sender , address(this)) > _amount , "Insufficient allowance");
        require(vUSDT.transferFrom(msg.sender , address(this) , _amount) , "Transfer failed"); 
        UserData[msg.sender].availableBalance += _amount;
    }

    function withdraw(uint _amount) external nonReentrant {
        require(_amount > 0 , "Amount must be greater than zer");
        require(UserData[msg.sender].availableBalance >= _amount , "Insufficient balance");
        require(vUSDT.transfer(msg.sender , _amount) , "Transfer failed");
        UserData[msg.sender].availableBalance -= _amount;
    }

    function getBalance(address _user) external view returns (userData memory) {
        return UserData[_user];
    }

}
