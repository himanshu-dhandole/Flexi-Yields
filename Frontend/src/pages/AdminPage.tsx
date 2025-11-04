import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAccount } from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useState } from "react";

import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import STRATEGY_MANAGER_ABI from "../abis/strategyManager.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";
import { config } from "@/config/wagmiConfig";
import { Button } from "@heroui/button";
import { formatUnits, parseUnits } from "viem";
import { toast } from "react-toastify";

export default function AdminPage() {
    const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const YIELD_VAULT_ADDRESS = import.meta.env
    .VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const STRATEGY_MANAGER_ADDRESS = import.meta.env
    .VITE_STRATEGY_MANAGER_ADDRESS as `0x${string}`;
  const LENDING_STRATEGY_ADDRESS = import.meta.env
    .VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
  const LIQUIDITY_STRATEGY_ADDRESS = import.meta.env
    .VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
  const STAKING_STRATEGY_ADDRESS = import.meta.env
    .VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;

  const { address } = useAccount();
  const [vusdtBalance, setVusdtBalance] = useState<string>("0");
  const [vaultAssets, setVaultAssets] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState<string>("100");

  const Rebalance = async () => {
    if (!address) {
      alert("Please connect your wallet.");
      return;
    }
    try {
      const tx = await writeContract(config ,{
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "rebalance",
        account: address,
      });
      const receipt = await waitForTransactionReceipt(config, { hash: tx });
      toast("Rebalance successful!");
    } catch (error) {
      console.error("Rebalance failed:", error);
      toast.error("Rebalance failed. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Pricing</h1>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button onClick={Rebalance}>Rebalance Vault</Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
