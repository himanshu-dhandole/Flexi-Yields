export const YieldVaultABI = [
  {
    inputs: [],
    name: "getVaultStats",
    outputs: [
      { name: "totalDeposited_", type: "uint256" },
      { name: "totalWithdrawn_", type: "uint256" },
      { name: "totalAssets_", type: "uint256" },
      { name: "totalShares", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "estimatedVaultAPY",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStrategyBalances",
    outputs: [
      { name: "strategyAddresses", type: "address[]" },
      { name: "balances", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStrategyAPYs",
    outputs: [
      { name: "strategyAddresses", type: "address[]" },
      { name: "apys", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;