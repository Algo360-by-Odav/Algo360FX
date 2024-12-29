import { IDocumentation } from '../models/Documentation';
import { Document, Types } from 'mongoose';
import { SearchResult } from '../types/search';
export interface DocumentationDocument extends Document, IDocumentation {
    _id: Types.ObjectId;
    __textScore?: number;
    title: string;
    description: string;
}
export declare function searchDocumentation(query: string): Promise<SearchResult[]>;
