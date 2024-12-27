import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import LoadingScreen from '@components/loading/LoadingScreen';
import IntroAnimation from '@components/intro/IntroAnimation';
import AuthLayout from '@components/auth/AuthLayout';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import ForgotPasswordForm from '@components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@components/auth/ResetPasswordForm';
import MainLayout from '@/layouts/MainLayout';
import { RootStoreProvider } from '@/stores/RootStoreContext';
import TradingAssistant from '@components/AI/TradingAssistant';

// Lazy load components
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const TradingPage = React.lazy(() => import('@pages/TradingPage'));
const Trading = React.lazy(() => import('@pages/Trading'));
const MarketData = React.lazy(() => import('@pages/MarketData'));
const Portfolio = React.lazy(() => import('@pages/Portfolio'));
const MoneyManager = React.lazy(() => import('@pages/MoneyManager'));
const TradingAcademy = React.lazy(() => import('@pages/TradingAcademy'));
const RiskManagement = React.lazy(() => import('@pages/RiskManagement'));
const StrategyBuilder = React.lazy(() => import('@pages/StrategyBuilder'));
const Marketplace = React.lazy(() => import('@pages/Marketplace'));
const Analytics = React.lazy(() => import('@pages/Analytics'));
const Profile = React.lazy(() => import('@pages/Profile'));
const Settings = React.lazy(() => import('@pages/Settings'));
const Notifications = React.lazy(() => import('@pages/Notifications'));
const NotFound = React.lazy(() => import('@pages/NotFound'));
const AutoTrading = React.lazy(() => import('@pages/AutoTrading'));
const AdvancedTrading = React.lazy(() => import('@pages/AdvancedTrading'));
const PortfolioOptimizer = React.lazy(() => import('@pages/PortfolioOptimizer'));
const Backtesting = React.lazy(() => import('@pages/Backtesting'));
const HFT = React.lazy(() => import('@pages/HFT'));
const BrokerPortal = React.lazy(() => import('@pages/BrokerPortal'));
const MoneyManagerPortal = React.lazy(() => import('@pages/MoneyManagerPortal'));
const SignalProviderPortal = React.lazy(() => import('@pages/SignalProviderPortal'));
const InvestorPortal = React.lazy(() => import('@pages/InvestorPortal'));
const News = React.lazy(() => import('@pages/News'));
const Calendar = React.lazy(() => import('@pages/Calendar'));

function App() {
  return (
    <RootStoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<IntroAnimation />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="forgot-password" element={<ForgotPasswordForm />} />
              <Route path="reset-password/:token" element={<ResetPasswordForm />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="trading" element={<TradingPage />} />
                <Route path="market-data" element={<MarketData />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="money-manager" element={<MoneyManager />} />
                <Route path="risk-management" element={<RiskManagement />} />
                <Route path="strategy-builder" element={<StrategyBuilder />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="academy" element={<TradingAcademy />} />
                <Route path="news" element={<News />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="hft" element={<HFT />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="auto-trading" element={<AutoTrading />} />
                <Route path="advanced-trading" element={<AdvancedTrading />} />
                <Route path="portfolio-optimizer" element={<PortfolioOptimizer />} />
                <Route path="backtesting" element={<Backtesting />} />
                <Route path="broker-portal" element={<BrokerPortal />} />
                <Route path="money-manager-portal" element={<MoneyManagerPortal />} />
                <Route path="signal-provider-portal" element={<SignalProviderPortal />} />
                <Route path="investor-portal" element={<InvestorPortal />} />
              </Route>
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
        <TradingAssistant />
      </ThemeProvider>
    </RootStoreProvider>
  );
}

export default App;
