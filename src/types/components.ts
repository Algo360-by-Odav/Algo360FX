import { ReactNode } from 'react';
import { Theme } from '@mui/material/styles';
import { Trade, Position, Strategy, BacktestResult } from './trading';
import { RiskMetrics, RiskProfile } from './risk';
import { ModelConfig, ModelMetrics } from './ml';
import { Message } from './chat';
import { RootStore } from '../stores/RootStore';

export interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'candlestick' | 'area';
  height?: number;
  width?: number;
  options?: any;
  theme?: Theme;
  onZoom?: (start: Date, end: Date) => void;
  onClick?: (point: any) => void;
}

export interface DataGridProps {
  data: any[];
  columns: {
    field: string;
    headerName: string;
    width?: number;
    type?: string;
    editable?: boolean;
    valueGetter?: (params: any) => any;
    renderCell?: (params: any) => ReactNode;
  }[];
  loading?: boolean;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (params: any) => void;
  onSelectionChange?: (selection: any[]) => void;
}

export interface TradeTableProps {
  trades: Trade[];
  loading?: boolean;
  onTradeClick?: (trade: Trade) => void;
  onTradeClose?: (trade: Trade) => void;
}

export interface PositionTableProps {
  positions: Position[];
  loading?: boolean;
  onPositionClick?: (position: Position) => void;
  onPositionClose?: (position: Position) => void;
}

export interface StrategyCardProps {
  strategy: Strategy;
  onEdit?: (strategy: Strategy) => void;
  onDelete?: (strategy: Strategy) => void;
  onStart?: (strategy: Strategy) => void;
  onStop?: (strategy: Strategy) => void;
}

export interface BacktestResultsProps {
  results: BacktestResult;
  onParameterChange?: (param: string, value: any) => void;
  onTimeframeChange?: (timeframe: string) => void;
}

export interface RiskMetricsProps {
  metrics: RiskMetrics;
  profile: RiskProfile;
  onProfileChange?: (profile: RiskProfile) => void;
}

export interface ModelConfigFormProps {
  config: ModelConfig;
  onChange: (config: ModelConfig) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export interface ModelMetricsProps {
  metrics: ModelMetrics;
  loading?: boolean;
}

export interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface ToolbarProps {
  title?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  error?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: any }[];
}

export interface MainLayoutProps {
  children: ReactNode;
}

export interface StoreProviderProps {
  children: ReactNode;
  store?: RootStore;
}

export interface OptimizationParameter {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export interface RebalanceTarget {
  symbol: string;
  targetAllocation: number;
  currentAllocation?: number;
}

export interface StrategyMetrics {
  [key: string]: number;
}

export interface BacktestConfig {
  initialBalance: number;
  startDate: string;
  endDate: string;
  symbol: string;
  timeframe: string;
  strategy: any;
  parameters: Record<string, any>;
  commission: number;
  slippage: number;
  useSpread: boolean;
}
