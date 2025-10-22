// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/core/vUSDT.sol";
import "../src/core/Treasury.sol";
import "../src/core/Pool.sol";
import "../src/core/PoolRouter.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1️⃣ Deploy mock token
        VirtualUSDT vusdt = new VirtualUSDT();
        console.log(" VirtualUSDT deployed at:", address(vusdt));

        // 2️⃣ Deploy Vault (Treasury)
        Vault vault = new Vault(address(vusdt));
        console.log(" Vault deployed at:", address(vault));

        // 3️⃣ Deploy Yield Pools
        YieldPool pool1 = new YieldPool(address(vusdt));
        YieldPool pool2 = new YieldPool(address(vusdt));
        YieldPool pool3 = new YieldPool(address(vusdt));
        console.log(" YieldPool1:", address(pool1));
        console.log(" YieldPool2:", address(pool2));
        console.log(" YieldPool3:", address(pool3));

        // 4️⃣ Mint initial liquidity to each pool (so pools can pay yield)
        uint256 poolFund = 5_000_000e18; // 5 million vUSDT each
        vusdt.mint(address(pool1), poolFund);
        vusdt.mint(address(pool2), poolFund);
        vusdt.mint(address(pool3), poolFund);
        console.log(" Funded each pool with:", poolFund / 1e18, "VUSDT");

        // 5️⃣ Deploy Router
        YieldRouter router = new YieldRouter(address(vault));
        console.log(" YieldRouter deployed at:", address(router));

        // 6️⃣ Add pools to router
        router.addPool(address(pool1));
        router.addPool(address(pool2));
        router.addPool(address(pool3));
        console.log(" Pools added to router");

        // 7️⃣ Transfer Vault ownership to router (optional)
        vault.transferOwnership(address(router));
        console.log(" Vault ownership transferred to router");

        vm.stopBroadcast();
    }
}