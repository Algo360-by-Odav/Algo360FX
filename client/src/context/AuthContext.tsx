import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth';
import { useApp } from './AppContext';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (username: string, password: string) => Promise<any>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const { showNotification } = useApp();

  const isDevelopment = import.meta.env.DEV;

  const checkAuthState = async () => {
    if (isDevelopment) {
      setUser({ username: 'dev_user' });
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    if (isDevelopment) {
      setUser({ username: 'dev_user' });
      setIsAuthenticated(true);
      return;
    }

    try {
      const result = await amplifySignIn({ username, password });
      setUser(result);
      setIsAuthenticated(true);
      showNotification('Successfully logged in', 'success');
    } catch (error) {
      console.error('Sign in error:', error);
      showNotification('Failed to log in', 'error');
      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    if (isDevelopment) {
      setUser({ username: 'dev_user' });
      setIsAuthenticated(true);
      return;
    }

    try {
      await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      showNotification('Successfully signed up. Please check your email for verification.', 'success');
    } catch (error) {
      console.error('Sign up error:', error);
      showNotification('Failed to sign up', 'error');
      throw error;
    }
  };

  const signOut = async () => {
    if (isDevelopment) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      await amplifySignOut();
      setUser(null);
      setIsAuthenticated(false);
      showNotification('Successfully logged out', 'success');
    } catch (error) {
      console.error('Sign out error:', error);
      showNotification('Failed to log out', 'error');
      throw error;
    }
  };

  const login = () => {
    if (isDevelopment) {
      setUser({ username: 'dev_user' });
      setIsAuthenticated(true);
      return;
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signUp,
    signOut,
    checkAuthState,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
