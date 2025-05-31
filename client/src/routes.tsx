import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import TradingPlatform from './pages/TradingPlatform';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import { useAuth } from './context/AuthContext';

// Debug wrapper to help troubleshoot routing issues
const RouteDebugWrapper = ({ component: Component, name }) => {
  console.log(`Rendering route: ${name}`);
  return <Component />;
};

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
import TradingAgentPage from './pages/TradingAgentPage';
import TestTradingAgent from './pages/TestTradingAgent';
import SimpleAgent from './pages/SimpleAgent';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  console.log(`Current route: ${location.pathname}`);
  console.log(`Auth status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

  // IMPORTANT: Force authentication to always be true
  const forceAuth = true;
  
  // Create a wrapper around TradingAgentPage to debug
  const DebugTradingAgent = () => {
    console.log("Rendering TradingAgentPage directly");
    return <SimpleAgent />;
  };

  return (
    <Routes>
      {/* TOP PRIORITY ROUTES - These will be matched first */}
      <Route path="/dashboard/trading-agent" element={<DebugTradingAgent />} />
      <Route path="/dashboard/test-agent" element={<TestTradingAgent />} />
      
      {/* STANDARD ROUTES */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth">
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
      <Route path="/trading-platform" element={<TradingPlatform />} />
      <Route path="/dashboard/real-api" element={<RealApiDemo />} />
      
      {/* DASHBOARD ROUTES WITH LAYOUT */}
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
          {/* Trading Agent moved to public routes above */}

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
          <Route path="/dashboard/test-agent" element={<TestTradingAgent />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
