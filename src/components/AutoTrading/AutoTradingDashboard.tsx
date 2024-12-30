import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Settings,
  Refresh,
  Warning,
} from '@mui/icons-material';

const AutoTradingDashboard = observer(() => {
  const rootStore = useRootStore();
  const { strategyStore } = rootStore;

  const strategies = [
    { 
      id: 1,
      name: 'Trend Following EUR/USD',
      status: 'Running',
      pnl: 1250,
      positions: 2,
      signals: 5,
      lastUpdate: '2 min ago',
    },
    { 
      id: 2,
      name: 'Mean Reversion GBP/USD',
      status: 'Stopped',
      pnl: -320,
      positions: 0,
      signals: 3,
      lastUpdate: '15 min ago',
    },
    { 
      id: 3,
      name: 'Breakout Strategy USD/JPY',
      status: 'Running',
      pnl: 850,
      positions: 1,
      signals: 2,
      lastUpdate: '5 min ago',
    },
  ];

  const recentSignals = [
    { time: '09:30:25', strategy: 'Trend Following EUR/USD', signal: 'BUY', price: 1.0921, status: 'Executed' },
    { time: '09:28:15', strategy: 'Breakout Strategy USD/JPY', signal: 'SELL', price: 142.35, status: 'Pending' },
    { time: '09:25:00', strategy: 'Mean Reversion GBP/USD', signal: 'BUY', price: 1.2645, status: 'Rejected' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Auto Trading Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Strategy Controls */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Strategy Controls
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    sx={{ mr: 1 }}
                  >
                    Start All
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                  >
                    Stop All
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Strategy Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">P&L</TableCell>
                      <TableCell align="right">Open Positions</TableCell>
                      <TableCell align="right">Active Signals</TableCell>
                      <TableCell>Last Update</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {strategies.map((strategy) => (
                      <TableRow key={strategy.id}>
                        <TableCell>{strategy.name}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: strategy.status === 'Running' ? 'success.main' : 'error.main',
                            color: 'white',
                          }}>
                            {strategy.status}
                          </Box>
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ color: strategy.pnl >= 0 ? 'success.main' : 'error.main' }}
                        >
                          ${strategy.pnl}
                        </TableCell>
                        <TableCell align="right">{strategy.positions}</TableCell>
                        <TableCell align="right">{strategy.signals}</TableCell>
                        <TableCell>{strategy.lastUpdate}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Settings />}
                            sx={{ mr: 1 }}
                          >
                            Configure
                          </Button>
                          {strategy.status === 'Running' ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Stop />}
                            >
                              Stop
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<PlayArrow />}
                            >
                              Start
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Signals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Signals
                </Typography>
                <Button
                  startIcon={<Refresh />}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Strategy</TableCell>
                      <TableCell>Signal</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSignals.map((signal, index) => (
                      <TableRow key={index}>
                        <TableCell>{signal.time}</TableCell>
                        <TableCell>{signal.strategy}</TableCell>
                        <TableCell sx={{ color: signal.signal === 'BUY' ? 'success.main' : 'error.main' }}>
                          {signal.signal}
                        </TableCell>
                        <TableCell align="right">{signal.price}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 
                              signal.status === 'Executed' ? 'success.main' 
                              : signal.status === 'Pending' ? 'warning.main'
                              : 'error.main',
                            color: 'white',
                          }}>
                            {signal.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Controls
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Maximum Position Size Limit"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 3, mb: 2 }}>
                  Limit maximum position size to $100,000
                </Typography>

                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Stop Loss Protection"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 3, mb: 2 }}>
                  Automatically set stop loss for all positions
                </Typography>

                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Maximum Daily Loss"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 3, mb: 2 }}>
                  Stop trading if daily loss exceeds $5,000
                </Typography>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Warning color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" color="warning.dark">
                      Risk Warning
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="warning.dark">
                    Current daily loss: $320. Maximum daily loss limit: $5,000
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default AutoTradingDashboard;
