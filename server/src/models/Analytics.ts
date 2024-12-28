import mongoose, { Schema, Document } from 'mongoose';

export interface AnalyticsData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface AnalyticsParameters {
  timeframe?: string;
  period?: number;
  source?: string;
  settings?: Record<string, string | number | boolean>;
}

export interface IAnalytics extends Document {
  name: string;
  description: string;
  category: string;
  type: string;
  data: Record<string, AnalyticsData>;
  parameters: AnalyticsParameters;
  relatedStrategies: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['PERFORMANCE', 'RISK', 'CORRELATION', 'CUSTOM'],
  },
  data: {
    type: Map,
    of: {
      type: new Schema({
        timestamp: Date,
        value: Number,
        metadata: Schema.Types.Mixed,
      }),
    },
    required: true,
  },
  parameters: {
    type: new Schema({
      timeframe: String,
      period: Number,
      source: String,
      settings: Schema.Types.Mixed,
    }),
    default: {},
  },
  relatedStrategies: [{
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Create text indexes for search
AnalyticsSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
});

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;
