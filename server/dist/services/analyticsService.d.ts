import { IAnalytics } from '../models/Analytics';
import { Document, Types } from 'mongoose';
import { SearchResult } from '../types/search';
export interface AnalyticsDocument extends Document, IAnalytics {
    _id: Types.ObjectId;
    __textScore?: number;
    name: string;
    description: string;
}
export declare function searchAnalytics(query: string): Promise<SearchResult[]>;
