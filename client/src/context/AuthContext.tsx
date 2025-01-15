import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth';
import { useNotification } from './AppContext.js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (username: string, password: string) => Promise<void>;
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
  const { showNotification } = useNotification();

  const checkAuthState = async () => {
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

  useEffect(() => {
    checkAuthState();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      await amplifySignIn({ username, password });
      await checkAuthState();
      showNotification('Successfully signed in', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to sign in', 'error');
      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      showNotification('Successfully signed up. Please check your email for verification.', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to sign up', 'error');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAuthenticated(false);
      showNotification('Successfully signed out', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to sign out', 'error');
      throw error;
    }
  };

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signUp,
    signOut,
    checkAuthState,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
