// @ts-nocheck
// AppContext.tsx - Simple implementation without JSX
// This file avoids using JSX to prevent Vite React plugin preamble detection errors

import React from 'react';

// Create a simple context
export const AppContext = React.createContext(null);

// Create a simple provider component
export const AppProvider = (props) => {
  // Create a simple context value
  const contextValue = {
    isLoading: false,
    loadingMessage: null,
    isConnected: true,
    notifications: [],
    lastError: null,
    theme: 'dark',
    language: 'en',
    layout: {
      sidebarOpen: true,
      chartLayout: 'default'
    },
    // Dummy functions
    setLoading: function() {},
    setLoadingMessage: function() {},
    setConnected: function() {},
    addNotification: function() {},
    removeNotification: function() {},
    setError: function() {},
    clearError: function() {},
    setTheme: function() {},
    setLanguage: function() {},
    toggleSidebar: function() {},
    setChartLayout: function() {},
    clearNotifications: function() {},
    showNotification: function(message, type) {
      console.log('Notification: ' + message + ' (' + type + ')');
    }
  };

  // Return the provider with the context value
  return React.createElement(AppContext.Provider, { value: contextValue }, props.children);
};

// Create a hook to use the context
export const useApp = function() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
