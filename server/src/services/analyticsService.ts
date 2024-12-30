import { IAnalytics } from '../models/Analytics';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

export interface AnalyticsDocument extends Document, IAnalytics {
  _id: Types.ObjectId;
  __textScore?: number;
  name: string;
  description: string;
}

const analyticsSchema = new Schema<AnalyticsDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Add other fields as needed
});

const Analytics = model<AnalyticsDocument>('Analytics', analyticsSchema);

export async function searchAnalytics(query: string): Promise<SearchResult[]> {
  try {
    const analytics = await Analytics.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    return analytics.map(analytic => ({
      id: analytic._id.toString(),
      type: 'analytics',
      title: analytic.name,
      description: analytic.description,
      score: analytic.__textScore || 0
    }));
  } catch (error) {
    console.error('Search analytics error:', error);
    return [];
  }
}
