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
// import { useState } from "react";
// import {
//   TrendingUp,
//   DollarSign,
//   Wallet,
//   BarChart3,
//   Activity,
//   Coins,
//   Shield,
//   Zap,
//   ArrowUpRight,
//   Target,
//   RefreshCw,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
// } from "lucide-react";
// import DefaultLayout from "@/layouts/default";

// export default function PoolsPage() {
//   const [selectedStrategy, setSelectedStrategy] = useState("all");

//   // Mock data - replace with your actual data
//   const poolData = {
//     lending: {
//       totalAssets: "125000000000000000000000",
//       balanceOf: "5000000000000000000000",
//       estimatedAPY: "850",
//     },
//     staking: {
//       totalAssets: "87500000000000000000000",
//       balanceOf: "3200000000000000000000",
//       estimatedAPY: "1240",
//     },
//     liquidity: {
//       totalAssets: "156000000000000000000000",
//       balanceOf: "8500000000000000000000",
//       estimatedAPY: "1580",
//     },
//   };

//   const strategies = [
//     {
//       type: "lending",
//       name: "LENDING VAULT",
//       icon: DollarSign,
//       description: "Optimized lending across DeFi protocols",
//       protocol: "AAVE V3",
//       risk: "LOW",
//       color: "#FF6B2C",
//     },
//     {
//       type: "staking",
//       name: "STAKING VAULT",
//       icon: Shield,
//       description: "Automated staking with compound rewards",
//       protocol: "LIDO",
//       risk: "MEDIUM",
//       color: "#FF6B2C",
//     },
//     {
//       type: "liquidity",
//       name: "LIQUIDITY VAULT",
//       icon: Activity,
//       description: "LP token yield farming optimization",
//       protocol: "UNISWAP V3",
//       risk: "MEDIUM-HIGH",
//       color: "#FF6B2C",
//     },
//   ];

//   const formatNumber = (value: string) => {
//     if (!value) return "0.00";
//     const num = Number(value) / 1e18;
//     return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   const formatAPY = (value: string) => {
//     if (!value) return "0.00";
//     return (Number(value) / 100).toFixed(2);
//   };

//   const totalTVL = strategies.reduce((acc, s) => {
//     const data = poolData[s.type as keyof typeof poolData];
//     return acc + (data ? Number(data.totalAssets) / 1e18 : 0);
//   }, 0);

//   const totalAPY = strategies.reduce((acc, s) => {
//     const data = poolData[s.type as keyof typeof poolData];
//     return acc + (data ? Number(data.estimatedAPY) / 100 : 0);
//   }, 0) / strategies.length;

//   return (
//     <DefaultLayout>
//     <div className="min-h-screen bg-background">
//       {/* Hero Stats Section */}
//       <div className="bg-gradient-to-b from-[#FF6B2C]/10 to-background border-b-2 border-[#FF6B2C]/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
//             <div>
//               <h1 className="text-5xl font-mono font-bold text-foreground mb-3">
//                 YIELD STRATEGIES
//               </h1>
//               <p className="text-sm font-mono text-muted-foreground flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                 LIVE PERFORMANCE METRICS • UPDATED EVERY 6H
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button className="px-6 py-3 border-2 border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/5 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
//                 <RefreshCw className="h-4 w-4 text-[#FF6B2C] group-hover:rotate-180 transition-transform duration-500" />
//                 REFRESH
//               </button>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative group">
//               <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur transition duration-300" />
//               <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs font-mono text-muted-foreground">TOTAL TVL</span>
//                   <BarChart3 className="h-4 w-4 text-[#FF6B2C]" />
//                 </div>
//                 <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-1">
//                   ${totalTVL.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
//                 </p>
//                 <div className="flex items-center gap-1 text-xs font-mono text-green-500">
//                   <ArrowUpRight className="h-3 w-3" />
//                   <span>+12.3%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="relative group">
//               <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur transition duration-300" />
//               <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs font-mono text-muted-foreground">AVG APY</span>
//                   <TrendingUp className="h-4 w-4 text-[#FF6B2C]" />
//                 </div>
//                 <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-1">
//                   {totalAPY.toFixed(2)}%
//                 </p>
//                 <div className="flex items-center gap-1 text-xs font-mono text-green-500">
//                   <ArrowUpRight className="h-3 w-3" />
//                   <span>+2.1%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="relative group">
//               <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur transition duration-300" />
//               <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs font-mono text-muted-foreground">ACTIVE VAULTS</span>
//                   <Target className="h-4 w-4 text-[#FF6B2C]" />
//                 </div>
//                 <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-1">
//                   {strategies.length}
//                 </p>
//                 <span className="text-xs font-mono text-muted-foreground">STRATEGIES</span>
//               </div>
//             </div>

//             <div className="relative group">
//               <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur transition duration-300" />
//               <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs font-mono text-muted-foreground">YOUR POSITION</span>
//                   <Wallet className="h-4 w-4 text-[#FF6B2C]" />
//                 </div>
//                 <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-1">
//                   {formatNumber(poolData.lending.balanceOf)}
//                 </p>
//                 <span className="text-xs font-mono text-muted-foreground">vUSDT</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Strategy Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
//         {/* Filter Tabs */}
//         <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
//           <button
//             onClick={() => setSelectedStrategy("all")}
//             className={`px-6 py-2 font-mono text-sm transition-all duration-300 whitespace-nowrap ${
//               selectedStrategy === "all"
//                 ? "bg-[#FF6B2C] text-white border-2 border-[#FF6B2C]"
//                 : "border-2 border-[#FF6B2C]/20 hover:border-[#FF6B2C]/50"
//             }`}
//           >
//             ALL STRATEGIES
//           </button>
//           {strategies.map((strategy) => (
//             <button
//               key={strategy.type}
//               onClick={() => setSelectedStrategy(strategy.type)}
//               className={`px-6 py-2 font-mono text-sm transition-all duration-300 whitespace-nowrap ${
//                 selectedStrategy === strategy.type
//                   ? "bg-[#FF6B2C] text-white border-2 border-[#FF6B2C]"
//                   : "border-2 border-[#FF6B2C]/20 hover:border-[#FF6B2C]/50"
//               }`}
//             >
//               {strategy.name}
//             </button>
//           ))}
//         </div>

//         {/* Strategy Grid */}
//         <div className="grid grid-cols-1 gap-6">
//           {strategies
//             .filter((s) => selectedStrategy === "all" || selectedStrategy === s.type)
//             .map((strategy, index) => {
//               const data = poolData[strategy.type as keyof typeof poolData];
//               const strategyTVL = data ? Number(data.totalAssets) / 1e18 : 0;
//               const allocation = totalTVL > 0 ? ((strategyTVL / totalTVL) * 100).toFixed(1) : "0.0";

//               return (
//                 <div
//                   key={strategy.type}
//                   className="relative group"
//                   style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}
//                 >
//                   {/* Glow Effect */}
//                   <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF6B2C]/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

//                   {/* Card */}
//                   <div className="relative bg-background border-2 border-[#FF6B2C]/20 group-hover:border-[#FF6B2C]/50 transition-all duration-300">
//                     {/* Header */}
//                     <div className="p-8 border-b-2 border-[#FF6B2C]/20 bg-gradient-to-r from-[#FF6B2C]/5 to-transparent">
//                       <div className="flex items-start justify-between flex-wrap gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div className="absolute inset-0 bg-[#FF6B2C] blur-lg opacity-50" />
//                             <div className="relative w-14 h-14 bg-[#FF6B2C] flex items-center justify-center border-2 border-[#FF6B2C]">
//                               <strategy.icon className="h-7 w-7 text-white" />
//                             </div>
//                           </div>
//                           <div>
//                             <h3 className="text-2xl font-mono font-bold text-foreground mb-1">
//                               {strategy.name}
//                             </h3>
//                             <p className="text-xs font-mono text-muted-foreground">
//                               {strategy.description}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex flex-col items-end gap-2">
//                           <div className="px-3 py-1 bg-green-500/10 border border-green-500/30">
//                             <span className="text-xs font-mono text-green-500 flex items-center gap-1">
//                               <CheckCircle2 className="h-3 w-3" />
//                               ACTIVE
//                             </span>
//                           </div>
//                           <div className="px-3 py-1 border border-[#FF6B2C]/30">
//                             <span className="text-xs font-mono text-[#FF6B2C]">
//                               {strategy.risk} RISK
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Main Metrics */}
//                     <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//                       {/* APY */}
//                       <div className="relative">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B2C]" />
//                         <div className="pl-4">
//                           <div className="flex items-center gap-2 mb-3">
//                             <TrendingUp className="h-4 w-4 text-[#FF6B2C]" />
//                             <span className="text-xs font-mono text-muted-foreground">
//                               CURRENT APY
//                             </span>
//                           </div>
//                           <p className="text-5xl font-mono font-bold text-[#FF6B2C] mb-2">
//                             {formatAPY(data.estimatedAPY)}%
//                           </p>
//                           <div className="flex items-center gap-1 text-xs font-mono text-green-500">
//                             <ArrowUpRight className="h-3 w-3" />
//                             <span>Above average</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* TVL */}
//                       <div className="relative">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B2C]/50" />
//                         <div className="pl-4">
//                           <div className="flex items-center gap-2 mb-3">
//                             <Coins className="h-4 w-4 text-[#FF6B2C]" />
//                             <span className="text-xs font-mono text-muted-foreground">
//                               DEPLOYED CAPITAL
//                             </span>
//                           </div>
//                           <p className="text-5xl font-mono font-bold text-foreground mb-2">
//                             {formatNumber(data.totalAssets)}
//                           </p>
//                           <p className="text-xs font-mono text-muted-foreground">
//                             vUSDT • {allocation}% of total
//                           </p>
//                         </div>
//                       </div>

//                       {/* Your Position */}
//                       <div className="relative">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B2C]/30" />
//                         <div className="pl-4">
//                           <div className="flex items-center gap-2 mb-3">
//                             <Wallet className="h-4 w-4 text-[#FF6B2C]" />
//                             <span className="text-xs font-mono text-muted-foreground">
//                               YOUR POSITION
//                             </span>
//                           </div>
//                           <p className="text-5xl font-mono font-bold text-foreground mb-2">
//                             {formatNumber(data.balanceOf)}
//                           </p>
//                           <p className="text-xs font-mono text-muted-foreground">
//                             vUSDT • Earning yield
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Strategy Details */}
//                     <div className="px-8 pb-8">
//                       <div className="border-t-2 border-[#FF6B2C]/20 pt-6">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                           <div>
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="w-2 h-2 bg-[#FF6B2C] rounded-full" />
//                               <span className="text-xs font-mono text-muted-foreground">
//                                 PROTOCOL
//                               </span>
//                             </div>
//                             <p className="text-sm font-mono font-bold text-foreground">
//                               {strategy.protocol}
//                             </p>
//                           </div>

//                           <div>
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="w-2 h-2 bg-[#FF6B2C] rounded-full" />
//                               <span className="text-xs font-mono text-muted-foreground">
//                                 AUTO-COMPOUND
//                               </span>
//                             </div>
//                             <p className="text-sm font-mono font-bold text-green-500">
//                               ENABLED
//                             </p>
//                           </div>

//                           <div>
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="w-2 h-2 bg-[#FF6B2C] rounded-full" />
//                               <span className="text-xs font-mono text-muted-foreground">
//                                 REBALANCE
//                               </span>
//                             </div>
//                             <p className="text-sm font-mono font-bold text-foreground flex items-center gap-1">
//                               <Clock className="h-3 w-3" />
//                               2H AGO
//                             </p>
//                           </div>

//                           <div>
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="w-2 h-2 bg-[#FF6B2C] rounded-full" />
//                               <span className="text-xs font-mono text-muted-foreground">
//                                 ALLOCATION
//                               </span>
//                             </div>
//                             <p className="text-sm font-mono font-bold text-foreground">
//                               {allocation}%
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Bar */}
//                     <div className="border-t-2 border-[#FF6B2C]/20 p-6 bg-[#FF6B2C]/5 flex items-center justify-between flex-wrap gap-4">
//                       <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
//                         <Zap className="h-4 w-4 text-[#FF6B2C]" />
//                         Optimized by AI • Next rebalance in 4h
//                       </div>
//                       <button className="px-6 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2 group">
//                         VIEW DETAILS
//                         <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Info Banner */}
//         <div className="mt-12 relative group">
//           <div className="absolute -inset-1 bg-[#FF6B2C]/20 blur-xl opacity-50" />
//           <div className="relative border-l-4 border-[#FF6B2C] bg-[#FF6B2C]/5 p-8">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-[#FF6B2C] flex-shrink-0">
//                 <AlertCircle className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-mono font-bold text-foreground mb-3">
//                   AUTOMATED REBALANCING SYSTEM
//                 </h3>
//                 <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-4">
//                   Our AI continuously monitors yield opportunities and automatically rebalances your capital every 6 hours. The system analyzes real-time APY data, gas costs, and risk metrics to maximize your returns without any manual intervention.
//                 </p>
//                 <div className="flex flex-wrap gap-4 text-xs font-mono">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <span className="text-muted-foreground">Auto-compound rewards</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <span className="text-muted-foreground">Gas optimization</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <span className="text-muted-foreground">Risk management</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//     </DefaultLayout>
//   );
// }