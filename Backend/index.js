// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { createPublicClient, http, parseAbiItem } = require('viem');
const { sepolia } = require('viem/chains');

const app = express();
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Pool APY Schema
const poolApySchema = new mongoose.Schema({
  poolId: { type: String, required: true },
  poolAddress: { type: String, required: true },
  poolName: { type: String, required: true },
  apy: { type: String, required: true },
  apyPercentage: { type: Number, required: true }, // APY as percentage for easier querying
  timestamp: { type: Date, default: Date.now },
});

poolApySchema.index({ poolId: 1, timestamp: -1 });
const PoolApy = mongoose.model('PoolApy', poolApySchema);

// Validate required environment variables
const requiredEnvVars = [
  'YIELD_VAULT_ADDRESS',
  'LENDING_STRATEGY_ADDRESS',
  'LIQUIDITY_STRATEGY_ADDRESS',
  'STAKING_STRATEGY_ADDRESS',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is required`);
  }
});

// Contract Configuration
const YIELD_VAULT_ADDRESS = process.env.YIELD_VAULT_ADDRESS;

// Strategy ABI - IStrategy interface
const STRATEGY_ABI = [
  parseAbiItem('function estimatedAPY() external view returns (uint256)'),
  parseAbiItem('function balanceOf() external view returns (uint256)'),
];

// Pool Configuration (Three Strategies)
const POOLS = [
  {
    id: '0',
    address: process.env.LENDING_STRATEGY_ADDRESS,
    name: 'Lending Strategy',
    description: 'Lower risk lending protocol (4% base APY)',
  },
  {
    id: '1',
    address: process.env.LIQUIDITY_STRATEGY_ADDRESS,
    name: 'Liquidity Strategy',
    description: 'Higher risk DEX liquidity (12% base APY)',
  },
  {
    id: '2',
    address: process.env.STAKING_STRATEGY_ADDRESS,
    name: 'Staking Strategy',
    description: 'Medium risk staking (7% base APY)',
  },
];

// Create Viem Public Client for Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo'),
});

// Fetch APY for a single pool (strategy)
async function fetchPoolApy(pool) {
  try {
    console.log(`Fetching APY for ${pool.name} at ${pool.address}...`);

    const apy = await publicClient.readContract({
      address: pool.address,
      abi: STRATEGY_ABI,
      functionName: 'estimatedAPY',
    });

    // APY is returned in basis points (e.g., 500 = 5%)
    const apyBasisPoints = apy.toString();
    const apyPercentage = Number(apyBasisPoints) / 100; // Convert to percentage

    return {
      apyBasisPoints,
      apyPercentage,
    };
  } catch (error) {
    console.error(`Error fetching APY for ${pool.name}:`, error.message);
    throw error;
  }
}

// Fetch and store APY for all pools
async function updateAllPoolApys() {
  console.log(`\n[${ new Date().toISOString()}] 🔄 Updating APY data for all pools...`);
  console.log('='.repeat(60));

  const results = [];

  for (const pool of POOLS) {
    try {
      const { apyBasisPoints, apyPercentage } = await fetchPoolApy(pool);

      const poolData = new PoolApy({
        poolId: pool.id,
        poolAddress: pool.address,
        poolName: pool.name,
        apy: apyBasisPoints,
        apyPercentage: apyPercentage,
        timestamp: new Date(),
      });

      await poolData.save();
      
      console.log(`✅ ${pool.name}`);
      console.log(`   Address: ${pool.address}`);
      console.log(`   APY: ${apyPercentage.toFixed(2)}% (${apyBasisPoints} basis points)`);
      console.log('');

      results.push({
        poolId: pool.id,
        poolName: pool.name,
        success: true,
        apy: apyPercentage,
      });
    } catch (error) {
      console.error(`❌ Failed to update ${pool.name}`);
      console.error(`   Error: ${error.message}\n`);
      
      results.push({
        poolId: pool.id,
        poolName: pool.name,
        success: false,
        error: error.message,
      });
    }
  }

  console.log('='.repeat(60));
  console.log(`✓ APY update completed at ${new Date().toISOString()}\n`);
  
  return results;
}

// Schedule hourly updates
function scheduleHourlyUpdates() {
  console.log('📅 Scheduling hourly APY updates...\n');
  
  // Run immediately on startup
  updateAllPoolApys().catch(err => {
    console.error('Error in initial APY update:', err);
  });

  // Then run every hour (3600000 ms)
  setInterval(() => {
    updateAllPoolApys().catch(err => {
      console.error('Error in scheduled APY update:', err);
    });
  }, 60 * 60 * 1000);
}

// ============================================================================
// API Routes
// ============================================================================

// Get latest APY for all pools
app.get('/api/apy/latest', async (req, res) => {
  try {
    const latestApys = await Promise.all(
      POOLS.map(async (pool) => {
        const latest = await PoolApy.findOne({ poolId: pool.id })
          .sort({ timestamp: -1 })
          .limit(1);
        
        return {
          poolId: pool.id,
          poolName: pool.name,
          poolAddress: pool.address,
          description: pool.description,
          apy: latest?.apy || 'N/A',
          apyPercentage: latest?.apyPercentage || 0,
          timestamp: latest?.timestamp || null,
        };
      })
    );

    res.json({
      success: true,
      data: latestApys,
      vaultAddress: YIELD_VAULT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching latest APY:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get APY history for a specific pool
app.get('/api/apy/history/:poolId', async (req, res) => {
  try {
    const { poolId } = req.params;
    const limit = parseInt(req.query.limit) || 24; // Default last 24 entries (24 hours)

    // Validate poolId
    const pool = POOLS.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({
        success: false,
        error: `Pool with ID ${poolId} not found`,
      });
    }

    const history = await PoolApy.find({ poolId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      poolId,
      poolName: pool.name,
      poolAddress: pool.address,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching APY history:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get APY statistics for a specific pool
app.get('/api/apy/stats/:poolId', async (req, res) => {
  try {
    const { poolId } = req.params;
    const days = parseInt(req.query.days) || 7; // Default 7 days

    const pool = POOLS.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({
        success: false,
        error: `Pool with ID ${poolId} not found`,
      });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const history = await PoolApy.find({
      poolId,
      timestamp: { $gte: cutoffDate },
    }).sort({ timestamp: 1 });

    if (history.length === 0) {
      return res.json({
        success: true,
        message: 'No data available for the specified period',
        poolId,
        poolName: pool.name,
      });
    }

    const apys = history.map(h => h.apyPercentage);
    const avgApy = apys.reduce((sum, apy) => sum + apy, 0) / apys.length;
    const minApy = Math.min(...apys);
    const maxApy = Math.max(...apys);
    const currentApy = apys[apys.length - 1];

    res.json({
      success: true,
      poolId,
      poolName: pool.name,
      poolAddress: pool.address,
      period: `${days} days`,
      stats: {
        current: currentApy.toFixed(2),
        average: avgApy.toFixed(2),
        minimum: minApy.toFixed(2),
        maximum: maxApy.toFixed(2),
        dataPoints: history.length,
      },
      data: history,
    });
  } catch (error) {
    console.error('Error fetching APY stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Manual trigger to update APY
app.post('/api/apy/update', async (req, res) => {
  try {
    console.log('Manual APY update triggered via API');
    const results = await updateAllPoolApys();
    
    res.json({
      success: true,
      message: 'APY update completed successfully',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in manual APY update:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all pool information
app.get('/api/pools', (req, res) => {
  res.json({
    success: true,
    vaultAddress: YIELD_VAULT_ADDRESS,
    pools: POOLS,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    network: 'sepolia',
    vaultAddress: YIELD_VAULT_ADDRESS,
    poolCount: POOLS.length,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Yield Aggregator APY Tracker',
    version: '1.0.0',
    network: 'Sepolia Testnet',
    description: 'Tracks APY for three yield strategies: Lending, Liquidity, and Staking',
    endpoints: {
      health: 'GET /health',
      pools: 'GET /api/pools',
      latestApy: 'GET /api/apy/latest',
      history: 'GET /api/apy/history/:poolId?limit=24',
      stats: 'GET /api/apy/stats/:poolId?days=7',
      manualUpdate: 'POST /api/apy/update',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;

mongoose.connection.once('open', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Yield Aggregator APY Tracker Server');
  console.log('='.repeat(60));
  console.log('✅ MongoDB connected');
  console.log(`✅ Network: Sepolia Testnet`);
  console.log(`✅ Yield Vault: ${YIELD_VAULT_ADDRESS}`);
  console.log('');
  console.log('📊 Tracking Strategies:');
  POOLS.forEach(pool => {
    console.log(`   ${pool.id}. ${pool.name}`);
    console.log(`      Address: ${pool.address}`);
    console.log(`      ${pool.description}`);
  });
  console.log('');
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ API Documentation: http://localhost:${PORT}`);
    console.log('');
    scheduleHourlyUpdates();
  });
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});