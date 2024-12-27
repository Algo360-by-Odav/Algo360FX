import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  name: string;
  description: string;
  category: string;
  strategies: mongoose.Types.ObjectId[];
  allocation: {
    strategyId: mongoose.Types.ObjectId;
    weight: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema({
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
}, {
  timestamps: true,
});

// Create text indexes for search
PortfolioSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
});

// Check if the model exists before creating it
export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
export default Portfolio;
