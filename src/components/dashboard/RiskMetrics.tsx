import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
  Box,
  useTheme,
} from '@mui/material';
import { RiskMetrics as RiskMetricsType } from '../../types/trading';

interface RiskMetricsProps {
  metrics: RiskMetricsType;
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  const theme = useTheme();

  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatRatio = (value: number) => value.toFixed(2);

  const getProgressColor = (value: number, threshold: number) => {
    return value > threshold ? theme.palette.error.main : theme.palette.success.main;
  };

  return (
    <List>
      <ListItem>
        <ListItemText
          primary="Exposure Ratio"
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metrics.exposureRatio * 100, 100)}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressColor(metrics.exposureRatio, 0.8),
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatPercentage(metrics.exposureRatio)}
              </Typography>
            </Box>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="Current Drawdown"
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metrics.currentDrawdown * 100, 100)}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressColor(metrics.currentDrawdown, 0.1),
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatPercentage(metrics.currentDrawdown)}
              </Typography>
            </Box>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="Correlation Risk"
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metrics.correlationRisk * 100, 100)}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressColor(metrics.correlationRisk, 0.5),
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatPercentage(metrics.correlationRisk)}
              </Typography>
            </Box>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="Sharpe Ratio"
          secondary={
            <Typography variant="body2" color="text.secondary">
              {formatRatio(metrics.sharpeRatio)}
            </Typography>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="Value at Risk (VaR)"
          secondary={
            <Typography variant="body2" color="text.secondary">
              ${metrics.valueAtRisk.toFixed(2)}
            </Typography>
          }
        />
      </ListItem>
    </List>
  );
};

export default RiskMetrics;
