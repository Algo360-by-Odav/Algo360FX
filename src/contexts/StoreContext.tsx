import React, { createContext } from 'react';
import { RootStore } from '../stores/RootStore';

export const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
  store: RootStore;
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
