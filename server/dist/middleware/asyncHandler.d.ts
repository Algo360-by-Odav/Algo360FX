import { Request, Response, NextFunction, RequestHandler } from 'express';
type AsyncHandlerFunction<TReq = Request, TRes = any> = (req: TReq, res: Response, next: NextFunction) => Promise<TRes>;
export declare const asyncHandler: <TReq = Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, TRes = any>(fn: AsyncHandlerFunction<TReq, TRes>) => RequestHandler;
export {};
