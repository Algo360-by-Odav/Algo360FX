import React, { createContext, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const { authStore } = useRootStore();

  useEffect(() => {
    // Initialize auth state
    authStore.checkAuth();
  }, [authStore]);

  const value = {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    loading: authStore.isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
