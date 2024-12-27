import mongoose, { Schema, Document } from 'mongoose';

export interface IPosition extends Document {
  userId: string;
  symbol: string;
  type: 'long' | 'short';
  openPrice: number;
  currentPrice: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: Date;
  pnl: number;
  status: 'open' | 'closed';
}

const PositionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['long', 'short'], required: true },
  openPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  size: { type: Number, required: true },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  openTime: { type: Date, default: Date.now },
  pnl: { type: Number, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, {
  timestamps: true
});

// Check if the model exists before creating it
export const Position = mongoose.models.Position || mongoose.model<IPosition>('Position', PositionSchema);
