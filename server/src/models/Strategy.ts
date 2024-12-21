import mongoose, { Schema, Document } from 'mongoose';

export interface IStrategy extends Document {
  name: string;
  description: string;
  type: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search
strategySchema.index({ 
  name: 'text', 
  description: 'text', 
  type: 'text',
  category: 'text'
});

const Strategy = mongoose.model<IStrategy>('Strategy', strategySchema);

export default Strategy;
