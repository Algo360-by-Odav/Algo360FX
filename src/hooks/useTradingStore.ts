import { useRootStore } from './useRootStore';

export const useTradingStore = () => {
  const rootStore = useRootStore();
  return rootStore.tradingStore;
};
