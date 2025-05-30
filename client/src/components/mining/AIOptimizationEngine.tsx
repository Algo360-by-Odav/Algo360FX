import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import { 
  TrendingUp, 
  Psychology,
  BarChart,
  Timeline,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { miningStore } from '../../stores/miningStore';

const AIOptimizationEngine: React.FC = observer(() => {
  const handleRefreshAnalysis = () => {
    miningStore.fetchMarketPredictions();
  };

  const predictions = miningStore.marketPredictions;
  const isAnalyzing = miningStore.isLoading;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AI Optimization Engine
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">
              Market Analysis
            </Typography>
            <Button
              variant="outlined"
              onClick={handleRefreshAnalysis}
              startIcon={<Psychology />}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </Box>

          {isAnalyzing ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : predictions ? (
            <List>
              <ListItem>
                <ListItemText
                  primary="BTC Price Prediction (24h)"
                  secondary={
                    <Box>
                      Current: ${predictions.btcPrice.current.toLocaleString()}
                      <br />
                      Predicted: ${predictions.btcPrice.predicted.toLocaleString()}
                      <Chip
                        icon={<TrendingUp />}
                        label={`${((predictions.btcPrice.predicted - predictions.btcPrice.current) / predictions.btcPrice.current * 100).toFixed(2)}%`}
                        color="success"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Most Profitable Coins"
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {predictions.optimalCoins.map((coin, index) => (
                        <Chip
                          key={coin}
                          label={coin}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="AI Confidence Score"
                  secondary={
                    <Box display="flex" alignItems="center">
                      <CircularProgress
                        variant="determinate"
                        value={predictions.confidence}
                        size={24}
                        sx={{ mr: 1 }}
                      />
                      {predictions.confidence}%
                    </Box>
                  }
                />
              </ListItem>
            </List>
          ) : (
            <Alert severity="info">Loading market predictions...</Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Optimization Recommendations
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Based on current market conditions and mining difficulty
          </Alert>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Suggested Algorithm Switch"
                secondary="ETHash → KawPow (Higher profitability expected)"
              />
              <Chip icon={<BarChart />} label="High Impact" color="success" size="small" />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Power Optimization"
                secondary="Reduce power limit to 80% (Better efficiency)"
              />
              <Chip icon={<Timeline />} label="Medium Impact" color="primary" size="small" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
});

export default AIOptimizationEngine;
