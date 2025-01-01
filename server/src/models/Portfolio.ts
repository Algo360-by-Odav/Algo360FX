import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  strategies: mongoose.Types.ObjectId[];
  allocation: {
    strategyId: mongoose.Types.ObjectId;
    weight: number;
  }[];
  balance: number;
  equity: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  strategies: [{
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
  }],
  allocation: [{
    strategyId: {
      type: Schema.Types.ObjectId,
      ref: 'Strategy',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  }],
  balance: {
    type: Number,
    default: 0
  },
  equity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Indexes
PortfolioSchema.index({ user: 1, name: 1 }, { unique: true });
PortfolioSchema.index({ user: 1, category: 1 });

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
