import React from 'react';
import { AuthContext } from '@/stores/AuthStore';
import { useRootStore } from '@/hooks/useRootStore';
import { observer } from 'mobx-react-lite';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = observer(({ children }) => {
  const rootStore = useRootStore();
  
  return (
    <AuthContext.Provider value={rootStore.authStore}>
      {children}
    </AuthContext.Provider>
  );
});

export default AuthProvider;
