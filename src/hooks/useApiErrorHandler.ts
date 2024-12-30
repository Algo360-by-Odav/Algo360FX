import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiErrorState {
  message: string;
  code?: string | number;
  isVisible: boolean;
}

interface UseApiErrorHandlerResult {
  error: ApiErrorState | null;
  handleError: (error: unknown) => void;
  clearError: () => void;
  retryRequest: <T>(requestFn: () => Promise<T>) => Promise<T | null>;
}

export const useApiErrorHandler = (): UseApiErrorHandlerResult => {
  const [error, setError] = useState<ApiErrorState | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      let message: string;
      let code: string | number | undefined;

      if (axiosError.response) {
        // Server responded with an error
        message = axiosError.response.data?.message || axiosError.message;
        code = axiosError.response.status;
      } else if (axiosError.request) {
        // Request was made but no response received
        message = 'No response received from server';
        code = 'NETWORK_ERROR';
      } else {
        // Error in request configuration
        message = axiosError.message;
        code = 'REQUEST_ERROR';
      }

      setError({
        message,
        code,
        isVisible: true,
      });
    } else if (error instanceof Error) {
      setError({
        message: error.message,
        isVisible: true,
      });
    } else {
      setError({
        message: 'An unexpected error occurred',
        isVisible: true,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryRequest = useCallback(async <T>(
    requestFn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T | null> => {
    let retries = 0;

    const executeRequest = async (): Promise<T | null> => {
      try {
        return await requestFn();
      } catch (error) {
        if (retries < maxRetries && navigator.onLine) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, delay * retries));
          return executeRequest();
        }
        handleError(error);
        return null;
      }
    };

    return executeRequest();
  }, [handleError]);

  return {
    error,
    handleError,
    clearError,
    retryRequest,
  };
};
