import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RootStore } from './stores/RootStore';
import { RootStoreProvider } from './stores/RootStoreContext';
import { SearchProvider } from './context/SearchContext';
import AuthProvider from './providers/AuthProvider';
import ErrorBoundary from './components/error/ErrorBoundary';
import './styles/global.css';

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
        <BrowserRouter>
          <AuthProvider>
            <SearchProvider>
              <CssBaseline />
              <App />
            </SearchProvider>
          </AuthProvider>
        </BrowserRouter>
      </RootStoreProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
