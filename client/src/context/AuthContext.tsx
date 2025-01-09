import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signOut, signUp, getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { calculateSecretHash } from '../utils/auth';

const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_COGNITO_CLIENT_SECRET;

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setIsAuthenticated(true);
      setUser(currentUser);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      const { isSignedIn, nextStep } = await signIn({ 
        username, 
        password,
        options: {
          secretHash
        }
      });
      if (isSignedIn) {
        await checkAuthState();
      }
      return { isSignedIn, nextStep };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const handleSignUp = async (username: string, password: string, email: string) => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      const { nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          },
          secretHash
        }
      });
      return nextStep;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp: handleSignUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
