// authContextJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import { useApp } from './AppContext';

// Create a simple context
const AuthContext = React.createContext(null);

// Create a hook to use the context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create a provider component
export const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Always authenticated in dev mode
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({ username: 'dev_user' }); // Mock user
  const { showNotification } = useApp();

  const isDevelopment = true; // Always treat as development

  const checkAuthState = async () => {
    // In development, always set as authenticated
    setUser({ username: 'dev_user' });
    setIsAuthenticated(true);
    setIsLoading(false);
    return;
  };

  // Mock sign in function
  const signIn = async (username, password) => {
    setUser({ username });
    setIsAuthenticated(true);
    return { username };
  };

  // Mock sign up function
  const signUp = async (username, password, email) => {
    setUser({ username });
    setIsAuthenticated(true);
  };

  // Mock sign out function
  const signOut = async () => {
    // In development mode, don't actually sign out
    showNotification('Sign out disabled in development mode', 'info');
  };

  // Mock login function
  const login = () => {
    setIsAuthenticated(true);
    setUser({ username: 'dev_user' });
  };

  // Initialize auth state
  React.useEffect(() => {
    checkAuthState();
  }, []);

  // Create the context value
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

  // Return the provider with the context value
  return React.createElement(AuthContext.Provider, { value }, props.children);
};

export { AuthContext };
