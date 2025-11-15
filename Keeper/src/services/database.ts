import mongoose, { Schema, Document } from "mongoose";

// ========== INTERFACES ==========
export interface IStrategySnapshot extends Document {
  strategyAddress: string;
  strategyName: string;
  timestamp: Date;
  balance: string;
  currentAPY: number;
  baseAPY: number;
  allocation: number;
  totalHarvested: string;
  lastHarvest: Date;
  hourlyYield: string;
  isActive: boolean;
}

export interface IAllocationHistory extends Document {
  strategyAddress: string;
  strategyName: string;
  timestamp: Date;
  allocation: number;
  totalAllocation: number;
}

export interface IAPYHistory extends Document {
  strategyAddress: string;
  strategyName: string;
  timestamp: Date;
  apy: number;
  baseAPY: number;
}

export interface IVaultSnapshot extends Document {
  timestamp: Date;
  totalAssets: string;
  totalShares: string;
  totalDeposited: string;
  totalWithdrawn: string;
  vaultAPY: number;
  totalAllocation: number;
}

// ========== SCHEMAS ==========
const StrategySnapshotSchema = new Schema<IStrategySnapshot>({
  strategyAddress: { type: String, required: true, index: true },
  strategyName: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  balance: { type: String, required: true },
  currentAPY: { type: Number, required: true },
  baseAPY: { type: Number, required: true },
  allocation: { type: Number, required: true },
  totalHarvested: { type: String, required: true },
  lastHarvest: { type: Date, required: true },
  hourlyYield: { type: String, required: true },
  isActive: { type: Boolean, required: true },
});

const AllocationHistorySchema = new Schema<IAllocationHistory>({
  strategyAddress: { type: String, required: true, index: true },
  strategyName: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  allocation: { type: Number, required: true },
  totalAllocation: { type: Number, required: true },
});

const APYHistorySchema = new Schema<IAPYHistory>({
  strategyAddress: { type: String, required: true, index: true },
  strategyName: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  apy: { type: Number, required: true },
  baseAPY: { type: Number, required: true },
});

const VaultSnapshotSchema = new Schema<IVaultSnapshot>({
  timestamp: { type: Date, required: true, index: true },
  totalAssets: { type: String, required: true },
  totalShares: { type: String, required: true },
  totalDeposited: { type: String, required: true },
  totalWithdrawn: { type: String, required: true },
  vaultAPY: { type: Number, required: true },
  totalAllocation: { type: Number, required: true },
});

// Compound indexes for efficient queries
StrategySnapshotSchema.index({ strategyAddress: 1, timestamp: -1 });
AllocationHistorySchema.index({ strategyAddress: 1, timestamp: -1 });
APYHistorySchema.index({ strategyAddress: 1, timestamp: -1 });

// ========== MODELS ==========
export const StrategySnapshot = mongoose.model<IStrategySnapshot>("StrategySnapshot", StrategySnapshotSchema);
export const AllocationHistory = mongoose.model<IAllocationHistory>("AllocationHistory", AllocationHistorySchema);
export const APYHistory = mongoose.model<IAPYHistory>("APYHistory", APYHistorySchema);
export const VaultSnapshot = mongoose.model<IVaultSnapshot>("VaultSnapshot", VaultSnapshotSchema);

// ========== CONNECTION ==========
export async function connectDB(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB error:", error);
    throw error;
  }
}
