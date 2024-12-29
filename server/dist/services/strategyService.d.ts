import { IStrategy } from '../models/Strategy';
import { Document, Types } from 'mongoose';
import { SearchResult } from '../types/search';
export interface StrategyDocument extends Document, IStrategy {
    _id: Types.ObjectId;
    __textScore?: number;
    name: string;
    description: string;
    parameters: Record<string, any>;
    backtest?: {
        startDate: Date;
        endDate: Date;
        results: Record<string, any>;
    };
}
export declare function searchStrategies(query: string): Promise<SearchResult[]>;
export declare function createStrategy(data: Partial<IStrategy>): Promise<StrategyDocument>;
export declare function updateStrategy(id: string, data: Partial<IStrategy>): Promise<StrategyDocument | null>;
export declare function deleteStrategy(id: string): Promise<boolean>;
export declare function getStrategyById(id: string): Promise<StrategyDocument | null>;
export declare function runBacktest(id: string, startDate: Date, endDate: Date): Promise<StrategyDocument | null>;
