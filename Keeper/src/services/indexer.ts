import { createPublicClient, http, Address } from "viem";
import { mainnet } from "viem/chains";
import { config } from "../config/config";
import { StrategyManagerABI, YieldVaultABI, BaseStrategyABI } from "../abis";

export class Indexer {
  private client;

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(config.rpcUrl),
    });
  }

  // Get all strategies with details
  async getAllStrategies() {
    const count = await this.client.readContract({
      address: config.strategyManagerAddress,
      abi: StrategyManagerABI,
      functionName: "getStrategyCount",
    });

    const strategies = [];
    for (let i = 0; i < Number(count); i++) {
      const strategy = await this.client.readContract({
        address: config.strategyManagerAddress,
        abi: StrategyManagerABI,
        functionName: "getStrategy",
        args: [BigInt(i)],
      });

      const name = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "name",
      });

      const balance = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "balanceOf",
      });

      const currentAPY = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "estimatedAPY",
      });

      const baseAPY = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "baseAPY",
      });

      const totalHarvested = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "totalHarvested",
      });

      const lastHarvest = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "lastHarvest",
      });

      const hourlyYield = await this.client.readContract({
        address: strategy[0] as Address,
        abi: BaseStrategyABI,
        functionName: "viewHourlyYield",
      });

      strategies.push({
        address: strategy[0],
        allocation: Number(strategy[1]),
        active: strategy[2],
        name: name as string,
        balance: balance as bigint,
        currentAPY: Number(currentAPY),
        baseAPY: Number(baseAPY),
        totalHarvested: totalHarvested as bigint,
        lastHarvest: Number(lastHarvest),
        hourlyYield: hourlyYield as bigint,
      });
    }

    return strategies;
  }

  // Get total allocation
  async getTotalAllocation() {
    const total = await this.client.readContract({
      address: config.strategyManagerAddress,
      abi: StrategyManagerABI,
      functionName: "getTotalAllocation",
    });
    return Number(total);
  }

  // Get vault stats
  async getVaultStats() {
    const stats = await this.client.readContract({
      address: config.yieldVaultAddress,
      abi: YieldVaultABI,
      functionName: "getVaultStats",
    });

    const vaultAPY = await this.client.readContract({
      address: config.yieldVaultAddress,
      abi: YieldVaultABI,
      functionName: "estimatedVaultAPY",
    });

    return {
      totalDeposited: stats[0],
      totalWithdrawn: stats[1],
      totalAssets: stats[2],
      totalShares: stats[3],
      vaultAPY: Number(vaultAPY),
    };
  }
}
