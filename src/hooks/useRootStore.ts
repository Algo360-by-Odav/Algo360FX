import { useContext } from 'react';
import { RootStoreContext } from '@/stores/RootStoreContext';
import { RootStore } from '@/stores/RootStore';

export const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return store;
};

export default useRootStore;

