import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const HFT: React.FC = observer(() => {
  const [isActive, setIsActive] = useState(false);
  const [riskLevel, setRiskLevel] = useState(1);
  const [maxDrawdown, setMaxDrawdown] = useState(10);
  const [tradingPairs, setTradingPairs] = useState(['EUR/USD', 'GBP/USD', 'USD/JPY']);

  return (
    <Box sx={{ p: 3, backgroundColor: '#111827', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              High-Frequency Trading
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
              Advanced algorithmic trading with microsecond execution
            </Typography>
          </Grid>

          {/* Status Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SpeedIcon sx={{ color: isActive ? '#4CAF50' : '#ff9800' }} />}
                title="HFT Status"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="success"
                      />
                    }
                    label={isActive ? 'Active' : 'Inactive'}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Current Latency: <span style={{ color: '#4CAF50' }}>0.23ms</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<TimelineIcon sx={{ color: '#2196f3' }} />}
                title="Performance Metrics"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ color: '#4CAF50' }}>98.7%</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Success Rate
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ color: '#2196f3' }}>0.023s</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Avg. Execution Time
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ color: '#ff9800' }}>1.2M</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Daily Transactions
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Management */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SecurityIcon sx={{ color: '#ff9800' }} />}
                title="Risk Management"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Risk Level
                    </Typography>
                    <TextField
                      type="number"
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(Number(e.target.value))}
                      InputProps={{
                        inputProps: { min: 1, max: 10 }
                      }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Max Drawdown (%)
                    </Typography>
                    <TextField
                      type="number"
                      value={maxDrawdown}
                      onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                      InputProps={{
                        inputProps: { min: 0, max: 100 }
                      }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Trading Pairs */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SettingsIcon sx={{ color: '#2196f3' }} />}
                title="Trading Pairs"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {tradingPairs.map((pair) => (
                    <Chip
                      key={pair}
                      label={pair}
                      sx={{
                        m: 0.5,
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        color: '#2196f3',
                      }}
                      onDelete={() => {
                        setTradingPairs(tradingPairs.filter(p => p !== pair));
                      }}
                    />
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: '#2196f3',
                    borderColor: '#2196f3',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Add Trading Pair
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Advanced Features Alert */}
          <Grid item xs={12}>
            <Alert
              severity="info"
              sx={{
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: '#2196f3',
                '& .MuiAlert-icon': {
                  color: '#2196f3',
                },
              }}
            >
              Advanced features include: Neural network predictions, Market sentiment analysis, 
              Multi-exchange arbitrage, and Custom strategy implementation
            </Alert>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default HFT;
