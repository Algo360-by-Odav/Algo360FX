import { createContext, useContext } from 'react';
import { RootStore, rootStore } from './rootStore';

export const StoreContext = createContext<RootStore>(rootStore);

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export default rootStore;
