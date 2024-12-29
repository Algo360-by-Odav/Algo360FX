import mongoose, { Document } from 'mongoose';
export interface IStrategy extends Document {
    name: string;
    description: string;
    type: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Strategy: mongoose.Model<IStrategy, {}, {}, {}, mongoose.Document<unknown, {}, IStrategy> & IStrategy & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Strategy;
