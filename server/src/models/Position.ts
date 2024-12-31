import mongoose from 'mongoose';

export interface IPosition {
  user: mongoose.Types.ObjectId;
  portfolio: mongoose.Types.ObjectId;
  symbol: string;
  type: 'buy' | 'sell';
  lotSize: number;
  openPrice: number;
  closePrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'open' | 'closed';
  openedAt: Date;
  closedAt?: Date;
  strategy?: mongoose.Types.ObjectId;
  profitLoss?: number;
  pips?: number;
}

const positionSchema = new mongoose.Schema<IPosition>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  lotSize: {
    type: Number,
    required: true,
    min: 0.01
  },
  openPrice: {
    type: Number,
    required: true
  },
  closePrice: {
    type: Number
  },
  stopLoss: {
    type: Number
  },
  takeProfit: {
    type: Number
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  openedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date
  },
  strategy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy'
  },
  profitLoss: {
    type: Number
  },
  pips: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for faster queries
positionSchema.index({ user: 1, status: 1 });
positionSchema.index({ portfolio: 1, status: 1 });
positionSchema.index({ strategy: 1, status: 1 });
positionSchema.index({ symbol: 1, status: 1 });
positionSchema.index({ openedAt: -1 });

export const Position = mongoose.model<IPosition>('Position', positionSchema);
