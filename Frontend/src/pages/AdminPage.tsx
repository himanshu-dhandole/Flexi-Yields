"use client";

import DefaultLayout from "@/layouts/default";
import { useAccount } from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { config } from "@/config/wagmiConfig";
import { formatUnits } from "viem";
import {
  Terminal,
  Wallet,
  Settings,
  ShieldAlert,
  TrendingUp,
  Database,
  Zap,
  Pause,
  Play,
  AlertTriangle,
} from "lucide-react";

import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";

export default function AdminConsole() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [vaultDetails, setVaultDetails] = useState<any>(null);
  const [strategyAssets, setStrategyAssets] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({
    interval: "",
    performanceFee: "",
    withdrawalFee: "",
    recipient: "",
  });

  const YIELD_VAULT_ADDRESS = import.meta.env
    .VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const LENDING_STRATEGY_ADDRESS = import.meta.env
    .VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
  const LIQUIDITY_STRATEGY_ADDRESS = import.meta.env
    .VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
  const STAKING_STRATEGY_ADDRESS = import.meta.env
    .VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;

  // Toast Helper
  const notify = (
    type: "success" | "error" | "info",
    message: string,
    tx?: string
  ) => {
    const opts = {
      description: tx ? (
        <a
          href={`https://explorer.testnet.chain.com/tx/${tx}`}
          target="_blank"
          className="underline text-[#FF6B2C]/80"
        >
          View on Explorer
        </a>
      ) : undefined,
      duration: 4000,
    };
    if (type === "success") toast.success(message, opts);
    else if (type === "error") toast.error(message, opts);
    else toast(message, opts);
  };

  // ---------- Load Data ----------
  useEffect(() => {
    if (address) {
      loadVaultDetails();
      loadStrategyAssets();
    }
  }, [address]);

  const loadVaultDetails = async () => {
    try {
      const [totalAssets, perfFee] = await Promise.all([
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "performanceFee",
        }),
      ]);
      setVaultDetails({
        totalAssets: formatUnits(totalAssets as bigint, 18),
        perfFee,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadStrategyAssets = async () => {
    try {
      const [lending, staking, liquidity] = await Promise.all([
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
      ])as [bigint , bigint , bigint];

      setStrategyAssets({
        lending: formatUnits(lending, 18),
        staking: formatUnits(staking, 18),
        liquidity: formatUnits(liquidity, 18),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Admin Actions ----------
  const runAdminAction = async (fn: string, args: any[] = []) => {
    if (!address) return notify("error", "Wallet not connected");
    try {
      setLoading(true);
      notify("info", `Executing ${fn}...`);
      const hash = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: fn,
        args,
        account: address,
      });
      const receipt = await waitForTransactionReceipt(config, { hash });
      if (receipt.status === "success")
        notify("success", `${fn} executed successfully`, hash);
    } catch (err) {
      console.error(err);
      notify("error", `${fn} failed`);
    } finally {
      setLoading(false);
    }
  };

  const updateInput = (key: string, val: string) =>
    setInputs({ ...inputs, [key]: val });

  return (
    <DefaultLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0F0F0F",
            color: "#F5F5F5",
            border: "1px solid #FF6B2C40",
            borderRadius: "10px",
            fontFamily: "monospace",
          },
        }}
      />

      <section className="min-h-screen bg-background py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#FF6B2C]/20 pb-6">
            <div className="flex items-center gap-3">
              <Terminal className="h-8 w-8 text-[#FF6B2C]" />
              <h1 className="text-3xl font-mono font-bold">ADMIN DASHBOARD</h1>
            </div>
            <div className="text-sm font-mono flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#FF6B2C]" />
              {address || "NOT CONNECTED"}
            </div>
          </div>

          {/* Live Data */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#FF6B2C]/30 p-5 rounded-xl bg-[#121212]">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-[#FF6B2C]" />
                <h3 className="font-mono font-semibold text-lg">
                  Vault Details
                </h3>
              </div>
              {vaultDetails ? (
                <div className="space-y-1 font-mono text-sm">
                  <p>Total Assets: {vaultDetails.totalAssets} USDT</p>
                  <p>Performance Fee: {vaultDetails.perfFee?.toString()}</p>
                </div>
              ) : (
                <p className="text-neutral-500 font-mono text-sm">
                  Loading vault details...
                </p>
              )}
            </div>

            <div className="border border-[#FF6B2C]/30 p-5 rounded-xl bg-[#121212]">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-[#FF6B2C]" />
                <h3 className="font-mono font-semibold text-lg">
                  Strategy Assets
                </h3>
              </div>
              {strategyAssets ? (
                <div className="space-y-1 font-mono text-sm">
                  <p>Lending: {strategyAssets.lending} USDT</p>
                  <p>Staking: {strategyAssets.staking} USDT</p>
                  <p>Liquidity: {strategyAssets.liquidity} USDT</p>
                </div>
              ) : (
                <p className="text-neutral-500 font-mono text-sm">
                  Loading strategy data...
                </p>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="border-t border-[#FF6B2C]/20 pt-8 space-y-8">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-[#FF6B2C]" />
              <h2 className="font-mono text-2xl font-bold">System Controls</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <input
                  type="number"
                  placeholder="Rebalance Interval (sec)"
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 rounded-md font-mono text-sm mb-2"
                  onChange={(e) => updateInput("interval", e.target.value)}
                />
                <button
                  disabled={loading}
                  onClick={() =>
                    runAdminAction("setRebalanceInterval", [
                      BigInt(inputs.interval),
                    ])
                  }
                  className="w-full px-4 py-2 font-mono text-sm border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition"
                >
                  Set Rebalance Interval
                </button>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Performance Fee"
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 rounded-md font-mono text-sm mb-2"
                  onChange={(e) => updateInput("performanceFee", e.target.value)}
                />
                <button
                  disabled={loading}
                  onClick={() =>
                    runAdminAction("setPerformanceFee", [
                      BigInt(inputs.performanceFee),
                    ])
                  }
                  className="w-full px-4 py-2 font-mono text-sm border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition"
                >
                  Set Performance Fee
                </button>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Withdrawal Fee"
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 rounded-md font-mono text-sm mb-2"
                  onChange={(e) => updateInput("withdrawalFee", e.target.value)}
                />
                <button
                  disabled={loading}
                  onClick={() =>
                    runAdminAction("setWithdrawalFee", [
                      BigInt(inputs.withdrawalFee),
                    ])
                  }
                  className="w-full px-4 py-2 font-mono text-sm border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition"
                >
                  Set Withdrawal Fee
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Fee Recipient Address"
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 rounded-md font-mono text-sm mb-2"
                  onChange={(e) => updateInput("recipient", e.target.value)}
                />
                <button
                  disabled={loading}
                  onClick={() =>
                    runAdminAction("setFeeRecipient", [inputs.recipient])
                  }
                  className="w-full px-4 py-2 font-mono text-sm border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition"
                >
                  Set Fee Recipient
                </button>
              </div>

              <button
                disabled={loading}
                onClick={() => runAdminAction("pause")}
                className="flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm border border-red-500/40 hover:border-red-500 hover:bg-red-500/10 transition"
              >
                <Pause className="h-4 w-4" /> Pause Vault
              </button>

              <button
                disabled={loading}
                onClick={() => runAdminAction("unpause")}
                className="flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm border border-green-400/40 hover:border-green-500 hover:bg-green-500/10 transition"
              >
                <Play className="h-4 w-4" /> Unpause Vault
              </button>

              <button
                disabled={loading}
                onClick={() => runAdminAction("emergencyWithdrawAll")}
                className="flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition"
              >
                <AlertTriangle className="h-4 w-4" /> Emergency Withdraw All
              </button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
