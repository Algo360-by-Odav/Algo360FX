import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { RootStore } from './stores/RootStore';
import { RootStoreProvider } from './stores/RootStoreContext';
import { SearchProvider } from './context/SearchContext';
import AuthProvider from './providers/AuthProvider';
import ErrorBoundary from './components/error/ErrorBoundary';
import { initSentry } from './utils/sentry';
import './styles/global.css';

// Initialize Sentry
initSentry();

// Initialize the root store
const rootStore = new RootStore();

// For development, set a default user
if (process.env.NODE_ENV === 'development') {
  rootStore.authStore.currentUser = {
    id: '1',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    role: 'user'
  };
  rootStore.authStore.loading = false;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RootStoreProvider store={rootStore}>
        <HashRouter>
          <AuthProvider>
            <SearchProvider>
              <CssBaseline />
              <App />
            </SearchProvider>
          </AuthProvider>
        </HashRouter>
      </RootStoreProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
