import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  ShowChart as ChartIcon,
  LocalAtm as PnLIcon
} from '@mui/icons-material';

interface PerformanceData {
  pnl: number;
  winRate: number;
  openTrades: number;
  closedTrades: number;
  totalTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

interface PerformanceMetricsProps {
  data: PerformanceData;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const theme = useTheme();

  // Get color based on value
  const getValueColor = (value: number) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  // Format currency value
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Metric cards data
  const metricCards = [
    {
      title: 'Net P&L',
      value: formatCurrency(data.pnl),
      icon: <PnLIcon />,
      color: getValueColor(data.pnl),
      tooltip: 'Total profit/loss across all trades'
    },
    {
      title: 'Win Rate',
      value: `${data.winRate}%`,
      icon: <ChartIcon />,
      color: data.winRate >= 50 ? theme.palette.success.main : theme.palette.warning.main,
      tooltip: 'Percentage of profitable trades'
    },
    {
      title: 'Open Trades',
      value: data.openTrades.toString(),
      icon: <ChartIcon />,
      color: theme.palette.info.main,
      tooltip: 'Currently active trades'
    },
    {
      title: 'Profit Factor',
      value: data.profitFactor.toFixed(2),
      icon: <ChartIcon />,
      color: data.profitFactor >= 1.5 ? theme.palette.success.main : theme.palette.warning.main,
      tooltip: 'Ratio of gross profit to gross loss'
    }
  ];

  return (
    <Box>
      {/* Main metrics cards */}
      <Grid container spacing={2} mb={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={1}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h6" sx={{ color: card.color, fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: `${card.color}20`,
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(card.icon, { sx: { color: card.color } })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional metrics */}
      <Grid container spacing={3}>
        {/* Trade Statistics */}
        <Grid item xs={12} md={6}>
          <Box p={2} bgcolor="background.paper" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom>
              Trade Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Average Win
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.success.main }}>
                    {formatCurrency(data.averageWin)}
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Largest Win
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.success.main }}>
                    {formatCurrency(data.largestWin)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Trades
                  </Typography>
                  <Typography variant="body1">
                    {data.totalTrades}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Average Loss
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.error.main }}>
                    {formatCurrency(data.averageLoss)}
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Largest Loss
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.error.main }}>
                    {formatCurrency(data.largestLoss)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Closed Trades
                  </Typography>
                  <Typography variant="body1">
                    {data.closedTrades}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Win Rate Visual */}
        <Grid item xs={12} md={6}>
          <Box p={2} bgcolor="background.paper" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom>
              Win/Loss Ratio
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Box 
                display="flex" 
                alignItems="center" 
                color={theme.palette.success.main}
                mr={1}
              >
                <ProfitIcon fontSize="small" />
                <Typography variant="body2" ml={0.5}>
                  Wins: {Math.round(data.closedTrades * data.winRate / 100)}
                </Typography>
              </Box>
              <Box 
                display="flex" 
                alignItems="center"
                color={theme.palette.error.main}
              >
                <LossIcon fontSize="small" />
                <Typography variant="body2" ml={0.5}>
                  Losses: {data.closedTrades - Math.round(data.closedTrades * data.winRate / 100)}
                </Typography>
              </Box>
            </Box>
            <Box mb={2}>
              <LinearProgress
                variant="determinate"
                value={data.winRate}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.error.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.success.main,
                  }
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={0.5}>
                <Typography variant="caption" color="text.secondary">
                  0%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  50%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  100%
                </Typography>
              </Box>
            </Box>

            <Divider />
            
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Trading Summary
              </Typography>
              <Typography variant="body2">
                {data.winRate >= 60 ? 'Excellent performance' : data.winRate >= 50 ? 'Good performance' : 'Needs improvement'}. 
                Your win rate is {data.winRate >= 50 ? 'above' : 'below'} average and your profit factor 
                is {data.profitFactor >= 1.5 ? 'strong' : 'weak'}.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceMetrics;
