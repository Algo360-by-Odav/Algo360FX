import { useContext } from 'react';
import { StoreContext } from '../stores/StoreProvider';
import { RootStore } from '../stores/RootStore';

export const useStores = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return store;
};

