import mongoose, { Document } from 'mongoose';
export interface IDocumentation extends Document {
    title: string;
    content: string;
    category: string;
    tags: string[];
    relatedDocs: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Documentation: mongoose.Model<IDocumentation, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentation> & IDocumentation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Documentation;
