import { useEffect } from 'react';
import { useRootStore } from './useRootStore';
import hftStrategies from '../config/hftStrategies';

export const useHFTInitialize = () => {
  const rootStore = useRootStore();
  const { hftStore } = rootStore;

  useEffect(() => {
    // Initialize HFT strategies
    hftStrategies.forEach(strategy => {
      hftStore.addStrategy(strategy);
    });

    // Start monitoring
    hftStore.startMonitoring();

    // Cleanup on unmount
    return () => {
      hftStore.stopMonitoring();
    };
  }, [hftStore]);
};

export default useHFTInitialize;
