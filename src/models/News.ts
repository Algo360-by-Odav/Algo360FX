import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  source: string;
  publishedAt: Date;
  categories: string[];
  relatedSymbols: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String, required: true },
  publishedAt: { type: Date, required: true, index: true },
  categories: [{ type: String, index: true }],
  relatedSymbols: [{ type: String, index: true }],
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
NewsSchema.index({ categories: 1 });
NewsSchema.index({ relatedSymbols: 1 });
NewsSchema.index({ publishedAt: -1 }); // Descending index for latest news

export default mongoose.model<INews>('News', NewsSchema); 