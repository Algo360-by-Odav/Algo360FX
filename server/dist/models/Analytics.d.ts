import mongoose, { Document } from 'mongoose';
export interface IAnalytics extends Document {
    name: string;
    description: string;
    category: string;
    type: string;
    data: Record<string, any>;
    parameters: Record<string, any>;
    relatedStrategies: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Analytics: mongoose.Model<IAnalytics, {}, {}, {}, mongoose.Document<unknown, {}, IAnalytics> & IAnalytics & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Analytics;
