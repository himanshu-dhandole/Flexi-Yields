import DefaultLayout from "@/layouts/default";
import { config } from "@/config/wagmiConfig";
import { readContract } from "wagmi/actions";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  BarChart3,
  Activity,
  Coins,
  Shield,
  Zap,
} from "lucide-react";

import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";
import STRATEGY_MANAGER_ABI from "../abis/strategyManager.json";
import LENDING_STRATEGY_ABI from "../abis/lendingStrategy.json";
import LIQUIDITY_STRATEGY_ABI from "../abis/liquidityStrategy.json";
import STAKING_STRATEGY_ABI from "../abis/stakingStrategy.json";

export default function PoolsPage() {
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

  const [poolData, setPoolData] = useState<{
    lending?: any;
    staking?: any;
    liquidity?: any;
  }>({});

  const [loading, setLoading] = useState(true);

  const loadPoolData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      const [
        lendingTotalAssets,
        lendingBalanceOf,
        lendingAPY,
        stakingTotalAssets,
        stakingBalanceOf,
        stakingAPY,
        liquidityTotalAssets,
        liquidityBalanceOf,
        liquidityAPY,
      ] = await Promise.all([
        // Lending Strategy
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "balanceOf",
        }),
        readContract(config, {
          address: LENDING_STRATEGY_ADDRESS,
          abi: LENDING_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),

        // Staking Strategy
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "balanceOf",
        }),
        readContract(config, {
          address: STAKING_STRATEGY_ADDRESS,
          abi: STAKING_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),

        // Liquidity Strategy
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "totalAssets",
        }),
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "balanceOf",
        }),
        readContract(config, {
          address: LIQUIDITY_STRATEGY_ADDRESS,
          abi: LIQUIDITY_STRATEGY_ABI,
          functionName: "estimatedAPY",
        }),
      ]);

      setPoolData({
        lending: {
          totalAssets: lendingTotalAssets?.toString(),
          balanceOf: lendingBalanceOf?.toString(),
          estimatedAPY: lendingAPY?.toString(),
        },
        staking: {
          totalAssets: stakingTotalAssets?.toString(),
          balanceOf: stakingBalanceOf?.toString(),
          estimatedAPY: stakingAPY?.toString(),
        },
        liquidity: {
          totalAssets: liquidityTotalAssets?.toString(),
          balanceOf: liquidityBalanceOf?.toString(),
          estimatedAPY: liquidityAPY?.toString(),
        },
      });

      console.log("Fetched Pool Data:", {
        lendingTotalAssets,
        lendingBalanceOf,
        lendingAPY,
        stakingTotalAssets,
        stakingBalanceOf,
        stakingAPY,
        liquidityTotalAssets,
        liquidityBalanceOf,
        liquidityAPY,
      });
    } catch (err) {
      console.error("Failed to fetch pool details:", err);
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
      name: "LENDING STRATEGY",
      icon: DollarSign,
      description: "OPTIMIZED LENDING ACROSS PROTOCOLS",
      color: "#FF6B2C",
    },
    {
      type: "staking",
      name: "STAKING STRATEGY",
      icon: Shield,
      description: "AUTOMATED STAKING REWARDS",
      color: "#FF6B2C",
    },
    {
      type: "liquidity",
      name: "LIQUIDITY STRATEGY",
      icon: Activity,
      description: "LP TOKEN YIELD FARMING",
      color: "#FF6B2C",
    },
  ];

  const formatNumber = (value: string | undefined) => {
    if (!value) return "0.00";
    const num = Number(value) / 1e18;
    return num.toFixed(2);
  };

  const formatAPY = (value: string | undefined) => {
    if (!value) return "0.00";
    return (Number(value) / 100).toFixed(2);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 border-b border-[#FF6B2C]/20 pb-6"
          >
            <h1 className="text-4xl font-mono font-bold text-foreground mb-2">
              ACTIVE STRATEGIES
            </h1>
            <p className="text-sm font-mono text-muted-foreground flex items-center gap-2">
              <BarChart3 size={14} className="text-[#FF6B2C]" />
              REAL-TIME YIELD METRICS FROM DEPLOYED CAPITAL
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-[#FF6B2C] border-t-transparent animate-spin mb-4"></div>
                <p className="text-sm font-mono text-muted-foreground">LOADING STRATEGY DATA...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Strategy Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {strategies.map((strategy, index) => {
                  const data = poolData[strategy.type as keyof typeof poolData];
                  const totalTVL = strategies.reduce((acc, s) => {
                    const d = poolData[s.type as keyof typeof poolData];
                    return acc + (d ? Number(d.totalAssets) / 1e18 : 0);
                  }, 0);

                  const strategyTVL = data ? Number(data.totalAssets) / 1e18 : 0;
                  const allocation = totalTVL > 0 ? ((strategyTVL / totalTVL) * 100).toFixed(1) : "0.0";

                  return (
                    <motion.div
                      key={strategy.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-[#FF6B2C]/20 p-6 hover:bg-[#FF6B2C]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <strategy.icon size={20} className="text-[#FF6B2C]" />
                        <span className="text-xs font-mono text-muted-foreground">
                          {strategy.name}
                        </span>
                      </div>
                      <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-1">
                        {data ? formatAPY(data.estimatedAPY) : "0.00"}%
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        ALLOCATION: {allocation}%
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Detailed Strategy Cards */}
              <div className="grid grid-cols-1 gap-6">
                {strategies.map((strategy, index) => {
                  const data = poolData[strategy.type as keyof typeof poolData];
                  
                  return (
                    <motion.div
                      key={strategy.type}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-[#FF6B2C]/20 p-8"
                    >
                      {/* Strategy Header */}
                      <div className="flex items-start justify-between mb-8 pb-6 border-b border-[#FF6B2C]/20">
                        <div className="flex items-center gap-4">
                          <div className="p-3 border border-[#FF6B2C]/20 bg-[#FF6B2C]/5">
                            <strategy.icon size={24} className="text-[#FF6B2C]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-mono font-bold text-foreground mb-1">
                              {strategy.name}
                            </h3>
                            <p className="text-xs font-mono text-muted-foreground">
                              {strategy.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-block px-3 py-1 border border-[#FF6B2C]/20 bg-[#FF6B2C]/5">
                            <span className="text-xs font-mono text-[#FF6B2C]">ACTIVE</span>
                          </div>
                        </div>
                      </div>

                      {/* Strategy Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-[#FF6B2C]" />
                            <span className="text-xs font-mono text-muted-foreground">
                              ESTIMATED APY
                            </span>
                          </div>
                          <p className="text-4xl font-mono font-bold text-[#FF6B2C]">
                            {data ? formatAPY(data.estimatedAPY) : "0.00"}%
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Coins size={16} className="text-[#FF6B2C]" />
                            <span className="text-xs font-mono text-muted-foreground">
                              TOTAL ASSETS DEPLOYED
                            </span>
                          </div>
                          <p className="text-4xl font-mono font-bold text-foreground">
                            {data ? formatNumber(data.totalAssets) : "0.00"}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            vUSDT
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Wallet size={16} className="text-[#FF6B2C]" />
                            <span className="text-xs font-mono text-muted-foreground">
                              YOUR POSITION
                            </span>
                          </div>
                          <p className="text-4xl font-mono font-bold text-foreground">
                            {data ? formatNumber(data.balanceOf) : "0.00"}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            vUSDT
                          </p>
                        </div>
                      </div>

                      {/* Strategy Details */}
                      <div className="mt-8 pt-6 border-t border-[#FF6B2C]/20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-1">
                              PROTOCOL
                            </p>
                            <p className="text-sm font-mono text-foreground">
                              {strategy.type === "lending" ? "AAVE V3" : 
                               strategy.type === "staking" ? "LIDO" : 
                               "UNISWAP V3"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-1">
                              RISK LEVEL
                            </p>
                            <p className="text-sm font-mono text-[#FF6B2C]">
                              {strategy.type === "lending" ? "LOW" : 
                               strategy.type === "staking" ? "MEDIUM" : 
                               "MEDIUM-HIGH"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-1">
                              AUTO-COMPOUND
                            </p>
                            <p className="text-sm font-mono text-foreground">ENABLED</p>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-1">
                              LAST REBALANCE
                            </p>
                            <p className="text-sm font-mono text-foreground">2H AGO</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-12 border border-[#FF6B2C]/20 p-8 bg-[#FF6B2C]/5"
              >
                <div className="flex items-start gap-4">
                  <Zap size={20} className="text-[#FF6B2C] mt-1" />
                  <div>
                    <h3 className="text-lg font-mono font-bold text-foreground mb-2">
                      AI-POWERED REBALANCING
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground">
                      The vault automatically rebalances capital across these strategies every 6 hours based on real-time yield data and risk metrics. Your funds are continuously optimized without any manual intervention required.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}