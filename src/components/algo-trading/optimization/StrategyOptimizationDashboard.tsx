import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../hooks/useRootStore';
import {
  OptimizationConfig,
  TradingStrategyNew,
} from '../../../types/optimization';
import StrategyOptimizationForm from './StrategyOptimizationForm';
import OptimizationResults from './OptimizationResults';

const StrategyOptimizationDashboard: React.FC = observer(() => {
  const { optimizationStore } = useRootStore();
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategyNew | null>(null);

  const handleStrategySelect = (strategy: TradingStrategyNew) => {
    setSelectedStrategy(strategy);
  };

  const handleOptimize = async (config: OptimizationConfig) => {
    if (!selectedStrategy) return;
    await optimizationStore.startOptimization(selectedStrategy.id, config);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Strategy Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Strategy Selection
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Strategy</InputLabel>
              <Select
                value={selectedStrategy?.id || ''}
                onChange={(e) => {
                  const strategy = optimizationStore.strategies.find(
                    (s) => s.id === e.target.value
                  );
                  if (strategy) handleStrategySelect(strategy);
                }}
              >
                {optimizationStore.strategies.map((strategy) => (
                  <MenuItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Error Message */}
        {optimizationStore.error && (
          <Grid item xs={12}>
            <Alert severity="error">{optimizationStore.error}</Alert>
          </Grid>
        )}

        {/* Progress Bar */}
        {optimizationStore.isOptimizing && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Optimization Progress
              </Typography>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={optimizationStore.optimizationProgress}
                />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  {Math.round(optimizationStore.optimizationProgress)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Optimization Form */}
        {selectedStrategy && (
          <Grid item xs={12}>
            <StrategyOptimizationForm
              onSubmit={handleOptimize}
              isLoading={optimizationStore.isOptimizing}
            />
          </Grid>
        )}

        {/* Results */}
        {selectedStrategy?.results && !optimizationStore.isOptimizing && (
          <Grid item xs={12}>
            <OptimizationResults results={selectedStrategy.results} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
});

export default StrategyOptimizationDashboard;
