import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from '@/components/loading/LoadingScreen';
import IntroAnimation from '@/components/intro/IntroAnimation';
import AuthLayout from '@/components/auth/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import AppLayout from '@/components/layout/AppLayout';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Trading = lazy(() => import('@/pages/trading/Trading'));
const MarketData = lazy(() => import('@/pages/market/MarketData'));
const Portfolio = lazy(() => import('@/pages/portfolio/Portfolio'));
const TradingAcademy = lazy(() => import('@/pages/academy/TradingAcademy'));
const RiskManagement = lazy(() => import('@/pages/risk/RiskManagement'));
const StrategyBuilder = lazy(() => import('@/pages/strategy/StrategyBuilder'));
const StrategyMarketplace = lazy(() => import('@/pages/marketplace/StrategyMarketplace'));
const PortfolioOptimizer = lazy(() => import('@/pages/portfolio-optimizer/PortfolioOptimizer'));
const Analytics = lazy(() => import('@/pages/analytics/Analytics'));
const News = lazy(() => import('@/pages/news/News'));
const Calendar = lazy(() => import('@/pages/calendar/Calendar'));
const Profile = lazy(() => import('@/pages/profile/Profile'));
const Settings = lazy(() => import('@/pages/settings/Settings'));
const Documentation = lazy(() => import('@/pages/docs/Documentation'));
const MoneyManager = lazy(() => import('@/pages/money-manager/MoneyManager'));
const Notifications = lazy(() => import('@/pages/notifications/Notifications'));
const AutoTrading = lazy(() => import('@/pages/auto-trading/AutoTrading'));
const AdvancedTrading = lazy(() => import('@/pages/advanced-trading/AdvancedTrading'));
const StrategyOptimization = lazy(() => import('@/pages/strategy-optimization/StrategyOptimization'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
        </Route>
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="trading" element={<Trading />} />
          <Route path="market-data" element={<MarketData />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="academy" element={<TradingAcademy />} />
          <Route path="risk" element={<RiskManagement />} />
          <Route path="strategy-builder" element={<StrategyBuilder />} />
          <Route path="marketplace" element={<StrategyMarketplace />} />
          <Route path="portfolio-optimizer" element={<PortfolioOptimizer />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="news" element={<News />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="docs" element={<Documentation />} />
          <Route path="money-manager" element={<MoneyManager />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="auto-trading" element={<AutoTrading />} />
          <Route path="advanced-trading" element={<AdvancedTrading />} />
          <Route path="strategy-optimization" element={<StrategyOptimization />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
