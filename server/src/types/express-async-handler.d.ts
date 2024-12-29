declare module 'express-async-handler' {
  import { Request, Response, NextFunction, RequestHandler } from 'express';

  type AsyncRequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => Promise<any>;

  function expressAsyncHandler(handler: AsyncRequestHandler): RequestHandler;

  export = expressAsyncHandler;
}
