// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/iTreasury.sol";
import "../interfaces/iPool.sol";

// interface IVault {
//     function userData(address) external view returns (uint256 locked, uint256 available);
//     function lockCollateral(address _user, uint256 _amount) external;
//     function unlockCollateral(address _user, uint256 _amount) external;
//     function vUSDT() external view returns (address);
// }

// interface IYieldPool {
//     function deposit(uint256) external;
//     function withdrawAll(address to) external returns (uint256);
//     function currentYield() external view returns (uint256);
// }

contract YieldRouter is Ownable, ReentrancyGuard {
    iTreasury public vault;
    IERC20 public vUSDT;
    iPool[] public pools;

    struct UserInfo {
        uint256 amount;
        uint8 poolIndex;
        uint256 depositTime;
    }

    mapping(address => UserInfo) public users;

    event Deposited(address indexed user, uint8 poolIndex, uint256 amount);
    event Claimed(address indexed user, uint256 oldPool, uint256 newPool, uint256 totalReturned);

    constructor(address _vault) Ownable(msg.sender) {
        vault = iTreasury(_vault);
        vUSDT = IERC20(vault.vUSDT());
    }

    function addPool(address _pool) external onlyOwner {
        pools.push(iPool(_pool));
    }

    // --- deposit via vault ---
    function deposit(uint256 amount) external nonReentrant {
        (, uint256 available) = vault.userData(msg.sender);
        require(available >= amount, "Not enough in vault");
        vault.lockCollateral(msg.sender, amount);

        uint8 best = _getBestPool();
        vUSDT.approve(address(pools[best]), amount);
        pools[best].deposit(amount);

        users[msg.sender] = UserInfo({
            amount: amount,
            poolIndex: best,
            depositTime: block.timestamp
        });

        emit Deposited(msg.sender, best, amount);
    }

    // --- claim + redistribute ---
    function claimAndRedistribute() external nonReentrant {
        UserInfo storage info = users[msg.sender];
        require(info.amount > 0, "Nothing to claim");

        uint8 oldPool = info.poolIndex;
        uint256 amountOut = pools[oldPool].withdrawAll(address(this));
        vault.unlockCollateral(msg.sender, info.amount);

        uint8 newBest = _getBestPool();
        vUSDT.approve(address(pools[newBest]), amountOut);
        pools[newBest].deposit(amountOut);

        info.amount = amountOut;
        info.poolIndex = newBest;
        info.depositTime = block.timestamp;

        emit Claimed(msg.sender, oldPool, newBest, amountOut);
    }

    // --- helper: pick highest current yield ---
    function _getBestPool() internal view returns (uint8 best) {
        uint256 highest = 0;
        for (uint8 i = 0; i < pools.length; i++) {
            uint256 y = pools[i].currentYield();
            if (y > highest) {
                highest = y;
                best = i;
            }
        }
    }
}
