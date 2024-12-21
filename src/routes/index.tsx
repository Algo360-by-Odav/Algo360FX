import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingScreen from '@components/loading/LoadingScreen';
import IntroAnimation from '@components/intro/IntroAnimation';
import AuthLayout from '@components/auth/AuthLayout';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import ForgotPasswordForm from '@components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@components/auth/ResetPasswordForm';
import AppLayout from '@components/layout/AppLayout';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Trading = lazy(() => import('../pages/Trading'));
const MarketData = lazy(() => import('../pages/MarketData'));
const Portfolio = lazy(() => import('../pages/Portfolio'));
const TradingAcademy = lazy(() => import('../pages/TradingAcademy'));
const RiskManagement = lazy(() => import('../pages/RiskManagement'));
const StrategyBuilder = lazy(() => import('../pages/Strategy'));
const StrategyMarketplace = lazy(() => import('../pages/StrategyMarketplace'));
const PortfolioOptimizer = lazy(() => import('../pages/PortfolioOptimizer'));
const Reports = lazy(() => import('../pages/Reports'));
const Documentation = lazy(() => import('../pages/Documentation'));
const Analytics = lazy(() => import('../pages/Analytics'));
const News = lazy(() => import('../pages/News'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Notifications = lazy(() => import('../pages/Notifications'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AutoTrading = lazy(() => import('../pages/AutoTrading'));
const AdvancedTrading = lazy(() => import('../pages/AdvancedTrading'));
const StrategyOptimization = lazy(() => import('../pages/StrategyOptimization'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
};

export const routes = [
  {
    path: '/',
    element: <IntroAnimation />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordForm />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordForm />,
      },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'trading',
        element: <Trading />,
      },
      {
        path: 'market-data',
        element: <MarketData />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      {
        path: 'academy',
        element: <TradingAcademy />,
      },
      {
        path: 'risk',
        element: <RiskManagement />,
      },
      {
        path: 'strategy',
        element: <StrategyBuilder />,
      },
      {
        path: 'marketplace',
        element: <StrategyMarketplace />,
      },
      {
        path: 'portfolio-optimizer',
        element: <PortfolioOptimizer />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'docs',
        element: <Documentation />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'auto-trading',
        element: <AutoTrading />,
      },
      {
        path: 'advanced-trading',
        element: <AdvancedTrading />,
      },
      {
        path: 'strategy-optimization',
        element: <StrategyOptimization />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default AppRoutes;
