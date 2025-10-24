import React from 'react';
import { TrendingUp, Shield, Zap, Droplet, Flame, Sparkles, ArrowUpRight } from 'lucide-react';
import DefaultLayout from '@/layouts/default';

const PoolCard = ({ pool }) => {
  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 overflow-hidden">
      {/* Subtle top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${pool.accentColor} opacity-50`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${pool.iconBg} flex items-center justify-center`}>
              {pool.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{pool.name}</h3>
              <p className="text-sm text-gray-500">{pool.protocol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{pool.apy}</p>
            <p className="text-xs text-gray-500">APY</p>
          </div>
        </div>

        {/* Strategy */}
        <p className="text-sm text-gray-400 mb-6">{pool.strategy}</p>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">TVL</span>
            <span className="text-sm font-medium text-white">{pool.tvl}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Your Position</span>
            <span className="text-sm font-medium text-white">{pool.yourDeposit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Daily Yield</span>
            <span className="text-sm font-medium text-emerald-400">{pool.dailyEarnings}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Risk</span>
            <span className={`text-sm font-medium ${pool.riskColor}`}>{pool.risk}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pool.features.map((feature, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs text-gray-400 bg-gray-800/50 rounded border border-gray-800"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Action */}
        <button className="w-full py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          Manage
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function PoolsPage() {
  const pools = [
    {
      name: 'Stablecoin Vault',
      protocol: 'Aave V3',
      apy: '12.4%',
      tvl: '$24.5M',
      yourDeposit: '$5,420',
      dailyEarnings: '$1.84',
      risk: 'Low',
      riskColor: 'text-emerald-400',
      strategy: 'USDC/USDT/DAI lending optimization',
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/10',
      features: ['Auto-compound', 'Insured'],
      accentColor: 'from-blue-500 to-transparent'
    },
    {
      name: 'ETH Liquid Staking',
      protocol: 'Lido Finance',
      apy: '15.2%',
      tvl: '$42.8M',
      yourDeposit: '$8,900',
      dailyEarnings: '$3.71',
      risk: 'Low',
      riskColor: 'text-emerald-400',
      strategy: 'Ethereum staking with liquid stETH',
      icon: <Droplet className="w-5 h-5 text-indigo-400" />,
      iconBg: 'bg-indigo-500/10',
      features: ['Liquid', 'Native yield'],
      accentColor: 'from-indigo-500 to-transparent'
    },
    {
      name: 'Blue Chip DeFi',
      protocol: 'Compound',
      apy: '18.7%',
      tvl: '$18.2M',
      yourDeposit: '$3,150',
      dailyEarnings: '$1.62',
      risk: 'Medium',
      riskColor: 'text-yellow-400',
      strategy: 'ETH/wBTC leveraged yield',
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10',
      features: ['Leveraged', 'Multi-asset'],
      accentColor: 'from-purple-500 to-transparent'
    },
    {
      name: 'Curve Optimizer',
      protocol: 'Curve Finance',
      apy: '24.3%',
      tvl: '$12.8M',
      yourDeposit: '$2,890',
      dailyEarnings: '$1.93',
      risk: 'Medium',
      riskColor: 'text-yellow-400',
      strategy: 'Automated liquidity provision',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      iconBg: 'bg-yellow-500/10',
      features: ['Auto-compound', 'L2'],
      accentColor: 'from-yellow-500 to-transparent'
    },
    {
      name: 'Perp Liquidity',
      protocol: 'GMX',
      apy: '31.8%',
      tvl: '$8.4M',
      yourDeposit: '$4,250',
      dailyEarnings: '$3.70',
      risk: 'High',
      riskColor: 'text-orange-400',
      strategy: 'GLP liquidity with trading fees',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      iconBg: 'bg-orange-500/10',
      features: ['Trading fees', 'High yield'],
      accentColor: 'from-orange-500 to-transparent'
    },
    {
      name: 'Exotic Strategy',
      protocol: 'Beefy Finance',
      apy: '42.6%',
      tvl: '$5.2M',
      yourDeposit: '$1,800',
      dailyEarnings: '$2.10',
      risk: 'High',
      riskColor: 'text-orange-400',
      strategy: 'Multi-hop automated farming',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10',
      features: ['Boosted', 'Multi-reward'],
      accentColor: 'from-emerald-500 to-transparent'
    }
  ];

  const totalDeposited = pools.reduce((sum, pool) => {
    const amount = parseFloat(pool.yourDeposit.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  const avgAPY = (pools.reduce((sum, pool) => {
    return sum + parseFloat(pool.apy);
  }, 0) / pools.length).toFixed(1);

  const dailyTotal = pools.reduce((sum, pool) => {
    const amount = parseFloat(pool.dailyEarnings.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <DefaultLayout>
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Active Pools</h1>
          <p className="text-gray-500">
            {pools.length} pools optimizing your portfolio
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
            <p className="text-sm text-gray-500 mb-1">Total Deposited</p>
            <p className="text-2xl font-bold text-white">${totalDeposited.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
            <p className="text-sm text-gray-500 mb-1">Avg APY</p>
            <p className="text-2xl font-bold text-white">{avgAPY}%</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
            <p className="text-sm text-gray-500 mb-1">Daily Earnings</p>
            <p className="text-2xl font-bold text-emerald-400">${dailyTotal.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-5">
            <p className="text-sm text-gray-500 mb-1">Active Pools</p>
            <p className="text-2xl font-bold text-white">{pools.length}</p>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pools.map((pool, index) => (
            <PoolCard key={index} pool={pool} />
          ))}
        </div>
      </div>
    </div>
    </DefaultLayout>
  );
}