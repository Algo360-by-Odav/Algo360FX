import { Router } from 'express';
import { AsyncHandler } from '../types/express';
import { commonMiddleware, validateBody } from '../middleware';
import { createHandler } from './routeHandler';

export class RouteBuilder {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.use(commonMiddleware);
  }

  get(path: string, handler: AsyncHandler) {
    this.router.get(path, createHandler(handler));
    return this;
  }

  post(path: string, schema: any, handler: AsyncHandler) {
    this.router.post(path, ...validateBody(schema), createHandler(handler));
    return this;
  }

  put(path: string, schema: any, handler: AsyncHandler) {
    this.router.put(path, ...validateBody(schema), createHandler(handler));
    return this;
  }

  delete(path: string, handler: AsyncHandler) {
    this.router.delete(path, createHandler(handler));
    return this;
  }

  patch(path: string, schema: any, handler: AsyncHandler) {
    this.router.patch(path, ...validateBody(schema), createHandler(handler));
    return this;
  }

  // Add custom middleware to a specific route
  withMiddleware(middleware: any[]) {
    this.router.use(middleware);
    return this;
  }

  build() {
    return this.router;
  }
}
