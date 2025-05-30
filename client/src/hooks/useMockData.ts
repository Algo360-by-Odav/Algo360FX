import { useState, useEffect } from 'react';
import mockDataService from '../services/mockDataService';

type DataType = 'marketData' | 'tradingStrategies' | 'subscriptionPlans' | 'marketplace';

interface UseMockDataOptions {
  fetchOnMount?: boolean;
  initialData?: any;
}

/**
 * Custom hook for fetching mock data from the local backend
 * @param dataType The type of mock data to fetch
 * @param options Configuration options
 * @returns Object containing the data, loading state, error state, and refetch function
 */
export function useMockData(dataType: DataType, options: UseMockDataOptions = {}) {
  const { fetchOnMount = true, initialData = null } = options;
  
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (dataType) {
        case 'marketData':
          result = await mockDataService.getMarketData();
          break;
        case 'tradingStrategies':
          result = await mockDataService.getTradingStrategies();
          break;
        case 'subscriptionPlans':
          result = await mockDataService.getSubscriptionPlans();
          break;
        case 'marketplace':
          result = await mockDataService.getMarketplaceItems();
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
      
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchData().catch(err => {
        console.error(`Error fetching ${dataType}:`, err);
      });
    }
  }, [dataType, fetchOnMount]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
