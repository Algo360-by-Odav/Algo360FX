// appContextJs.js - A JavaScript version of AppContext without JSX or TypeScript
// This avoids the Vite React plugin preamble detection error

// Create a simple dummy AppContext
export const AppContext = {
  Provider: (props) => props.children
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
    setLoading: () => {},
    setLoadingMessage: () => {},
    setConnected: () => {},
    addNotification: () => {},
    removeNotification: () => {},
    setError: () => {},
    clearError: () => {},
    setTheme: () => {},
    setLanguage: () => {},
    toggleSidebar: () => {},
    setChartLayout: () => {},
    clearNotifications: () => {}
  };
}

// Export as default for compatibility
export default {
  AppContext,
  AppProvider,
  useApp
};
