import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import TradingPlatform from './pages/TradingPlatform';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import { useAuth } from './context/AuthContext';

// Import all pages
import PortfolioPage from './pages/PortfolioPage';
import StrategiesPage from './pages/StrategiesPage';
import AdvancedTradingPage from './pages/advancedTradingPageSimple.js';
import HFTPage from './pages/HFTPage';
import MT5Page from './pages/MT5Page';
import NewsPage from './pages/NewsPage';
import RiskManagementPage from './pages/RiskManagementPageSimple.js';
import { SignalProviderPage } from './pages/SignalProviderPage';
import BrokerPortalPage from './pages/BrokerPortalPage';
import { InvestorPortalPage } from './pages/InvestorPortalPage';
import AcademyPage from './pages/AcademyPage';
import ProfileSettings from './pages/ProfileSettings';
import AnalysisPage from './pages/AnalysisPage';
import NFTMarketplace from './pages/NFTMarketplace';
import AIAgent from './pages/AIAgent';
import SubscriptionPage from './pages/SubscriptionPage';
import { ComparisonPage } from './pages/ComparisonPageJs';
import MarketAnalysis from './components/analysis/MarketAnalysis';
import BackendDemo from './pages/BackendDemoJs.js';
import RealApiDemo from './pages/RealApiDemo';
import TestPage from './pages/TestPage.js';
import WalletPage from './pages/WalletPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth">
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
      <Route path="/trading-platform" element={<TradingPlatform />} />
      <Route path="/dashboard/real-api" element={<RealApiDemo />} />
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/" replace />} />
      ) : (
        <>
          <Route element={<Layout />}>
            {/* Overview */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/portfolio" element={<PortfolioPage />} />

            {/* Trading */}
            <Route path="/dashboard/trading" element={<TradingPlatform />} />
            <Route path="/dashboard/strategies" element={<StrategiesPage />} />
            <Route path="/dashboard/advanced-trading" element={<AdvancedTradingPage />} />
            <Route path="/dashboard/hft" element={<HFTPage />} />
            <Route path="/dashboard/mt5" element={<MT5Page />} />

            {/* Analysis & AI */}
            <Route path="/dashboard/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard/ai-agent" element={<AIAgent />} />
            <Route path="/dashboard/market-analysis" element={<MarketAnalysis />} />

            {/* NFT & Digital Assets */}
            <Route path="/dashboard/nft-marketplace" element={<NFTMarketplace />} />

            {/* Other Features */}
            <Route path="/dashboard/news" element={<NewsPage />} />
            <Route path="/dashboard/risk-management" element={<RiskManagementPage />} />
            <Route path="/dashboard/signal-provider" element={<SignalProviderPage />} />
            <Route path="/dashboard/broker-portal" element={<BrokerPortalPage />} />
            <Route path="/dashboard/investor-portal" element={<InvestorPortalPage />} />
            <Route path="/dashboard/academy" element={<AcademyPage />} />
            <Route path="/dashboard/settings" element={<ProfileSettings />} />
            <Route path="/dashboard/wallet" element={<WalletPage />} />
            <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
            <Route path="/dashboard/comparison" element={<ComparisonPage />} />
            <Route path="/dashboard/backend-demo" element={<BackendDemo />} />
            {/* RealApiDemo moved to public route */}
            <Route path="/dashboard/test" element={<TestPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
