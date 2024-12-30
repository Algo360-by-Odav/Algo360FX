import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts';
import { format, addHours, startOfHour } from 'date-fns';

interface MarketEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
}

interface CurrencyStrength {
  currency: string;
  strength: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface CorrelationData {
  pair1: string;
  pair2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
}

const MarketAnalysisWidget: React.FC = observer(() => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('H1');
  const strengthChartRef = useRef<HTMLDivElement>(null);
  const correlationChartRef = useRef<HTMLDivElement>(null);

  const economicEvents: MarketEvent[] = [
    {
      time: '14:30',
      currency: 'USD',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      forecast: '200K',
      previous: '185K',
    },
    {
      time: '16:00',
      currency: 'EUR',
      event: 'ECB Press Conference',
      impact: 'high',
      forecast: '-',
      previous: '-',
    },
    {
      time: '18:00',
      currency: 'GBP',
      event: 'GDP m/m',
      impact: 'medium',
      forecast: '0.3%',
      previous: '0.2%',
    },
  ];

  const currencyStrength: CurrencyStrength[] = [
    { currency: 'USD', strength: 85, change: 2.3, trend: 'up' },
    { currency: 'EUR', strength: 72, change: -1.5, trend: 'down' },
    { currency: 'GBP', strength: 68, change: 0.8, trend: 'up' },
    { currency: 'JPY', strength: 62, change: -0.5, trend: 'down' },
    { currency: 'AUD', strength: 58, change: 1.2, trend: 'up' },
    { currency: 'CAD', strength: 55, change: -0.3, trend: 'down' },
  ];

  const correlations: CorrelationData[] = [
    { pair1: 'EURUSD', pair2: 'GBPUSD', correlation: 0.92, strength: 'strong' },
    { pair1: 'USDJPY', pair2: 'USDCHF', correlation: -0.85, strength: 'strong' },
    { pair1: 'AUDUSD', pair2: 'NZDUSD', correlation: 0.88, strength: 'strong' },
    { pair1: 'EURUSD', pair2: 'USDCHF', correlation: -0.95, strength: 'strong' },
    { pair1: 'GBPUSD', pair2: 'USDCAD', correlation: -0.45, strength: 'moderate' },
  ];

  useEffect(() => {
    if (strengthChartRef.current) {
      const chart = createChart(strengthChartRef.current, {
        width: strengthChartRef.current.clientWidth,
        height: 300,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#999',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const series = chart.addBarSeries({
        upColor: '#4CAF50',
        downColor: '#F44336',
        thinBars: true,
      });

      // Create chart data with proper timestamps
      const baseTime = startOfHour(new Date());
      const chartData = currencyStrength.map((currency, index) => {
        const timestamp = Math.floor(addHours(baseTime, index).getTime() / 1000) as UTCTimestamp;
        return {
          time: timestamp,
          open: 0,
          high: currency.strength,
          low: 0,
          close: currency.strength,
        };
      });

      series.setData(chartData);

      const handleResize = () => {
        if (strengthChartRef.current) {
          chart.applyOptions({
            width: strengthChartRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'error';
    if (abs >= 0.5) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Market Analysis</Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={selectedTimeframe}
              label="Timeframe"
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <MenuItem value="M15">M15</MenuItem>
              <MenuItem value="H1">H1</MenuItem>
              <MenuItem value="H4">H4</MenuItem>
              <MenuItem value="D1">D1</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Economic Calendar */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Economic Calendar
              </Typography>
              <List>
                {economicEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              {event.time} - {event.currency}
                            </Typography>
                            <Chip
                              label={event.impact.toUpperCase()}
                              color={getImpactColor(event.impact)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">{event.event}</Typography>
                            <Typography variant="caption">
                              Forecast: {event.forecast} • Previous: {event.previous}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < economicEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Currency Strength */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Currency Strength Index
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Currency</TableCell>
                      <TableCell align="right">Strength</TableCell>
                      <TableCell align="right">Change</TableCell>
                      <TableCell align="right">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currencyStrength.map((currency) => (
                      <TableRow key={currency.currency}>
                        <TableCell>{currency.currency}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={currency.strength}
                            color={currency.strength > 70 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={currency.change > 0 ? 'success.main' : 'error.main'}
                          >
                            {currency.change > 0 ? '+' : ''}{currency.change}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {currency.trend === 'up' ? (
                            <TrendingUpIcon color="success" />
                          ) : (
                            <TrendingDownIcon color="error" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2}>
                <div ref={strengthChartRef} style={{ height: '300px' }} />
              </Box>
            </Paper>
          </Grid>

          {/* Correlation Matrix */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Correlation Matrix
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pair 1</TableCell>
                      <TableCell>Pair 2</TableCell>
                      <TableCell align="right">Correlation</TableCell>
                      <TableCell align="right">Strength</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {correlations.map((corr, index) => (
                      <TableRow key={index}>
                        <TableCell>{corr.pair1}</TableCell>
                        <TableCell>{corr.pair2}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={corr.correlation.toFixed(2)}
                            color={getCorrelationColor(corr.correlation)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={corr.strength.toUpperCase()}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default MarketAnalysisWidget;
