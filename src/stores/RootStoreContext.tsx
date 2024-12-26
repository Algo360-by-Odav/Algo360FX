import React, { useContext } from 'react';
import { RootStore } from './RootStore';

const RootStoreContext = React.createContext<RootStore | null>(null);

export const RootStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = React.useMemo(() => new RootStore(), []);

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  const context = useContext(RootStoreContext);
  if (context === null) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return context;
};

export { RootStoreContext };
