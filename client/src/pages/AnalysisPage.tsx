// @ts-nocheck
// This is a minimal version of AnalysisPage.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import AnalysisPage from './analysisPageJs.js';

// Re-export the component
export default AnalysisPage;

// Re-export the interfaces for type checking
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
