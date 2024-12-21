import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { theme } from '@theme/theme';
import LoadingScreen from '@components/loading/LoadingScreen';
import IntroAnimation from '@components/intro/IntroAnimation';
import AuthLayout from '@components/auth/AuthLayout';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import ForgotPasswordForm from '@components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@components/auth/ResetPasswordForm';
import MainLayout from '@/layouts/MainLayout';
import { RootStore } from '@stores/RootStore';
import { RootStoreProvider } from '@stores/RootStoreContext';

// Lazy load components
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Trading = lazy(() => import('@pages/Trading'));
const MarketData = lazy(() => import('@pages/MarketData'));
const Portfolio = lazy(() => import('@pages/Portfolio'));
const TradingAcademy = lazy(() => import('@pages/TradingAcademy'));
const RiskManagement = lazy(() => import('@pages/RiskManagement'));
const StrategyBuilder = lazy(() => import('@pages/StrategyBuilder'));
const Marketplace = lazy(() => import('@pages/Marketplace'));
const Analytics = lazy(() => import('@pages/Analytics'));
const Profile = lazy(() => import('@pages/Profile'));
const Settings = lazy(() => import('@pages/Settings'));
const Notifications = lazy(() => import('@pages/Notifications'));
const NotFound = lazy(() => import('@pages/NotFound'));
const AutoTrading = lazy(() => import('@pages/AutoTrading'));
const AdvancedTrading = lazy(() => import('@pages/AdvancedTrading'));
const PortfolioOptimizer = lazy(() => import('@pages/PortfolioOptimizer'));
const Backtesting = lazy(() => import('@pages/Backtesting'));
const HFT = lazy(() => import('@pages/HFT'));
const BrokerPortal = lazy(() => import('@pages/BrokerPortal'));
const MoneyManagerPortal = lazy(() => import('@pages/MoneyManagerPortal'));
const SignalProviderPortal = lazy(() => import('@pages/SignalProviderPortal'));
const InvestorPortal = lazy(() => import('@pages/InvestorPortal'));

function App() {
  // Initialize the root store at the app level
  const rootStore = React.useMemo(() => {
    const store = RootStore.getInstance();
    // Ensure stores are initialized
    if (process.env.NODE_ENV === 'development') {
      store.initializeDefaultData();
    }
    return store;
  }, []);

  return (
    <RootStoreProvider store={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="/intro" element={<IntroAnimation />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="forgot-password" element={<ForgotPasswordForm />} />
            <Route path="reset-password/:token" element={<ResetPasswordForm />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            
            {/* Basic Features */}
            <Route path="dashboard" element={
              <Suspense fallback={<LoadingScreen />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="trading" element={
              <Suspense fallback={<LoadingScreen />}>
                <Trading />
              </Suspense>
            } />
            <Route path="market-data" element={
              <Suspense fallback={<LoadingScreen />}>
                <MarketData />
              </Suspense>
            } />
            <Route path="portfolio" element={
              <Suspense fallback={<LoadingScreen />}>
                <Portfolio />
              </Suspense>
            } />
            <Route path="strategy" element={
              <Suspense fallback={<LoadingScreen />}>
                <StrategyBuilder />
              </Suspense>
            } />
            <Route path="marketplace" element={
              <Suspense fallback={<LoadingScreen />}>
                <Marketplace />
              </Suspense>
            } />
            <Route path="academy" element={
              <Suspense fallback={<LoadingScreen />}>
                <TradingAcademy />
              </Suspense>
            } />
            <Route path="trading-academy" element={
              <Suspense fallback={<LoadingScreen />}>
                <TradingAcademy />
              </Suspense>
            } />
            <Route path="risk-management" element={
              <Suspense fallback={<LoadingScreen />}>
                <RiskManagement />
              </Suspense>
            } />
            <Route path="analytics" element={
              <Suspense fallback={<LoadingScreen />}>
                <Analytics />
              </Suspense>
            } />
            
            {/* User Related */}
            <Route path="profile" element={
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<LoadingScreen />}>
                <Settings />
              </Suspense>
            } />
            <Route path="notifications" element={
              <Suspense fallback={<LoadingScreen />}>
                <Notifications />
              </Suspense>
            } />
            
            {/* Advanced Features */}
            <Route path="auto-trading" element={
              <Suspense fallback={<LoadingScreen />}>
                <AutoTrading />
              </Suspense>
            } />
            <Route path="advanced-trading" element={
              <Suspense fallback={<LoadingScreen />}>
                <AdvancedTrading />
              </Suspense>
            } />
            <Route path="portfolio-optimizer" element={
              <Suspense fallback={<LoadingScreen />}>
                <PortfolioOptimizer />
              </Suspense>
            } />
            <Route path="backtesting" element={
              <Suspense fallback={<LoadingScreen />}>
                <Backtesting />
              </Suspense>
            } />
            <Route path="hft" element={
              <Suspense fallback={<LoadingScreen />}>
                <HFT />
              </Suspense>
            } />
            
            {/* Portals */}
            <Route path="broker-portal" element={
              <Suspense fallback={<LoadingScreen />}>
                <BrokerPortal />
              </Suspense>
            } />
            <Route path="money-manager-portal" element={
              <Suspense fallback={<LoadingScreen />}>
                <MoneyManagerPortal />
              </Suspense>
            } />
            <Route path="signal-provider-portal" element={
              <Suspense fallback={<LoadingScreen />}>
                <SignalProviderPortal />
              </Suspense>
            } />
            <Route path="investor-portal" element={
              <Suspense fallback={<LoadingScreen />}>
                <InvestorPortal />
              </Suspense>
            } />

            {/* Catch all route */}
            <Route path="*" element={
              <Suspense fallback={<LoadingScreen />}>
                <NotFound />
              </Suspense>
            } />
          </Route>

          {/* Redirect root to app */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          
          {/* Convenience redirects */}
          <Route path="/risk" element={<Navigate to="/app/risk-management" replace />} />
          <Route path="/app/risk" element={<Navigate to="/app/risk-management" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={
            <Suspense fallback={<LoadingScreen />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </ThemeProvider>
    </RootStoreProvider>
  );
}

export default App;
