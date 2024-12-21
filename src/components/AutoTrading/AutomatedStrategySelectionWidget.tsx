import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Strategy {
  id: string;
  name: string;
  type: string;
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  marketConditions: {
    volatility: 'low' | 'medium' | 'high';
    trend: 'ranging' | 'trending';
    volume: 'low' | 'medium' | 'high';
  };
  riskProfile: {
    risk: 'low' | 'medium' | 'high';
    timeframe: string;
    complexity: 'low' | 'medium' | 'high';
  };
  score: number;
}

interface UserPreferences {
  riskTolerance: number;
  investmentHorizon: string;
  tradingStyle: string;
  maxDrawdown: number;
  preferredPairs: string[];
}

const AutomatedStrategySelectionWidget: React.FC = observer(() => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    riskTolerance: 50,
    investmentHorizon: 'medium',
    tradingStyle: 'balanced',
    maxDrawdown: 20,
    preferredPairs: ['EURUSD', 'GBPUSD'],
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Conservative Trend Follower',
      type: 'Trend Following',
      performance: {
        winRate: 65.4,
        profitFactor: 1.8,
        sharpeRatio: 1.5,
        maxDrawdown: 12.3,
      },
      marketConditions: {
        volatility: 'low',
        trend: 'trending',
        volume: 'medium',
      },
      riskProfile: {
        risk: 'low',
        timeframe: 'H4',
        complexity: 'low',
      },
      score: 85,
    },
    {
      id: '2',
      name: 'Aggressive Scalper',
      type: 'Scalping',
      performance: {
        winRate: 58.2,
        profitFactor: 1.5,
        sharpeRatio: 1.2,
        maxDrawdown: 18.7,
      },
      marketConditions: {
        volatility: 'high',
        trend: 'ranging',
        volume: 'high',
      },
      riskProfile: {
        risk: 'high',
        timeframe: 'M5',
        complexity: 'high',
      },
      score: 72,
    },
    {
      id: '3',
      name: 'Balanced Mean Reversion',
      type: 'Mean Reversion',
      performance: {
        winRate: 72.1,
        profitFactor: 2.1,
        sharpeRatio: 1.8,
        maxDrawdown: 15.4,
      },
      marketConditions: {
        volatility: 'medium',
        trend: 'ranging',
        volume: 'medium',
      },
      riskProfile: {
        risk: 'medium',
        timeframe: 'H1',
        complexity: 'medium',
      },
      score: 78,
    },
  ];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter and score strategies based on preferences
    const matchedStrategies = strategies
      .filter(strategy => {
        const riskMatch = getRiskLevel(preferences.riskTolerance) === strategy.riskProfile.risk;
        const drawdownMatch = strategy.performance.maxDrawdown <= preferences.maxDrawdown;
        return riskMatch && drawdownMatch;
      })
      .sort((a, b) => b.score - a.score);

    setSelectedStrategies(matchedStrategies);
    setAnalyzing(false);
  };

  const getRiskLevel = (tolerance: number): 'low' | 'medium' | 'high' => {
    if (tolerance <= 33) return 'low';
    if (tolerance <= 66) return 'medium';
    return 'high';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getMetricColor = (value: number, metric: string) => {
    switch (metric) {
      case 'winRate':
        return value > 60 ? 'success' : value > 50 ? 'warning' : 'error';
      case 'profitFactor':
        return value > 1.5 ? 'success' : value > 1.2 ? 'warning' : 'error';
      case 'sharpeRatio':
        return value > 1.5 ? 'success' : value > 1 ? 'warning' : 'error';
      case 'maxDrawdown':
        return value < 15 ? 'success' : value < 20 ? 'warning' : 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">AI Strategy Selection</Typography>
          <Box>
            <Button
              startIcon={<PsychologyIcon />}
              onClick={() => setPreferencesDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Set Preferences
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Find Optimal Strategies'}
            </Button>
          </Box>
        </Box>

        {/* Current Preferences Summary */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Your Trading Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                Risk Tolerance
              </Typography>
              <Typography variant="body1">
                {getRiskLevel(preferences.riskTolerance).toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                Investment Horizon
              </Typography>
              <Typography variant="body1">
                {preferences.investmentHorizon.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                Trading Style
              </Typography>
              <Typography variant="body1">
                {preferences.tradingStyle.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                Max Drawdown
              </Typography>
              <Typography variant="body1">
                {preferences.maxDrawdown}%
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {analyzing && (
          <Box mb={3}>
            <Typography variant="body2" gutterBottom>
              Analyzing market conditions and matching strategies...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Recommended Strategies */}
        {selectedStrategies.length > 0 && (
          <List>
            {selectedStrategies.map((strategy) => (
              <ListItem
                key={strategy.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  <AutoAwesomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">
                        {strategy.name}
                      </Typography>
                      <Chip
                        label={`Score: ${strategy.score}`}
                        color={getScoreColor(strategy.score)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Performance Metrics
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip
                            label={`Win: ${strategy.performance.winRate}%`}
                            size="small"
                            color={getMetricColor(strategy.performance.winRate, 'winRate')}
                          />
                          <Chip
                            label={`PF: ${strategy.performance.profitFactor}`}
                            size="small"
                            color={getMetricColor(strategy.performance.profitFactor, 'profitFactor')}
                          />
                          <Chip
                            label={`DD: ${strategy.performance.maxDrawdown}%`}
                            size="small"
                            color={getMetricColor(strategy.performance.maxDrawdown, 'maxDrawdown')}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Market Conditions
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip
                            label={`Vol: ${strategy.marketConditions.volatility}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`Trend: ${strategy.marketConditions.trend}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Risk Profile
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip
                            label={`Risk: ${strategy.riskProfile.risk}`}
                            size="small"
                            color={strategy.riskProfile.risk === 'high' ? 'error' : 'success'}
                          />
                          <Chip
                            label={strategy.riskProfile.timeframe}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Preferences Dialog */}
        <Dialog
          open={preferencesDialogOpen}
          onClose={() => setPreferencesDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Trading Preferences</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography gutterBottom>Risk Tolerance</Typography>
                <Slider
                  value={preferences.riskTolerance}
                  onChange={(_, value) => setPreferences({
                    ...preferences,
                    riskTolerance: value as number
                  })}
                  marks={[
                    { value: 0, label: 'Conservative' },
                    { value: 50, label: 'Moderate' },
                    { value: 100, label: 'Aggressive' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Investment Horizon</InputLabel>
                  <Select
                    value={preferences.investmentHorizon}
                    label="Investment Horizon"
                    onChange={(e) => setPreferences({
                      ...preferences,
                      investmentHorizon: e.target.value
                    })}
                  >
                    <MenuItem value="short">Short Term (Days)</MenuItem>
                    <MenuItem value="medium">Medium Term (Weeks)</MenuItem>
                    <MenuItem value="long">Long Term (Months)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Trading Style</InputLabel>
                  <Select
                    value={preferences.tradingStyle}
                    label="Trading Style"
                    onChange={(e) => setPreferences({
                      ...preferences,
                      tradingStyle: e.target.value
                    })}
                  >
                    <MenuItem value="conservative">Conservative</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="aggressive">Aggressive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Maximum Drawdown (%)</Typography>
                <Slider
                  value={preferences.maxDrawdown}
                  onChange={(_, value) => setPreferences({
                    ...preferences,
                    maxDrawdown: value as number
                  })}
                  min={5}
                  max={50}
                  step={5}
                  marks={[
                    { value: 5, label: '5%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                  ]}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreferencesDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                setPreferencesDialogOpen(false);
                handleAnalyze();
              }}
            >
              Save & Analyze
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default AutomatedStrategySelectionWidget;
