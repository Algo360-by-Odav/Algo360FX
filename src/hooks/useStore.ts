import { useContext } from 'react';
import { RootStoreContext } from '../stores/RootStoreContext';
import { RootStore } from '../stores/RootStore';

export const useStore = (): RootStore => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useStore must be used within RootStoreProvider');
  }
  return store;
};

export default useStore;
