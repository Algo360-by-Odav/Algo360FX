// AppContext.js - A JavaScript version without TypeScript or JSX
// This avoids the Vite React plugin preamble detection error

// Create a simple dummy AppContext
export const AppContext = {
  Provider: function(props) {
    return props.children;
  }
};

// Create a dummy AppProvider function
export function AppProvider(props) {
  return props.children;
}

// Create a dummy useApp hook
export function useApp() {
  return {
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
    clearNotifications: function() {}
  };
}
