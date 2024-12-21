import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import AdminGuard from './guards/AdminGuard';

// Layouts
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));

// Main pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Trading = lazy(() => import('../pages/Trading'));
const MarketData = lazy(() => import('../pages/MarketData'));
const Portfolio = lazy(() => import('../pages/Portfolio'));
const StrategyBuilder = lazy(() => import('../pages/StrategyBuilder'));
const Analytics = lazy(() => import('../pages/Analytics'));
const News = lazy(() => import('../pages/News'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Documentation = lazy(() => import('../pages/Documentation'));

// Error pages
const NotFound = lazy(() => import('../pages/NotFound'));

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        ),
      },
      {
        path: 'reset-password/:token',
        element: (
          <GuestGuard>
            <ResetPassword />
          </GuestGuard>
        ),
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'app',
        children: [
          {
            path: '',
            element: <Navigate to="/app/dashboard" replace />,
          },
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
            path: 'strategy-builder',
            element: <StrategyBuilder />,
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
            path: 'docs',
            element: <Documentation />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
