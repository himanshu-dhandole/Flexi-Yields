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
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingDown,
  Sparkles,
  Database,
  PieChart,
  Layers,
  History,
  Info,
} from "lucide-react";
import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config/wagmiConfig";
import { formatUnits, parseUnits } from "viem";
import { motion } from "framer-motion";
import { toast } from "sonner";

// ABIs
import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import STRATEGY_MANAGER_ABI from "../abis/strategyManager.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";

export default function EnhancedPoolsPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [hideBalances, setHideBalances] = useState(false);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  // Contract addresses
  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const STRATEGY_MANAGER_ADDRESS = import.meta.env.VITE_STRATEGY_MANAGER_ADDRESS as `0x${string}`;
  const LENDING_STRATEGY_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
  const LIQUIDITY_STRATEGY_ADDRESS = import.meta.env.VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
  const STAKING_STRATEGY_ADDRESS = import.meta.env.VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;

  // State
  const [poolData, setPoolData] = useState<any>({});
  const [allocations, setAllocations] = useState<any>(null);
  const [vaultAPY, setVaultAPY] = useState<string>("0");
  const [userPositions, setUserPositions] = useState<any>({});
  const [strategyHistory, setStrategyHistory] = useState<any>({});

  const strategies = [
    {
      type: "lending",
      name: "LENDING STRATEGY",
      address: LENDING_STRATEGY_ADDRESS,
      abi: LENDING_STRATEGY_ABI,
      icon: DollarSign,
      description: "Low-risk lending protocol integration",
      protocol: "AAVE-LIKE",
      risk: "LOW",
      color: "green",
      features: ["Stable Returns", "Auto-Compounding", "Instant Liquidity"],
    },
    {
      type: "staking",
      name: "STAKING STRATEGY",
      address: STAKING_STRATEGY_ADDRESS,
      abi: STAKING_STRATEGY_ABI,
      icon: Shield,
      description: "Automated staking with optimized rewards",
      protocol: "LIDO-LIKE",
      risk: "MEDIUM",
      color: "blue",
      features: ["Validator Rewards", "Governance Rights", "Lock-Free"],
    },
    {
      type: "liquidity",
      name: "LIQUIDITY STRATEGY",
      address: LIQUIDITY_STRATEGY_ADDRESS,
      abi: LIQUIDITY_STRATEGY_ABI,
      icon: Activity,
      description: "DEX liquidity provision & farming",
      protocol: "UNISWAP V3",
      risk: "MEDIUM-HIGH",
      color: "orange",
      features: ["High Yields", "Trading Fees", "IL Protection"],
    },
  ];

  const loadPoolData = async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Load vault-level data
      const [vaultAPYResult, strategyBalances, strategyAPYs, activeStrategies] = await Promise.all([
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "estimatedVaultAPY",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "getStrategyBalances",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "getStrategyAPYs",
        }),
        readContract(config, {
          address: STRATEGY_MANAGER_ADDRESS,
          abi: STRATEGY_MANAGER_ABI,
          functionName: "getActiveStrategies",
        }),
      ]);

      setVaultAPY(formatUnits(vaultAPYResult as bigint, 2));
      setAllocations(activeStrategies);

      // Load individual strategy data
      const strategyPromises = strategies.map(async (strategy) => {
        const [totalAssets, baseAPY, estimatedAPY, totalHarvested, lastHarvest, lastYieldUpdate, accumulatedYield] =
          await Promise.all([
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "totalAssets",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "baseAPY",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "estimatedAPY",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "totalHarvested",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "lastHarvest",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "lastYieldUpdate",
            }),
            readContract(config, {
              address: strategy.address,
              abi: strategy.abi,
              functionName: "accumulatedYield",
            }),
          ]);

        return {
          type: strategy.type,
          totalAssets: formatUnits(totalAssets as bigint, 18),
          baseAPY: Number(baseAPY) / 100,
          estimatedAPY: Number(estimatedAPY) / 100,
          totalHarvested: formatUnits(totalHarvested as bigint, 18),
          lastHarvest: Number(lastHarvest),
          lastYieldUpdate: Number(lastYieldUpdate),
          accumulatedYield: formatUnits(accumulatedYield as bigint, 18),
        };
      });

      const strategyResults = await Promise.all(strategyPromises);
      const poolDataMap: any = {};
      strategyResults.forEach((result) => {
        poolDataMap[result.type] = result;
      });
      setPoolData(poolDataMap);

      // Calculate user positions if connected
      if (address) {
        const userPosPromises = strategies.map(async (strategy) => {
          const balance = await readContract(config, {
            address: strategy.address,
            abi: strategy.abi,
            functionName: "balanceOf",
            args: [address],
          });
          return {
            type: strategy.type,
            balance: formatUnits(balance as bigint, 18),
          };
        });

        const userPosResults = await Promise.all(userPosPromises);
        const userPosMap: any = {};
        userPosResults.forEach((result) => {
          userPosMap[result.type] = result.balance;
        });
        setUserPositions(userPosMap);
      }

      toast.success("Pool data loaded successfully");
    } catch (error) {
      console.error("Error loading pool data:", error);
      toast.error("Failed to load pool data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadPoolData();
  }, [address]);

  const totalTVL = strategies.reduce((acc, s) => {
    const data = poolData[s.type];
    return acc + (data ? Number(data.totalAssets) : 0);
  }, 0);

  const weightedAPY = strategies.reduce((acc, s, idx) => {
    const data = poolData[s.type];
    const allocation = allocations?.[idx]?.allocation || 0;
    return acc + (data ? (Number(data.estimatedAPY) * Number(allocation)) / 10000 : 0);
  }, 0);

  const totalHarvested = strategies.reduce((acc, s) => {
    const data = poolData[s.type];
    return acc + (data ? Number(data.totalHarvested) : 0);
  }, 0);

  const myTotalPosition = Object.values(userPositions).reduce((acc: number, val: any) => acc + Number(val), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b-2 border-[#FF6B2C]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B2C]/10 via-transparent to-[#FF6B2C]/5" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 107, 44, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="text-5xl font-mono font-bold mb-3 flex items-center gap-3">
                <Layers className="h-12 w-12 text-[#FF6B2C]" />
                YIELD POOLS
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                AI-OPTIMIZED MULTI-STRATEGY YIELD AGGREGATION
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="px-4 py-2 border border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 transition-all duration-300 font-mono text-sm flex items-center gap-2"
              >
                {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {hideBalances ? "SHOW" : "HIDE"}
              </button>
              <button
                onClick={loadPoolData}
                disabled={loading}
                className="px-6 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white transition-all duration-300 font-mono text-sm flex items-center gap-2 group disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                {loading ? "LOADING..." : "REFRESH"}
              </button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="TOTAL VALUE LOCKED"
              value={hideBalances ? "••••••" : `$${totalTVL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={Database}
              trend={12.3}
            />
            <MetricCard
              label="WEIGHTED APY"
              value={`${weightedAPY.toFixed(2)}%`}
              icon={TrendingUp}
              trend={2.1}
              isPercentage
            />
            <MetricCard
              label="TOTAL HARVESTED"
              value={hideBalances ? "••••••" : `$${totalHarvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={Coins}
              trend={8.5}
            />
            <MetricCard
              label="MY POSITION"
              value={hideBalances ? "••••••" : `$${myTotalPosition.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={Wallet}
              highlight
            />
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStrategy(null)}
            className={`px-6 py-2 font-mono text-sm transition-all duration-300 whitespace-nowrap ${
              selectedStrategy === null
                ? "bg-[#FF6B2C] text-white"
                : "border border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10"
            }`}
          >
            ALL STRATEGIES
          </button>
          {strategies.map((s) => (
            <button
              key={s.type}
              onClick={() => setSelectedStrategy(s.type)}
              className={`px-6 py-2 font-mono text-sm transition-all duration-300 whitespace-nowrap ${
                selectedStrategy === s.type
                  ? "bg-[#FF6B2C] text-white"
                  : "border border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Strategy Grid */}
        <div className="space-y-6">
          {strategies
            .filter((s) => selectedStrategy === null || s.type === selectedStrategy)
            .map((strategy, idx) => {
              const data = poolData[strategy.type];
              const allocation = allocations?.[idx];
              const userPosition = userPositions[strategy.type];
              const isExpanded = expandedStrategy === strategy.type;

              return (
                <StrategyCard
                  key={strategy.type}
                  strategy={strategy}
                  data={data}
                  allocation={allocation}
                  userPosition={userPosition}
                  hideBalances={hideBalances}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedStrategy(isExpanded ? null : strategy.type)}
                />
              );
            })}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <InfoCard
            icon={Shield}
            title="AUDITED CONTRACTS"
            description="All strategies undergo rigorous security audits"
          />
          <InfoCard
            icon={Zap}
            title="AUTO-REBALANCING"
            description="AI optimizes allocations based on market conditions"
          />
          <InfoCard
            icon={Lock}
            title="NON-CUSTODIAL"
            description="You always maintain control of your assets"
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, trend, isPercentage, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group ${highlight ? "col-span-2 md:col-span-1" : ""}`}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF6B2C]/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
      <div className={`relative border-2 p-6 transition-all duration-300 ${
        highlight
          ? "border-[#FF6B2C] bg-[#FF6B2C]/5"
          : "border-[#FF6B2C]/20 group-hover:border-[#FF6B2C]/50 bg-background"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">{label}</span>
          <Icon className={`h-4 w-4 ${highlight ? "text-[#FF6B2C]" : "text-muted-foreground"}`} />
        </div>
        <div className="flex items-end justify-between">
          <p className={`text-3xl font-mono font-bold ${highlight ? "text-[#FF6B2C]" : ""}`}>{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-mono ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StrategyCard({ strategy, data, allocation, userPosition, hideBalances, isExpanded, onToggleExpand }: any) {
  const Icon = strategy.icon;
  const allocationPercent = allocation ? Number(allocation.allocation) / 100 : 0;
  const isActive = allocation?.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C]/20 via-[#FF6B2C]/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
      
      <div className="relative bg-background border-2 border-[#FF6B2C]/20 group-hover:border-[#FF6B2C]/50 transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b-2 border-[#FF6B2C]/20 bg-gradient-to-r from-[#FF6B2C]/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6B2C] flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-mono font-bold">{strategy.name}</h3>
                  {isActive ? (
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-mono">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-mono">
                      INACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground">{strategy.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-mono text-muted-foreground mb-1">PROTOCOL</div>
                <div className="text-sm font-mono font-bold">{strategy.protocol}</div>
              </div>
              <div className={`px-3 py-1 border ${
                strategy.risk === "LOW"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : strategy.risk === "MEDIUM"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}>
                <span className="text-xs font-mono font-bold">{strategy.risk} RISK</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#FF6B2C]" />
                <span className="text-xs font-mono text-muted-foreground">CURRENT APY</span>
              </div>
              <p className="text-3xl font-mono font-bold text-[#FF6B2C]">{data?.estimatedAPY?.toFixed(2) || "0.00"}%</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-[#FF6B2C]" />
                <span className="text-xs font-mono text-muted-foreground">TOTAL LIQUIDITY</span>
              </div>
              <p className="text-3xl font-mono font-bold">
                {hideBalances ? "••••••" : `$${Number(data?.totalAssets || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-4 w-4 text-[#FF6B2C]" />
                <span className="text-xs font-mono text-muted-foreground">AI ALLOCATION</span>
              </div>
              <p className="text-3xl font-mono font-bold">{allocationPercent.toFixed(2)}%</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-[#FF6B2C]" />
                <span className="text-xs font-mono text-muted-foreground">MY POSITION</span>
              </div>
              <p className="text-3xl font-mono font-bold text-[#FF6B2C]">
                {hideBalances ? "••••••" : `$${Number(userPosition || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <button
          onClick={onToggleExpand}
          className="w-full p-4 flex items-center justify-center gap-2 border-b border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/5 transition-colors font-mono text-sm text-muted-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              HIDE DETAILS
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              SHOW DETAILS
            </>
          )}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 space-y-6 border-t-2 border-[#FF6B2C]/20"
          >
            {/* Features */}
            <div>
              <h4 className="font-mono font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF6B2C]" />
                KEY FEATURES
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                {strategy.features.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-2 p-3 border border-[#FF6B2C]/20 bg-[#FF6B2C]/5">
                    <CheckCircle2 className="h-4 w-4 text-[#FF6B2C]" />
                    <span className="text-sm font-mono">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-mono font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#FF6B2C]" />
                  PERFORMANCE METRICS
                </h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Base APY:</span>
                    <span>{data?.baseAPY?.toFixed(2) || "0.00"}%</span>
                  </div>
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Total Harvested:</span>
                    <span>{hideBalances ? "••••••" : `${Number(data?.totalHarvested || 0).toFixed(2)} USDT`}</span>
                  </div>
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Accumulated Yield:</span>
                    <span>{hideBalances ? "••••••" : `${Number(data?.accumulatedYield || 0).toFixed(6)} USDT`}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-mono font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF6B2C]" />
                  RECENT ACTIVITY
                </h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Last Harvest:</span>
                    <span>
                      {data?.lastHarvest
                        ? new Date(Number(data.lastHarvest) * 1000).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span>
                      {data?.lastYieldUpdate
                        ? new Date(Number(data.lastYieldUpdate) * 1000).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 border border-[#FF6B2C]/20">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={isActive ? "text-green-500" : "text-red-500"}>
                      {isActive ? "OPERATIONAL" : "PAUSED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm transition-all flex items-center justify-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                VIEW DETAILS
              </button>
              <button className="flex-1 px-6 py-3 border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-sm transition-all flex items-center justify-center gap-2">
                <History className="h-4 w-4" />
                VIEW HISTORY
              </button>
                            <button
                className="flex-1 px-6 py-3 border border-[#FF6B2C]/40 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-sm transition-all flex items-center justify-center gap-2"
                onClick={async () => {
                  try {
                    toast.loading("Submitting rebalance...");
                    // Placeholder for a real rebalance call:
                    // await writeContract({ ...config, address: STRATEGY_MANAGER_ADDRESS, abi: STRATEGY_MANAGER_ABI, functionName: 'rebalance', args: [] });
                    toast.dismiss();
                    toast.success("Rebalance submitted (placeholder)");
                  } catch (e) {
                    console.error(e);
                    toast.dismiss();
                    toast.error("Failed to submit rebalance");
                  }
                }}
              >
                <Target className="h-4 w-4" />
                REBALANCE
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, title, description }: any) {
  return (
    <div className="border-2 border-[#FF6B2C]/20 p-4 bg-background">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#FF6B2C] flex items-center justify-center rounded">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="font-mono font-semibold">{title}</h4>
          <p className="text-sm font-mono text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

// helper util - format timestamp to local string
function formatTimestamp(ts?: number) {
  if (!ts) return "Never";
  try {
    return new Date(Number(ts) * 1000).toLocaleString();
  } catch (e) {
    return "Invalid";
  }
}

// (Optional) export helpers if you want to reuse them elsewhere
export { MetricCard, StrategyCard, InfoCard, formatTimestamp };
