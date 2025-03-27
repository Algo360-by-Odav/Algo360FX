import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  CandlestickChart as CandlestickChartIcon,
  TrendingUp as AreaChartIcon,
  AddCircleOutline as AddIndicatorIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ChartSettingsDialog from './ChartSettings';

interface ChartToolbarProps {
  onChartTypeChange: (type: 'candlestick' | 'line' | 'bar' | 'area') => void;
  onAddIndicator: (indicator: string) => void;
  onRemoveIndicator: (indicator: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  onFullscreenToggle: () => void;
  activeIndicators: string[];
}

const INDICATORS = [
  { id: 'ma', name: 'Moving Average', category: 'trend' },
  { id: 'ema', name: 'Exponential MA', category: 'trend' },
  { id: 'bb', name: 'Bollinger Bands', category: 'volatility' },
  { id: 'rsi', name: 'RSI', category: 'momentum' },
  { id: 'macd', name: 'MACD', category: 'momentum' },
  { id: 'stoch', name: 'Stochastic', category: 'momentum' },
  { id: 'atr', name: 'ATR', category: 'volatility' },
  { id: 'adx', name: 'ADX', category: 'trend' },
  { id: 'cci', name: 'CCI', category: 'momentum' },
  { id: 'obv', name: 'OBV', category: 'volume' },
  { id: 'mfi', name: 'MFI', category: 'volume' },
  { id: 'ichimoku', name: 'Ichimoku Cloud', category: 'trend' },
  { id: 'pivot', name: 'Pivot Points', category: 'support_resistance' },
  { id: 'fib', name: 'Fibonacci', category: 'support_resistance' },
];

const TIMEFRAMES = [
  { id: '1m', name: '1m' },
  { id: '5m', name: '5m' },
  { id: '15m', name: '15m' },
  { id: '30m', name: '30m' },
  { id: '1h', name: '1h' },
  { id: '4h', name: '4h' },
  { id: '1d', name: '1D' },
  { id: '1w', name: '1W' },
  { id: '1M', name: '1M' },
];

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  onChartTypeChange,
  onAddIndicator,
  onRemoveIndicator,
  onTimeframeChange,
  onFullscreenToggle,
  activeIndicators,
}) => {
  const [indicatorAnchorEl, setIndicatorAnchorEl] = useState<null | HTMLElement>(null);
  const [timeframeAnchorEl, setTimeframeAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleIndicatorClick = (event: React.MouseEvent<HTMLElement>) => {
    setIndicatorAnchorEl(event.currentTarget);
  };

  const handleIndicatorClose = () => {
    setIndicatorAnchorEl(null);
  };

  const handleTimeframeClick = (event: React.MouseEvent<HTMLElement>) => {
    setTimeframeAnchorEl(event.currentTarget);
  };

  const handleTimeframeClose = () => {
    setTimeframeAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreenToggle();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 1, 
      borderBottom: 1, 
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Candlestick">
          <IconButton onClick={() => onChartTypeChange('candlestick')}>
            <CandlestickChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Line">
          <IconButton onClick={() => onChartTypeChange('line')}>
            <LineChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bar">
          <IconButton onClick={() => onChartTypeChange('bar')}>
            <BarChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Area">
          <IconButton onClick={() => onChartTypeChange('area')}>
            <AreaChartIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Timeframe">
        <IconButton onClick={handleTimeframeClick}>
          <TimelineIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={timeframeAnchorEl}
        open={Boolean(timeframeAnchorEl)}
        onClose={handleTimeframeClose}
      >
        {TIMEFRAMES.map((timeframe) => (
          <MenuItem
            key={timeframe.id}
            onClick={() => {
              onTimeframeChange(timeframe.id);
              handleTimeframeClose();
            }}
          >
            {timeframe.name}
          </MenuItem>
        ))}
      </Menu>

      <Tooltip title="Add Indicator">
        <IconButton onClick={handleIndicatorClick}>
          <AddIndicatorIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={indicatorAnchorEl}
        open={Boolean(indicatorAnchorEl)}
        onClose={handleIndicatorClose}
      >
        {INDICATORS.map((indicator) => (
          <MenuItem
            key={indicator.id}
            onClick={() => {
              onAddIndicator(indicator.id);
              handleIndicatorClose();
            }}
            disabled={activeIndicators.includes(indicator.id)}
          >
            <ListItemText 
              primary={indicator.name}
              secondary={indicator.category}
            />
            {activeIndicators.includes(indicator.id) && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIndicator(indicator.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>

      <Tooltip title="Settings">
        <IconButton onClick={handleSettingsOpen}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{ flexGrow: 1 }} />

      <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        <IconButton onClick={handleFullscreenToggle}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>

      <ChartSettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
      />
    </Box>
  );
};

export default ChartToolbar;
