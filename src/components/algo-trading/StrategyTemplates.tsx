import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  CallMade as CallMadeIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { TradingStrategy, StrategyType } from '../../types/algo-trading';
import { strategyTemplates } from '../../data/strategy-templates';
import { useAlgoTradingStore } from '../../stores/AlgoTradingStore';
import StrategyFilters from './strategy-templates/StrategyFilters';
import StrategyCard from './strategy-templates/StrategyCard';
import { StrategyFilter, StrategyTag } from '../../types/strategy-categories';

const StrategyTemplates: React.FC = () => {
  const algoTradingStore = useAlgoTradingStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<TradingStrategy> | null>(
    null
  );
  const [customization, setCustomization] = useState<{
    name: string;
    symbols: string[];
    riskManagement: {
      maxPositionSize: number;
      stopLoss: number;
      takeProfit: number;
      trailingStop?: number;
    };
  }>({
    name: '',
    symbols: [],
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1.5,
    },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<StrategyFilter>({});
  const [availableTags, setAvailableTags] = useState<StrategyTag[]>([]);

  const getStrategyIcon = (type: StrategyType) => {
    switch (type) {
      case StrategyType.TREND_FOLLOWING:
        return <TrendingUpIcon />;
      case StrategyType.MEAN_REVERSION:
        return <ShowChartIcon />;
      case StrategyType.BREAKOUT:
        return <CallMadeIcon />;
      case StrategyType.MOMENTUM:
        return <SpeedIcon />;
      default:
        return <ShowChartIcon />;
    }
  };

  const handleTemplateSelect = (template: Partial<TradingStrategy>) => {
    setSelectedTemplate(template);
    setCustomization({
      name: `${template.name} Strategy`,
      symbols: [],
      riskManagement: template.riskManagement || {
        maxPositionSize: 1000,
        stopLoss: 2,
        takeProfit: 4,
      },
    });
    setDialogOpen(true);
  };

  const handleSymbolAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const symbol = (event.target as HTMLInputElement).value.toUpperCase();
      if (symbol && !customization.symbols.includes(symbol)) {
        setCustomization({
          ...customization,
          symbols: [...customization.symbols, symbol],
        });
        (event.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleSymbolRemove = (symbolToRemove: string) => {
    setCustomization({
      ...customization,
      symbols: customization.symbols.filter((symbol) => symbol !== symbolToRemove),
    });
  };

  const handleCreateStrategy = async () => {
    if (!selectedTemplate) return;

    try {
      const strategy: TradingStrategy = {
        ...selectedTemplate,
        ...customization,
        id: '', // Will be assigned by the backend
        status: 'STOPPED',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TradingStrategy;

      await algoTradingStore.createStrategy(strategy);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to create strategy:', error);
    }
  };

  const handleFilterChange = (newFilters: StrategyFilter) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ p: 3 }}>
      <StrategyFilters
        onFilterChange={handleFilterChange}
        availableTags={availableTags}
      />
      <Grid container spacing={3}>
        {strategyTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.name}>
            <StrategyCard
              strategy={template}
              metadata={template.metadata}
              onSelect={() => handleTemplateSelect(template)}
              onViewBacktest={() => {}}
              onClone={() => {}}
              onShare={() => {}}
              onToggleFavorite={() => {}}
            />
          </Grid>
        ))}
      </Grid>

      {/* Customization Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1F2937',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Customize Strategy Template
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Strategy Name"
                value={customization.name}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    name: e.target.value,
                  })
                }
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Symbol"
                placeholder="Press Enter to add"
                onKeyPress={handleSymbolAdd}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {customization.symbols.map((symbol) => (
                  <Chip
                    key={symbol}
                    label={symbol}
                    onDelete={() => handleSymbolRemove(symbol)}
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Position Size"
                type="number"
                value={customization.riskManagement.maxPositionSize}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    riskManagement: {
                      ...customization.riskManagement,
                      maxPositionSize: parseFloat(e.target.value),
                    },
                  })
                }
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stop Loss (%)"
                type="number"
                value={customization.riskManagement.stopLoss}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    riskManagement: {
                      ...customization.riskManagement,
                      stopLoss: parseFloat(e.target.value),
                    },
                  })
                }
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Take Profit (%)"
                type="number"
                value={customization.riskManagement.takeProfit}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    riskManagement: {
                      ...customization.riskManagement,
                      takeProfit: parseFloat(e.target.value),
                    },
                  })
                }
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trailing Stop (%)"
                type="number"
                value={customization.riskManagement.trailingStop}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    riskManagement: {
                      ...customization.riskManagement,
                      trailingStop: parseFloat(e.target.value),
                    },
                  })
                }
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStrategy}
            variant="contained"
            sx={{
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Create Strategy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StrategyTemplates;
