import React from 'react';
import { RootStoreContext, rootStore } from '../../stores/rootStore';

interface Props {
  children: React.ReactNode;
}

export const RootStoreProvider: React.FC<Props> = ({ children }) => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};
