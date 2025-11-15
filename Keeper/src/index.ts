import { config } from "./config/config";
import { connectDB, StrategySnapshot, AllocationHistory, APYHistory, VaultSnapshot } from "./services/database";
import { Indexer } from "./services/indexer";

async function collectData() {
  console.log("\n🔄 Collecting data...");
  const indexer = new Indexer();
  const timestamp = new Date();

  try {
    // Get all strategy data
    const strategies = await indexer.getAllStrategies();
    const totalAllocation = await indexer.getTotalAllocation();
    const vaultStats = await indexer.getVaultStats();

    console.log(`📊 Found ${strategies.length} strategies`);

    // Save strategy snapshots
    for (const strat of strategies) {
      await StrategySnapshot.create({
        strategyAddress: strat.address,
        strategyName: strat.name,
        timestamp,
        balance: strat.balance.toString(),
        currentAPY: strat.currentAPY,
        baseAPY: strat.baseAPY,
        allocation: strat.allocation,
        totalHarvested: strat.totalHarvested.toString(),
        lastHarvest: new Date(strat.lastHarvest * 1000),
        hourlyYield: strat.hourlyYield.toString(),
        isActive: strat.active,
      });

      // Save allocation history
      await AllocationHistory.create({
        strategyAddress: strat.address,
        strategyName: strat.name,
        timestamp,
        allocation: strat.allocation,
        totalAllocation,
      });

      // Save APY history
      await APYHistory.create({
        strategyAddress: strat.address,
        strategyName: strat.name,
        timestamp,
        apy: strat.currentAPY,
        baseAPY: strat.baseAPY,
      });

      console.log(`  ✅ ${strat.name}: ${strat.allocation/100}% allocation, ${strat.currentAPY/100}% APY`);
    }

    // Save vault snapshot
    await VaultSnapshot.create({
      timestamp,
      totalAssets: vaultStats.totalAssets.toString(),
      totalShares: vaultStats.totalShares.toString(),
      totalDeposited: vaultStats.totalDeposited.toString(),
      totalWithdrawn: vaultStats.totalWithdrawn.toString(),
      vaultAPY: vaultStats.vaultAPY,
      totalAllocation,
    });

    console.log(`  ✅ Vault APY: ${vaultStats.vaultAPY/100}%`);
    console.log(`  ✅ Total Allocation: ${totalAllocation/100}%\n`);
  } catch (error) {
    console.error("❌ Error collecting data:", error);
  }
}

async function main() {
  console.log("🚀 Starting Yield Aggregator Keeper\n");
  
  // Connect to MongoDB
  await connectDB(config.mongodbUri);

  // Initial collection
  await collectData();

  // Set up interval
  setInterval(async () => {
    await collectData();
  }, config.pollIntervalMs);

  console.log(`⏰ Polling every ${config.pollIntervalMs/1000} seconds\n`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});