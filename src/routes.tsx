import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import IntroAnimation from './components/intro/IntroAnimation';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import AuthLayout from './components/auth/AuthLayout';
import { observer } from 'mobx-react-lite';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import MarketData from './pages/MarketData';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';
import AutoTrading from './pages/AutoTrading';
import News from './pages/News';
import Calendar from './pages/Calendar';
import HFT from './pages/HFT';
import TradingAcademy from './pages/TradingAcademy';
import RiskManagement from './pages/RiskManagement';
import MoneyManager from './pages/MoneyManager';
import AdvancedTrading from './pages/AdvancedTrading';
import PortfolioOptimizer from './pages/PortfolioOptimizer';
import StrategyBuilder from './pages/StrategyBuilder';

const AppRoutes: React.FC = observer(() => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="reset-password/:token" element={<ResetPasswordForm />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="trading" element={<Trading />} />
            <Route path="market-data" element={<MarketData />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="auto-trading" element={<AutoTrading />} />
            <Route path="news" element={<News />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="hft" element={<HFT />} />
            <Route path="academy" element={<TradingAcademy />} />
            <Route path="risk-management" element={<RiskManagement />} />
            <Route path="money-manager" element={<MoneyManager />} />
            <Route path="advanced-trading" element={<AdvancedTrading />} />
            <Route path="portfolio-optimizer" element={<PortfolioOptimizer />} />
            <Route path="strategy-builder" element={<StrategyBuilder />} />
          </Route>
        </Route>
      </Route>

      {/* Other Routes */}
      <Route path="/intro" element={<IntroAnimation />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
});

export default AppRoutes;
