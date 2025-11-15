import dotenv from "dotenv";
dotenv.config();

export const config = {
  rpcUrl: process.env.RPC_URL!,
  mongodbUri: process.env.MONGODB_URI!,
  strategyManagerAddress: process.env.STRATEGY_MANAGER_ADDRESS as `0x${string}`,
  yieldVaultAddress: process.env.YIELD_VAULT_ADDRESS as `0x${string}`,
  pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || "300000"),
};

if (!config.strategyManagerAddress || !config.yieldVaultAddress) {
  throw new Error("Missing contract addresses in .env");
}