"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  BarChart3,
  Activity,
  Coins,
  Shield,
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "@/config/wagmiConfig";
import DefaultLayout from "@/layouts/default";

// ABIs
import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import STRATEGY_MANAGER_ABI from "../abis/strategyManager.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";

export default function PoolsPage() {
  // Contract addresses
  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const STRATEGY_MANAGER_ADDRESS = import.meta.env.VITE_STRATEGY_MANAGER_ADDRESS as `0x${string}`;
  const LENDING_STRATEGY_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
  const LIQUIDITY_STRATEGY_ADDRESS = import.meta.env.VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
  const STAKING_STRATEGY_ADDRESS = import.meta.env.VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;

  const { address } = useAccount();

  const [poolData, setPoolData] = useState<{
    lending?: any;
    staking?: any;
    liquidity?: any;
  }>({});
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("all");

  // Load contract data
  const loadPoolData = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const [
        lendingtotalAssets,
        lendingBalanceOf,
        lendingAPY,
        stakingtotalAssets,
        stakingBalanceOf,
        stakingAPY,
        liquiditytotalAssets,
        liquidityBalanceOf,
        liquidityAPY,
      ] = await Promise.all([
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),

        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),

        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),
      ]);

      setPoolData({
        lending: {
          totalAssets: lendingtotalAssets?.toString(),
          balanceOf: lendingBalanceOf?.toString(),
          estimatedAPY: lendingAPY?.toString(),
        },
        staking: {
          totalAssets: stakingtotalAssets?.toString(),
          balanceOf: stakingBalanceOf?.toString(),
          estimatedAPY: stakingAPY?.toString(),
        },
        liquidity: {
          totalAssets: liquiditytotalAssets?.toString(),
          balanceOf: liquidityBalanceOf?.toString(),
          estimatedAPY: liquidityAPY?.toString(),
        },
      });
    } catch (error) {
      console.error("Error loading pool data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadPoolData();
  }, [address]);

  const strategies = [
    {
      type: "lending",
      name: "LENDING VAULT",
      icon: DollarSign,
      description: "Optimized lending across DeFi protocols",
      protocol: "AAVE V3",
      risk: "LOW",
    },
    {
      type: "staking",
      name: "STAKING VAULT",
      icon: Shield,
      description: "Automated staking with compound rewards",
      protocol: "LIDO",
      risk: "MEDIUM",
    },
    {
      type: "liquidity",
      name: "LIQUIDITY VAULT",
      icon: Activity,
      description: "LP token yield farming optimization",
      protocol: "UNISWAP V3",
      risk: "MEDIUM-HIGH",
    },
  ];

  const formatNumber = (value?: string) => {
    if (!value) return "0.00";
    const num = Number(value) / 1e18;
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAPY = (value?: string) => {
    if (!value) return "0.00";
    return (Number(value) / 100).toFixed(2);
  };

  const totalTVL = strategies.reduce((acc, s) => {
    const data = poolData[s.type as keyof typeof poolData];
    return acc + (data ? Number(data.totalAssets) / 1e18 : 0);
  }, 0);

  const totalAPY = strategies.reduce((acc, s) => {
    const data = poolData[s.type as keyof typeof poolData];
    return acc + (data ? Number(data.estimatedAPY) / 100 : 0);
  }, 0) / strategies.length;

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-b from-[#FF6B2C]/10 to-background border-b-2 border-[#FF6B2C]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h1 className="text-5xl font-mono font-bold text-foreground mb-3">
                YIELD STRATEGIES
              </h1>
              <button
                onClick={loadPoolData}
                className="px-6 py-3 border-2 border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/5 transition-all duration-300 font-mono text-sm flex items-center gap-2 group"
              >
                <RefreshCw className={`h-4 w-4 text-[#FF6B2C] ${loading ? "animate-spin" : ""}`} />
                {loading ? "REFRESHING..." : "REFRESH"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="TOTAL INFLOW" value={`$${totalTVL.toLocaleString()}`} icon={BarChart3} />
              <StatCard label="AVG APY" value={`${totalAPY.toFixed(2)}%`} icon={TrendingUp} />
              <StatCard label="ACTIVE STRATEGIES" value={strategies.length} icon={Target} />
              <StatCard
                label="YOUR POSITION"
                value={`${formatNumber(poolData.lending?.balanceOf || "0")} USDT`}
                icon={Wallet}
              />
            </div>
          </div>
        </div>

        {/* Vault Grid (same as your design, just with live data) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedStrategy("all")}
              className={`px-6 py-2 font-mono text-sm transition-all duration-300 ${
                selectedStrategy === "all"
                  ? "bg-[#FF6B2C] text-white border-2 border-[#FF6B2C]"
                  : "border-2 border-[#FF6B2C]/20 hover:border-[#FF6B2C]/50"
              }`}
            >
              ALL STRATEGIES
            </button>
            {strategies.map((s) => (
              <button
                key={s.type}
                onClick={() => setSelectedStrategy(s.type)}
                className={`px-6 py-2 font-mono text-sm transition-all duration-300 ${
                  selectedStrategy === s.type
                    ? "bg-[#FF6B2C] text-white border-2 border-[#FF6B2C]"
                    : "border-2 border-[#FF6B2C]/20 hover:border-[#FF6B2C]/50"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {strategies
              .filter((s) => selectedStrategy === "all" || s.type === selectedStrategy)
              .map((strategy) => {
                const data = poolData[strategy.type as keyof typeof poolData];
                return (
                  <VaultCard
                    key={strategy.type}
                    strategy={strategy}
                    data={data}
                    formatAPY={formatAPY}
                    formatNumber={formatNumber}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur transition duration-300" />
      <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-[#FF6B2C]" />
        </div>
        <p className="text-3xl font-mono font-bold text-[#FF6B2C]">{value}</p>
      </div>
    </div>
  );
}

function VaultCard({ strategy, data, formatAPY, formatNumber }: any) {
  const Icon = strategy.icon;
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF6B2C]/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
      <div className="relative bg-background border-2 border-[#FF6B2C]/20 group-hover:border-[#FF6B2C]/50 transition-all duration-300">
        <div className="p-8 border-b-2 border-[#FF6B2C]/20 bg-gradient-to-r from-[#FF6B2C]/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FF6B2C] flex items-center justify-center border-2 border-[#FF6B2C]">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-mono font-bold">{strategy.name}</h3>
              <p className="text-xs font-mono text-muted-foreground">{strategy.description}</p>
            </div>
          </div>
          <div className="px-3 py-1 border border-[#FF6B2C]/30">
            <span className="text-xs font-mono text-[#FF6B2C]">{strategy.risk} RISK</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Metric label="APY" icon={TrendingUp} value={`${formatAPY(data?.estimatedAPY)} %`} />
          <Metric label="TOTAL LIQUIDITY" icon={Coins} value={`$ ${formatNumber(data?.totalAssets)}`} />
          <Metric label="AI ALLOCATION" icon={Wallet} value={`33.33 %`} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, icon: Icon, value }: any) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B2C]/50" />
      <div className="pl-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-[#FF6B2C]" />
          <span className="text-xs font-mono text-muted-foreground">{label}</span>
        </div>
        <p className="text-4xl font-mono font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
