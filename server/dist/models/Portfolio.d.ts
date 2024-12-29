import mongoose, { Document } from 'mongoose';
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
export declare const Portfolio: mongoose.Model<IPortfolio, {}, {}, {}, mongoose.Document<unknown, {}, IPortfolio> & IPortfolio & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Portfolio;
