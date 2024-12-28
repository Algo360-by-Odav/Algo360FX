import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from './useRootStore';
import { SignupData } from '@/types/user';

export const useAuth = () => {
  const navigate = useNavigate();
  const { authStore } = useRootStore();

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        await authStore.login(email, password);
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

  const sendVerificationCode = useCallback(
    async (email: string) => {
      try {
        return await authStore.sendVerificationCode(email);
      } catch (error) {
        // Error handling is managed by the store
        throw error;
      }
    },
    [authStore]
  );

  const register = useCallback(
    async (data: SignupData) => {
      try {
        await authStore.register(data);
        navigate('/auth/login');
      } catch (error) {
        // Error handling is managed by the store
        throw error;
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
    sendVerificationCode,
  };
};

export default useAuth;
