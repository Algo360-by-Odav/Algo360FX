import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { CircularProgress, Box } from '@mui/material';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { PageTransition } from '@components/transitions/PageTransition';
import AnalyticsDashboard from '@components/dashboard/AnalyticsDashboard';
import { NetworkStatus } from '@components/common/NetworkStatus';
import { UserRole } from '@/types/user';
import PermissionGuard from '@components/guards/PermissionGuard';

// Lazy load components
const Login = React.lazy(() => import('../pages/Login'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Trading = React.lazy(() => import('../pages/Trading'));
const MarketData = React.lazy(() => import('../pages/MarketData'));
const Portfolio = React.lazy(() => import('../pages/Portfolio'));
const Strategy = React.lazy(() => import('../pages/StrategyBuilder'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const AutoTrading = React.lazy(() => import('../pages/AutoTrading'));
const News = React.lazy(() => import('../pages/News'));
const Calendar = React.lazy(() => import('../pages/Calendar'));
const Academy = React.lazy(() => import('../pages/TradingAcademy'));
const Profile = React.lazy(() => import('../pages/Profile/UserProfile'));
const Settings = React.lazy(() => import('../pages/Settings/AccountSettings'));
const HFT = React.lazy(() => import('../pages/HFT'));
const BrokerPortal = React.lazy(() => import('../pages/BrokerPortal'));
const MoneyManager = React.lazy(() => import('../pages/MoneyManager'));
const SignalProvider = React.lazy(() => import('../pages/SignalProvider'));
const InvestorPortal = React.lazy(() => import('../pages/InvestorPortal'));
const Signup = React.lazy(() => import('../pages/Signup'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const Unauthorized = React.lazy(() => import('../pages/NotFound'));
const Welcome = React.lazy(() => import('../pages/Welcome'));
const AlgoTrading = React.lazy(() => import('../pages/AlgoTrading'));

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes: React.FC = observer(() => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NetworkStatus />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes wrapped in AnalyticsDashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AnalyticsDashboard>{<Outlet />}</AnalyticsDashboard>}>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Main routes */}
            <Route path="/dashboard" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            
            <Route path="/trading" element={
              <PageTransition>
                <Trading />
              </PageTransition>
            } />
            
            <Route path="/portfolio" element={
              <PageTransition>
                <Portfolio />
              </PageTransition>
            } />
            
            <Route path="/analytics" element={
              <PageTransition>
                <Analytics />
              </PageTransition>
            } />
            
            <Route path="/market-data" element={
              <PageTransition>
                <MarketData />
              </PageTransition>
            } />
            
            <Route path="/strategy" element={
              <PageTransition>
                <Strategy />
              </PageTransition>
            } />
            
            <Route path="/auto-trading" element={
              <PageTransition>
                <AutoTrading />
              </PageTransition>
            } />
            
            <Route path="/hft" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.BROKER, UserRole.MONEY_MANAGER]}>
                <PageTransition>
                  <HFT />
                </PageTransition>
              </PermissionGuard>
            } />
            
            <Route path="/broker-portal" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.BROKER]}>
                <PageTransition>
                  <BrokerPortal />
                </PageTransition>
              </PermissionGuard>
            } />
            
            <Route path="/money-manager" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MONEY_MANAGER]}>
                <PageTransition>
                  <MoneyManager />
                </PageTransition>
              </PermissionGuard>
            } />
            
            <Route path="/signal-provider" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.SIGNAL_PROVIDER]}>
                <PageTransition>
                  <SignalProvider />
                </PageTransition>
              </PermissionGuard>
            } />
            
            <Route path="/investor-portal" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.INVESTOR]}>
                <PageTransition>
                  <InvestorPortal />
                </PageTransition>
              </PermissionGuard>
            } />
            
            <Route path="/news" element={
              <PageTransition>
                <News />
              </PageTransition>
            } />
            
            <Route path="/calendar" element={
              <PageTransition>
                <Calendar />
              </PageTransition>
            } />
            
            <Route path="/academy" element={
              <PageTransition>
                <Academy />
              </PageTransition>
            } />
            
            <Route path="/profile" element={
              <PageTransition>
                <Profile />
              </PageTransition>
            } />
            
            <Route path="/settings" element={
              <PageTransition>
                <Settings />
              </PageTransition>
            } />
            
            <Route path="/algo-trading" element={
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MONEY_MANAGER, UserRole.SIGNAL_PROVIDER]}>
                <PageTransition>
                  <AlgoTrading />
                </PageTransition>
              </PermissionGuard>
            } />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
});

export default AppRoutes;
