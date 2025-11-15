const { ethers } = require('ethers');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const STRATEGY_MANAGER_ABI = [
  "function submitAI((address manager, uint256 nonce, uint256 deadline, uint256[] indices, uint256[] allocations, uint256 timestamp, string modelVersion, uint256 confidence) rec, bytes sig) external",
  "function getAgentNonce(address agent) external view returns (uint256)",
  "event AISubmitted(address indexed agent, uint256 nonce, uint256 confidence)"
];


class BlockchainSubmitter {
  constructor() {
    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) throw new Error('RPC_URL is not set in environment');

    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Prefer a direct private key; fallback to mnemonic
    const pk = process.env.PRIVATE_KEY;
    const mnemonic = process.env.MNEMONIC;

    if (!pk && !mnemonic) {
      // very explicit, easier to diagnose than the internal SigningKey error
      throw new Error('No PRIVATE_KEY or MNEMONIC found in environment. Add PRIVATE_KEY=0x... or MNEMONIC="word1 word2 ..." to .env');
    }

    // masked debug log (safe)
    if (pk) {
      console.log('Using PRIVATE_KEY: ' + (typeof pk === 'string' ? `${pk.slice(0,6)}...${pk.slice(-4)}` : typeof pk));
      // ensure private key looks like hex
      if (typeof pk !== 'string' || !pk.match(/^0x[0-9a-fA-F]{64}$/)) {
        throw new Error('PRIVATE_KEY must be a 0x-prefixed 64-hex-char string. Example: PRIVATE_KEY=0xabc123...');
      }
      this.wallet = new ethers.Wallet(pk, this.provider);
    } else {
      console.log('Using MNEMONIC (first account)');
      if (typeof mnemonic !== 'string' || mnemonic.trim().split(/\s+/).length < 12) {
        throw new Error('MNEMONIC looks invalid. Provide a standard BIP-39 mnemonic phrase.');
      }
      this.wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(this.provider);
    }

    // contract setup
    this.contract = new ethers.Contract(
      process.env.STRATEGY_MANAGER_ADDRESS,
      STRATEGY_MANAGER_ABI,
      this.wallet
    );

    this.mongoClient = new MongoClient(process.env.MONGO_URI);
  }


  async connect() {
    await this.mongoClient.connect();
    this.db = this.mongoClient.db(process.env.MONGO_DB);
    console.log('✅ Connected to MongoDB');
  }

  async getPendingRecommendations() {
    const recommendations = this.db.collection('recommendations');
    return await recommendations.find({
      status: 'pending',
      submitted: false,
      'recommendation.deadline': { $gt: Math.floor(Date.now() / 1000) }
    }).sort({ timestamp: -1 }).limit(1).toArray();
  }

  async verifyNonce(recommendation) {
    const onChainNonce = await this.contract.getAgentNonce(recommendation.signer);
    const expectedNonce = recommendation.recommendation.nonce;
    
    if (onChainNonce.toNumber() !== expectedNonce) {
      throw new Error(`Nonce mismatch: on-chain=${onChainNonce}, expected=${expectedNonce}`);
    }
    
    console.log(`✅ Nonce verified: ${expectedNonce}`);
  }

  async submitRecommendation(recommendation) {
    console.log('\n📤 Submitting to blockchain...');
    console.log(`Signer: ${recommendation.signer}`);
    console.log(`Confidence: ${recommendation.recommendation.confidence / 1e18 * 100}%`);
    
    // Verify nonce before submission
    await this.verifyNonce(recommendation);
    
    // Prepare transaction
    const rec = {
      manager: recommendation.recommendation.manager,
      nonce: recommendation.recommendation.nonce,
      deadline: recommendation.recommendation.deadline,
      indices: recommendation.recommendation.indices,
      allocations: recommendation.recommendation.allocations,
      timestamp: recommendation.recommendation.timestamp,
      modelVersion: recommendation.recommendation.modelVersion,
      confidence: recommendation.recommendation.confidence.toString()
    };
    
    const signature = recommendation.signature;
    
    // Estimate gas
    const gasEstimate = await this.contract.estimateGas.submitAI(rec, signature);
    console.log(`⛽ Gas estimate: ${gasEstimate.toString()}`);
    
    // Submit transaction
    const tx = await this.contract.submitAI(rec, signature, {
      gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
    });
    
    console.log(`\n🔄 Transaction sent: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async markAsSubmitted(recommendationId, txData) {
    const recommendations = this.db.collection('recommendations');
    await recommendations.updateOne(
      { _id: recommendationId },
      {
        $set: {
          submitted: true,
          status: 'submitted',
          submittedAt: new Date(),
          txHash: txData.txHash,
          blockNumber: txData.blockNumber,
          gasUsed: txData.gasUsed
        }
      }
    );
  }

  async run() {
    try {
      await this.connect();
      
      console.log('🔍 Checking for pending recommendations...');
      const pending = await this.getPendingRecommendations();
      
      if (pending.length === 0) {
        console.log('No pending recommendations found');
        return;
      }
      
      const recommendation = pending[0];
      console.log(`\n📋 Found recommendation: ${recommendation._id}`);
      console.log('Allocations:');
      recommendation.predictions.forEach(pred => {
        console.log(`  Strategy ${pred.index}: ${pred.recommended_allocation / 100}%`);
      });
      
      // Submit to blockchain
      const txData = await this.submitRecommendation(recommendation);
      
      // Mark as submitted
      await this.markAsSubmitted(recommendation._id, txData);
      
      console.log('\n🎉 Successfully submitted AI recommendation!');
      
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      throw error;
    } finally {
      await this.mongoClient.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const submitter = new BlockchainSubmitter();
  submitter.run()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = BlockchainSubmitter;