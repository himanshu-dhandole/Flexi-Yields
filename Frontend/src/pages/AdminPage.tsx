"use client";

import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { config } from "@/config/wagmiConfig";
import { formatUnits, parseUnits } from "viem";
import {
  Terminal,
  Wallet,
  Settings,
  TrendingUp,
  Database,
  Pause,
  Play,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  PieChart,
  Activity,
  Lock,
  Unlock,
  Target,
  Zap,
  BarChart3,
  Shield,
  Users,
  Key,
  Eye,
  Coins,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import STRATEGY_MANAGER_ABI from "../abis/strategyManager.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";

export default function AdminDashboard() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Contract addresses
  const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const STRATEGY_MANAGER_ADDRESS = import.meta.env.VITE_STRATEGY_MANAGER_ADDRESS as `0x${string}`;
  const LENDING_STRATEGY_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
  const LIQUIDITY_STRATEGY_ADDRESS = import.meta.env.VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
  const STAKING_STRATEGY_ADDRESS = import.meta.env.VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;

  // State for all data
  const [vaultData, setVaultData] = useState<any>(null);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [allocations, setAllocations] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Form inputs
  const [inputs, setInputs] = useState({
    interval: "",
    performanceFee: "",
    withdrawalFee: "",
    recipient: "",
    strategyIndex: "",
    newAllocation: "",
    agentAddress: "",
    keeperAddress: "",
    maxSingle: "",
    maxShift: "",
    minConfidence: "",
    cooldown: "",
  });

  const notify = (type: "success" | "error" | "info", message: string) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
  };

  // Load all data
  const loadAllData = async () => {
    if (!address) return;
    try {
      setLoading(true);

      // Vault data
      const [totalAssets, perfFee, withdrawFee, feeRecipient, rebalanceInterval, paused, stats] = await Promise.all([
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "totalAssets" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "performanceFee" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "withdrawalFee" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "feeRecipient" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "rebalanceInterval" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "paused" }),
        readContract(config, { address: YIELD_VAULT_ADDRESS, abi: YIELD_VAULT_ABI, functionName: "getVaultStats" }),
      ]);

      setVaultData({
        totalAssets: formatUnits(totalAssets as bigint, 18),
        perfFee: Number(perfFee) / 100,
        withdrawFee: Number(withdrawFee) / 100,
        feeRecipient,
        rebalanceInterval: Number(rebalanceInterval),
        stats,
      });
      setIsPaused(paused as boolean);

      // Strategy Manager data
      const [strategyCount, activeStrategies, totalAllocation] = await Promise.all([
        readContract(config, { address: STRATEGY_MANAGER_ADDRESS, abi: STRATEGY_MANAGER_ABI, functionName: "getStrategyCount" }),
        readContract(config, { address: STRATEGY_MANAGER_ADDRESS, abi: STRATEGY_MANAGER_ABI, functionName: "getActiveStrategies" }),
        readContract(config, { address: STRATEGY_MANAGER_ADDRESS, abi: STRATEGY_MANAGER_ABI, functionName: "getTotalAllocation" }),
      ]);

      setAllocations({
        count: Number(strategyCount),
        active: activeStrategies,
        total: Number(totalAllocation),
      });

      // Individual strategy data
      const [lendingAssets, stakingAssets, liquidityAssets] = await Promise.all([
        readContract(config, { address: LENDING_STRATEGY_ADDRESS, abi: LENDING_STRATEGY_ABI, functionName: "totalAssets" }),
        readContract(config, { address: STAKING_STRATEGY_ADDRESS, abi: STAKING_STRATEGY_ABI, functionName: "totalAssets" }),
        readContract(config, { address: LIQUIDITY_STRATEGY_ADDRESS, abi: LIQUIDITY_STRATEGY_ABI, functionName: "totalAssets" }),
      ]);

      setStrategyData({
        lending: formatUnits(lendingAssets as bigint, 18),
        staking: formatUnits(stakingAssets as bigint, 18),
        liquidity: formatUnits(liquidityAssets as bigint, 18),
      });

    } catch (err) {
      console.error(err);
      notify("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadAllData();
  }, [address]);

  // Admin actions
  const executeAction = async (fn: string, args: any[] = [], contractAddress = YIELD_VAULT_ADDRESS, abi = YIELD_VAULT_ABI) => {
    if (!address) return notify("error", "Wallet not connected");
    try {
      setLoading(true);
      notify("info", `Executing ${fn}...`);
      
      const hash = await writeContract(config, {
        address: contractAddress,
        abi,
        functionName: fn,
        args,
        account: address,
        gas: 12_000_000n,
      });

      const receipt = await waitForTransactionReceipt(config, { hash });
      if (receipt.status === "success") {
        notify("success", `${fn} executed successfully`);
        await loadAllData();
      }
    } catch (err: any) {
      console.error(err);
      notify("error", err.message || `${fn} failed`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: Activity },
    { id: "vault", label: "VAULT CONFIG", icon: Settings },
    { id: "strategies", label: "STRATEGIES", icon: PieChart },
    { id: "ai", label: "AI SETTINGS", icon: Zap },
    { id: "emergency", label: "EMERGENCY", icon: AlertTriangle },
  ];

  if (!address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-[#FF6B2C] mx-auto mb-4" />
          <h2 className="text-2xl font-mono font-bold mb-2">CONNECT WALLET</h2>
          <p className="text-muted-foreground font-mono">Admin access requires wallet connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FF6B2C]/20 pb-6">
          <div className="flex items-center gap-3">
            <Terminal className="h-8 w-8 text-[#FF6B2C]" />
            <div>
              <h1 className="text-3xl font-mono font-bold">ADMIN CONTROL CENTER</h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition font-mono text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-mono text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#FF6B2C] text-white"
                  : "border border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <OverviewTab
              vaultData={vaultData}
              strategyData={strategyData}
              allocations={allocations}
              isPaused={isPaused}
            />
          )}

          {activeTab === "vault" && (
            <VaultConfigTab
              inputs={inputs}
              setInputs={setInputs}
              executeAction={executeAction}
              loading={loading}
              vaultData={vaultData}
              isPaused={isPaused}
            />
          )}

          {activeTab === "strategies" && (
            <StrategiesTab
              inputs={inputs}
              setInputs={setInputs}
              executeAction={executeAction}
              loading={loading}
              allocations={allocations}
              strategyData={strategyData}
              STRATEGY_MANAGER_ADDRESS={STRATEGY_MANAGER_ADDRESS}
            />
          )}

          {activeTab === "ai" && (
            <AISettingsTab
              inputs={inputs}
              setInputs={setInputs}
              executeAction={executeAction}
              loading={loading}
              STRATEGY_MANAGER_ADDRESS={STRATEGY_MANAGER_ADDRESS}
            />
          )}

          {activeTab === "emergency" && (
            <EmergencyTab
              executeAction={executeAction}
              loading={loading}
              isPaused={isPaused}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ vaultData, strategyData, allocations, isPaused }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* System Status */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-[#FF6B2C]" />
          <h3 className="font-mono font-semibold text-lg">SYSTEM STATUS</h3>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={isPaused ? "text-red-500" : "text-green-500"}>
              {isPaused ? "PAUSED" : "ACTIVE"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Strategies:</span>
            <span>{allocations?.count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Allocation:</span>
            <span>{allocations?.total || 0}%</span>
          </div>
        </div>
      </div>

      {/* Vault Metrics */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-5 w-5 text-[#FF6B2C]" />
          <h3 className="font-mono font-semibold text-lg">VAULT METRICS</h3>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Assets:</span>
            <span>{vaultData?.totalAssets || "0"} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Performance Fee:</span>
            <span>{vaultData?.perfFee || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Withdrawal Fee:</span>
            <span>{vaultData?.withdrawFee || 0}%</span>
          </div>
        </div>
      </div>

      {/* Strategy Distribution */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="h-5 w-5 text-[#FF6B2C]" />
          <h3 className="font-mono font-semibold text-lg">DISTRIBUTION</h3>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lending:</span>
            <span>{strategyData?.lending || "0"} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Staking:</span>
            <span>{strategyData?.staking || "0"} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Liquidity:</span>
            <span>{strategyData?.liquidity || "0"} USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vault Config Tab
function VaultConfigTab({ inputs, setInputs, executeAction, loading, vaultData, isPaused }: any) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Rebalance Settings */}
        <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
          <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF6B2C]" />
            REBALANCE INTERVAL
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                Current: {vaultData?.rebalanceInterval || 0} seconds
              </label>
              <input
                type="number"
                placeholder="New interval (seconds)"
                value={inputs.interval}
                onChange={(e) => setInputs({ ...inputs, interval: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
              />
            </div>
            <button
              disabled={loading || !inputs.interval}
              onClick={() => executeAction("setRebalanceInterval", [BigInt(inputs.interval)])}
              className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
            >
              SET INTERVAL
            </button>
            <button
              disabled={loading}
              onClick={() => executeAction("rebalance")}
              className="w-full px-4 py-2 border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-sm"
            >
              REBALANCE NOW
            </button>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
          <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#FF6B2C]" />
            FEE CONFIGURATION
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                Performance Fee (Current: {vaultData?.perfFee}%)
              </label>
              <input
                type="number"
                placeholder="Basis points (1000 = 10%)"
                value={inputs.performanceFee}
                onChange={(e) => setInputs({ ...inputs, performanceFee: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
              />
              <button
                disabled={loading || !inputs.performanceFee}
                onClick={() => executeAction("setPerformanceFee", [BigInt(inputs.performanceFee)])}
                className="w-full mt-2 px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
              >
                SET PERFORMANCE FEE
              </button>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                Withdrawal Fee (Current: {vaultData?.withdrawFee}%)
              </label>
              <input
                type="number"
                placeholder="Basis points (50 = 0.5%)"
                value={inputs.withdrawalFee}
                onChange={(e) => setInputs({ ...inputs, withdrawalFee: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
              />
              <button
                disabled={loading || !inputs.withdrawalFee}
                onClick={() => executeAction("setWithdrawalFee", [BigInt(inputs.withdrawalFee)])}
                className="w-full mt-2 px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
              >
                SET WITHDRAWAL FEE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Recipient & Harvest */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
          <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-[#FF6B2C]" />
            FEE RECIPIENT
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                Current: {vaultData?.feeRecipient?.slice(0, 10)}...
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={inputs.recipient}
                onChange={(e) => setInputs({ ...inputs, recipient: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
              />
            </div>
            <button
              disabled={loading || !inputs.recipient}
              onClick={() => executeAction("setFeeRecipient", [inputs.recipient])}
              className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
            >
              UPDATE RECIPIENT
            </button>
          </div>
        </div>

        <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
          <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#FF6B2C]" />
            HARVEST YIELDS
          </h3>
          <p className="text-xs font-mono text-muted-foreground mb-4">
            Collect accumulated yields from all strategies
          </p>
          <button
            disabled={loading}
            onClick={() => executeAction("harvestAll")}
            className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            HARVEST ALL
          </button>
        </div>
      </div>
    </div>
  );
}

// Strategies Tab
function StrategiesTab({ inputs, setInputs, executeAction, loading, allocations, strategyData, STRATEGY_MANAGER_ADDRESS }: any) {
  return (
    <div className="space-y-6">
      {/* Active Strategies Display */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#FF6B2C]" />
          ACTIVE STRATEGIES
        </h3>
        <div className="space-y-3">
          {allocations?.active?.map((strat: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-[#FF6B2C]/20 bg-[#0F0F0F]">
              <div className="font-mono text-sm">
                <div className="text-muted-foreground">Strategy #{idx}</div>
                <div className="text-xs mt-1">{strat.strategy?.slice(0, 20)}...</div>
              </div>
              <div className="text-right">
                <div className="text-[#FF6B2C] font-mono font-bold">{Number(strat.allocation) / 100}%</div>
                <div className={`text-xs ${strat.active ? "text-green-500" : "text-red-500"}`}>
                  {strat.active ? "ACTIVE" : "INACTIVE"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Allocation */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-[#FF6B2C]" />
          UPDATE ALLOCATION
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Strategy Index (0, 1, 2)"
            value={inputs.strategyIndex}
            onChange={(e) => setInputs({ ...inputs, strategyIndex: e.target.value })}
            className="px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
          />
          <input
            type="number"
            placeholder="New Allocation (basis points)"
            value={inputs.newAllocation}
            onChange={(e) => setInputs({ ...inputs, newAllocation: e.target.value })}
            className="px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
          />
        </div>
        <button
          disabled={loading || !inputs.strategyIndex || !inputs.newAllocation}
          onClick={() =>
            executeAction(
              "updateAllocation",
              [BigInt(inputs.strategyIndex), BigInt(inputs.newAllocation)],
              STRATEGY_MANAGER_ADDRESS,
              STRATEGY_MANAGER_ABI
            )
          }
          className="w-full mt-4 px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
        >
          UPDATE ALLOCATION
        </button>
      </div>

      {/* Remove Strategy */}
      <div className="border border-red-500/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2 text-red-400">
          <XCircle className="h-5 w-5" />
          REMOVE STRATEGY
        </h3>
        <input
          type="number"
          placeholder="Strategy Index to Remove"
          value={inputs.strategyIndex}
          onChange={(e) => setInputs({ ...inputs, strategyIndex: e.target.value })}
          className="w-full px-3 py-2 bg-[#0F0F0F] border border-red-500/40 font-mono text-sm mb-4"
        />
        <button
          disabled={loading || !inputs.strategyIndex}
          onClick={() =>
            executeAction(
              "removeStrategy",
              [BigInt(inputs.strategyIndex)],
              STRATEGY_MANAGER_ADDRESS,
              STRATEGY_MANAGER_ABI
            )
          }
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-sm disabled:opacity-50"
        >
          REMOVE STRATEGY
        </button>
      </div>
    </div>
  );
}

// AI Settings Tab
function AISettingsTab({ inputs, setInputs, executeAction, loading, STRATEGY_MANAGER_ADDRESS }: any) {
  return (
    <div className="space-y-6">
      {/* Add Agent */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#FF6B2C]" />
          ADD AI AGENT
        </h3>
        <input
          type="text"
          placeholder="Agent Address (0x...)"
          value={inputs.agentAddress}
          onChange={(e) => setInputs({ ...inputs, agentAddress: e.target.value })}
          className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm mb-4"
        />
        <button
          disabled={loading || !inputs.agentAddress}
          onClick={() =>
            executeAction("addAgent", [inputs.agentAddress], STRATEGY_MANAGER_ADDRESS, STRATEGY_MANAGER_ABI)
          }
          className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
        >
          ADD AGENT
        </button>
      </div>

      {/* Add Keeper */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-[#FF6B2C]" />
          ADD KEEPER
        </h3>
        <input
          type="text"
          placeholder="Keeper Address (0x...)"
          value={inputs.keeperAddress}
          onChange={(e) => setInputs({ ...inputs, keeperAddress: e.target.value })}
          className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm mb-4"
        />
        <button
          disabled={loading || !inputs.keeperAddress}
          onClick={() =>
            executeAction("addKeeper", [inputs.keeperAddress], STRATEGY_MANAGER_ADDRESS, STRATEGY_MANAGER_ABI)
          }
          className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
        >
          ADD KEEPER
        </button>
      </div>

      {/* Safety Parameters */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#FF6B2C]" />
          SAFETY PARAMETERS
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">Max Single (bp)</label>
            <input
              type="number"
              placeholder="4000 = 40%"
              value={inputs.maxSingle}
              onChange={(e) => setInputs({ ...inputs, maxSingle: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">Max Shift (bp)</label>
            <input
              type="number"
              placeholder="2000 = 20%"
              value={inputs.maxShift}
              onChange={(e) => setInputs({ ...inputs, maxShift: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">Min Confidence (bp)</label>
            <input
              type="number"
              placeholder="7000 = 70%"
              value={inputs.minConfidence}
              onChange={(e) => setInputs({ ...inputs, minConfidence: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">Cooldown (seconds)</label>
            <input
              type="number"
              placeholder="21600 = 6 hours"
              value={inputs.cooldown}
              onChange={(e) => setInputs({ ...inputs, cooldown: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#FF6B2C]/40 font-mono text-sm"
            />
          </div>
        </div>
        <button
          disabled={loading || !inputs.maxSingle || !inputs.maxShift || !inputs.minConfidence || !inputs.cooldown}
          onClick={() =>
            executeAction(
              "setSafety",
              [
                BigInt(inputs.maxSingle),
                BigInt(inputs.maxShift),
                BigInt(inputs.minConfidence),
                BigInt(inputs.cooldown)
              ],
              STRATEGY_MANAGER_ADDRESS,
              STRATEGY_MANAGER_ABI
            )
          }
          className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm disabled:opacity-50"
        >
          UPDATE SAFETY SETTINGS
        </button>
      </div>

      {/* Execute AI Rebalance */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#FF6B2C]" />
          EXECUTE AI REBALANCE
        </h3>
        <p className="text-xs font-mono text-muted-foreground mb-4">
          Execute pending AI recommendations (Keeper only)
        </p>
        <button
          disabled={loading}
          onClick={() =>
            executeAction("executeAI", [], STRATEGY_MANAGER_ADDRESS, STRATEGY_MANAGER_ABI)
          }
          className="w-full px-4 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          EXECUTE AI
        </button>
      </div>
    </div>
  );
}

// Emergency Tab
function EmergencyTab({ executeAction, loading, isPaused }: any) {
  return (
    <div className="space-y-6">
      {/* Pause/Unpause */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          {isPaused ? <Play className="h-5 w-5 text-green-500" /> : <Pause className="h-5 w-5 text-yellow-500" />}
          VAULT STATUS CONTROL
        </h3>
        <div className="flex items-center justify-between mb-4 p-4 border border-[#FF6B2C]/20 bg-[#0F0F0F]">
          <span className="font-mono text-sm">Current Status:</span>
          <span className={`font-mono font-bold ${isPaused ? "text-red-500" : "text-green-500"}`}>
            {isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            disabled={loading || isPaused}
            onClick={() => executeAction("pause")}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-mono text-sm disabled:opacity-50"
          >
            <Pause className="h-4 w-4" />
            PAUSE VAULT
          </button>
          <button
            disabled={loading || !isPaused}
            onClick={() => executeAction("unpause")}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-mono text-sm disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            UNPAUSE VAULT
          </button>
        </div>
      </div>

      {/* Emergency Withdraw */}
      <div className="border border-red-500/50 p-6 bg-red-950/20">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          EMERGENCY WITHDRAW
        </h3>
        <div className="bg-red-950/40 border border-red-500/30 p-4 mb-4">
          <p className="text-xs font-mono text-red-300 mb-2">⚠️ WARNING</p>
          <p className="text-xs font-mono text-muted-foreground">
            This will withdraw all assets from ALL strategies immediately. Use only in critical situations.
            This action cannot be undone.
          </p>
        </div>
        <button
          disabled={loading}
          onClick={() => executeAction("emergencyWithdrawAll")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-sm"
        >
          <AlertTriangle className="h-4 w-4" />
          EMERGENCY WITHDRAW ALL
        </button>
      </div>

      {/* Transfer Ownership */}
      <div className="border border-[#FF6B2C]/30 p-6 bg-[#121212]">
        <h3 className="font-mono font-semibold text-lg mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#FF6B2C]" />
          OWNERSHIP MANAGEMENT
        </h3>
        <div className="bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground">
            Transfer ownership of contracts. Handle with extreme caution.
          </p>
        </div>
        <button
          disabled={loading}
          className="w-full px-4 py-2 border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-sm"
        >
          TRANSFER OWNERSHIP
        </button>
      </div>
    </div>
  );
}