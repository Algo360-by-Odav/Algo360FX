import { ApiError } from '../types/express';

export abstract class BaseService {
  protected handleError(error: unknown, message: string = 'Service operation failed'): never {
    console.error('Service Error:', error);
    
    if (error instanceof Error) {
      const apiError: ApiError = error;
      apiError.status = apiError.status || 500;
      throw apiError;
    }
    
    const apiError = new Error(message) as ApiError;
    apiError.status = 500;
    throw apiError;
  }

  protected async handleAsync<T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  protected createError(message: string, status: number = 500, code?: string): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    if (code) error.code = code;
    return error;
  }
}
