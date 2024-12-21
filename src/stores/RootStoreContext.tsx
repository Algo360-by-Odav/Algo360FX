import React, { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export const RootStoreContext = createContext<RootStore | null>(null);

interface RootStoreProviderProps {
  children: React.ReactNode;
  store: RootStore;
}

export const RootStoreProvider: React.FC<RootStoreProviderProps> = ({ children, store }) => {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};

// Export a hook that throws an error if used outside of context
export const useRootStoreContext = () => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return context;
};
