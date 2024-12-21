import { useMemo } from 'react';

interface Config {
  isDevelopment: boolean;
  apiUrl: string;
  wsUrl: string;
}

export const useConfig = (): Config => {
  return useMemo(() => ({
    isDevelopment: process.env.NODE_ENV === 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3004',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:6780',
  }), []);
};

export default useConfig;
