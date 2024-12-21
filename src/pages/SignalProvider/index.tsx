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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  SignalCellularAlt as SignalIcon,
} from '@mui/icons-material';

const SignalProvider: React.FC = observer(() => {
  const [autoPublish, setAutoPublish] = useState(true);
  const [activeSignals] = useState([
    { pair: 'EUR/USD', type: 'BUY', profit: '+2.5%', subscribers: 1250 },
    { pair: 'GBP/JPY', type: 'SELL', profit: '+1.8%', subscribers: 980 },
    { pair: 'USD/CHF', type: 'BUY', profit: '+3.2%', subscribers: 1100 },
  ]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#111827', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Signal Provider Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
              Manage and distribute your trading signals to subscribers
            </Typography>
          </Grid>

          {/* Provider Stats */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white', height: '100%' }}>
              <CardHeader
                avatar={<SignalIcon sx={{ color: '#4CAF50' }} />}
                title="Provider Statistics"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Subscribers"
                      secondary="3,250"
                      secondaryTypographyProps={{ color: '#4CAF50', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Success Rate"
                      secondary="89.5%"
                      secondaryTypographyProps={{ color: '#2196f3', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Monthly Revenue"
                      secondary="$12,450"
                      secondaryTypographyProps={{ color: '#ff9800', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Signals */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SendIcon sx={{ color: '#2196f3' }} />}
                title="Active Signals"
                titleTypographyProps={{ color: 'white' }}
                action={
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoPublish}
                        onChange={(e) => setAutoPublish(e.target.checked)}
                        color="success"
                      />
                    }
                    label="Auto Publish"
                  />
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {activeSignals.map((signal, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" sx={{ color: '#2196f3' }}>
                              {signal.pair}
                            </Typography>
                            <Chip
                              label={signal.type}
                              size="small"
                              sx={{
                                backgroundColor: signal.type === 'BUY' ? '#4CAF50' : '#f44336',
                                color: 'white',
                                mt: 1,
                              }}
                            />
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" sx={{ color: '#4CAF50' }}>
                              {signal.profit}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {signal.subscribers} subscribers
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Signal Performance */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<AssessmentIcon sx={{ color: '#ff9800' }} />}
                title="Signal Performance"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', mb: 1 }}>
                        Win Rate
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                        89.5%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                        Last 100 signals
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#2196f3', mb: 1 }}>
                        Average Profit
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2196f3' }}>
                        25.6 pips
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                        Per signal
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                        Max Drawdown
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#ff9800' }}>
                        4.2%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                        Monthly
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                New Signal
              </Button>
              <Button
                variant="contained"
                startIcon={<PeopleIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#388E3C' },
                }}
              >
                Manage Subscribers
              </Button>
              <Button
                variant="contained"
                startIcon={<MonetizationOnIcon />}
                sx={{
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' },
                }}
              >
                Subscription Plans
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default SignalProvider;
