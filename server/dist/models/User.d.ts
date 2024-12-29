import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
