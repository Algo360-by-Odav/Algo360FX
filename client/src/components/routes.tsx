import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaceholderPage from './placeholder/PlaceholderPage';
import Portfolio from './portfolio/Portfolio';
import StrategyBuilder from './strategy/StrategyBuilder';
import MarketAnalysis from './analysis/MarketAnalysis';
import TradingChart from './trading/TradingChartPage';
import Positions from './trading/PositionsPage';
import Orders from './trading/OrdersPage';
import History from './trading/HistoryPage';
import AutoTrading from './trading/AutoTradingPage';
import HFTTrading from './hft/HFTPage';
import AIAgent from './ai/AIAgent';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import VerifyEmail from './auth/VerifyEmail';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import AccountSettings from './account/AccountTab';
import PortfolioOverview from './investor-portal/PortfolioOverview';
import InvestmentAnalytics from './investor-portal/InvestmentAnalytics';
import InvestmentOpportunities from './investor-portal/InvestmentOpportunities';
import InvestorSettings from './investor-portal/InvestorSettings';
import ClientManagement from './broker/ClientManagement';
import Compliance from './broker/Compliance';
import TradingActivity from './broker/TradingActivity';
import EconomicCalendar from './analysis/EconomicCalendar';
import PatternRecognition from './analysis/PatternRecognition';
import MLPredictions from './analysis/MLPredictions';
import PerformanceAnalysis from './analysis/PerformanceAnalysis';
import { default as AcademyPage } from '../pages/AcademyPage';

// Export existing components
export {
  Portfolio,
  StrategyBuilder,
  TradingChart,
  Positions,
  Orders,
  History,
  AutoTrading,
  HFTTrading,
  AIAgent,
  Login,
  SignUp,
  VerifyEmail,
  ForgotPasswordForm as ForgotPassword,
  AccountSettings,
  PortfolioOverview,
  InvestmentAnalytics,
  InvestmentOpportunities,
  InvestorSettings,
  ClientManagement,
  Compliance,
  TradingActivity,
  EconomicCalendar,
  PatternRecognition,
  MLPredictions,
  PerformanceAnalysis,
  AcademyPage,
};

export { default as PortfolioPage } from '../pages/PortfolioPage';
export { default as AnalysisPage } from '../pages/AnalysisPage';

// Placeholder component for pages under development
const PlaceholderPageComponent: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    <Typography variant="body1">{description}</Typography>
  </Box>
);

export const Analytics = () => (
  <PlaceholderPageComponent 
    title="Analytics" 
    description="View detailed analytics of your trading performance"
  />
);

export const News = () => (
  <PlaceholderPageComponent 
    title="News" 
    description="Latest market news and updates"
  />
);

export const Calendar = () => (
  <PlaceholderPageComponent 
    title="Economic Calendar" 
    description="Economic events and market calendar"
  />
);

export const NFT = () => (
  <PlaceholderPageComponent 
    title="NFT Trading" 
    description="Trade and manage NFT assets"
  />
);

export const AdvancedTrading = () => (
  <PlaceholderPageComponent 
    title="Advanced Trading" 
    description="Professional trading tools and features"
  />
);

export const PortfolioOptimizer = () => (
  <PlaceholderPageComponent 
    title="Portfolio Optimizer" 
    description="Optimize your portfolio allocation"
  />
);

export const Backtesting = () => (
  <PlaceholderPageComponent 
    title="Backtesting" 
    description="Test your strategies against historical data"
  />
);

export const RiskManagement = () => (
  <PlaceholderPageComponent 
    title="Risk Management" 
    description="Advanced risk management tools"
  />
);

export const BrokerPortal = () => (
  <PlaceholderPageComponent 
    title="Broker Portal" 
    description="Manage broker integrations and settings"
  />
);

export const BrokerRisk = () => (
  <PlaceholderPageComponent 
    title="Broker Risk Management" 
    description="Manage broker risk settings and limits"
  />
);

export const InvestorPortal = () => (
  <PlaceholderPageComponent 
    title="Investor Portal" 
    description="Investor relationship management"
  />
);

export const EconomicAnalysis = () => (
  <PlaceholderPageComponent 
    title="Economic Analysis" 
    description="Analyze economic indicators and trends"
  />
);

export const ApiDocs = () => (
  <PlaceholderPageComponent 
    title="API Documentation" 
    description="Technical documentation for API integration"
  />
);

export const UserGuide = () => (
  <PlaceholderPageComponent 
    title="User Guide" 
    description="Comprehensive guide to using the platform"
  />
);
