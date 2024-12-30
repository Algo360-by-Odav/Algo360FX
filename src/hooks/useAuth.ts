import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from './useRootStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { authStore } = useRootStore();

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        await authStore.login({ email, password, rememberMe });
        navigate('/dashboard');
      } catch (error) {
        // Error handling is managed by the store
      }
    },
    [authStore, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authStore.logout();
      navigate('/auth/login');
    } catch (error) {
      // Error handling is managed by the store
    }
  }, [authStore, navigate]);

  const register = useCallback(
    async (data: {
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      try {
        await authStore.register(data);
        navigate('/dashboard');
      } catch (error) {
        // Error handling is managed by the store
      }
    },
    [authStore, navigate]
  );

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login,
    logout,
    register,
  };
};

export default useAuth;
