// @ts-nocheck
// This is a minimal version of PortfolioAnalytics.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import PortfolioAnalytics from './portfolioAnalyticsJs.js';

// Re-export the component
export default PortfolioAnalytics;

// Re-export the interfaces for type checking
export interface PortfolioAnalyticsProps {
  open: boolean;
  onClose: () => void;
  portfolioData: any; // Replace with proper type
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
