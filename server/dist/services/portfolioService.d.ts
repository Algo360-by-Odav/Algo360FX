import { IPortfolio } from '../models/Portfolio';
import { Document, Types } from 'mongoose';
import { SearchResult } from '../types/search';
export interface PortfolioDocument extends Document, IPortfolio {
    _id: Types.ObjectId;
    __textScore?: number;
    name: string;
    description: string;
}
export declare function searchPortfolios(query: string): Promise<SearchResult[]>;
export declare function createPortfolio(data: Partial<IPortfolio>): Promise<PortfolioDocument>;
export declare function updatePortfolio(id: string, data: Partial<IPortfolio>): Promise<PortfolioDocument | null>;
export declare function deletePortfolio(id: string): Promise<boolean>;
