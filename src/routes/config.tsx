import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '@/types/user';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Guards
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import PermissionGuard from './guards/PermissionGuard';

// Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import Dashboard from '@/pages/dashboard/Dashboard';
import Trading from '@/pages/trading/Trading';
import MarketData from '@/pages/market/MarketData';
import Portfolio from '@/pages/portfolio/Portfolio';
import StrategyBuilder from '@/pages/strategy/StrategyBuilder';
import Analytics from '@/pages/analytics/Analytics';
import News from '@/pages/news/News';
import Calendar from '@/pages/calendar/Calendar';
import Profile from '@/pages/profile/Profile';
import Settings from '@/pages/settings/Settings';
import Documentation from '@/pages/docs/Documentation';
import MoneyManager from '@/pages/money-manager/MoneyManager';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: 'auth',
    element: <GuestGuard><AuthLayout /></GuestGuard>,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: 'verify-email/:token?',
        element: <VerifyEmail />,
      },
      {
        path: '',
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
  {
    path: '',
    element: (
      <AuthGuard>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'trading',
        element: (
          <PermissionGuard requiredPermissions={['trading:access']}>
            <Trading />
          </PermissionGuard>
        ),
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
        path: 'strategy-builder',
        element: (
          <PermissionGuard requiredPermissions={['strategy:create']}>
            <StrategyBuilder />
          </PermissionGuard>
        ),
      },
      {
        path: 'analytics',
        element: (
          <PermissionGuard requiredPermissions={['analytics:view']}>
            <Analytics />
          </PermissionGuard>
        ),
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
        path: 'docs',
        element: <Documentation />,
      },
      {
        path: 'money-manager',
        element: (
          <PermissionGuard 
            requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]} 
            requiredPermissions={['money-manager:access']}
          >
            <MoneyManager />
          </PermissionGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
