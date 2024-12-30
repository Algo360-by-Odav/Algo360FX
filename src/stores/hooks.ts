import { useContext } from 'react';
import { RootStoreContext } from './RootStoreContext.tsx';

export const useAlgoTradingStore = () => {
  const rootStore = useContext(RootStoreContext);
  if (!rootStore) {
    throw new Error('useAlgoTradingStore must be used within a RootStoreProvider');
  }
  return rootStore.algoTradingStore;
};
