import { useState, useEffect } from 'react';
import { performanceService, PerformanceData } from '../services/performanceService';
import { TimeFrame } from '../config';

interface UsePerformanceDataResult {
  data: PerformanceData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePerformanceData = (portfolioId: string, timeframe: TimeFrame): UsePerformanceDataResult => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await performanceService.getPortfolioPerformance(portfolioId, timeframe);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch performance data'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [portfolioId, timeframe, version]);

  const refetch = () => {
    setVersion(v => v + 1);
  };

  return { data, loading, error, refetch };
};
