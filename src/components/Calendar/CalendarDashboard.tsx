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
  Chip,
  Button,
} from '@mui/material';
import {
  Event,
  Notifications,
  TrendingUp,
  TrendingDown,
  Schedule,
} from '@mui/icons-material';

const CalendarDashboard = observer(() => {
  const rootStore = useRootStore();

  const economicEvents = [
    {
      time: '14:30 GMT',
      event: 'US CPI m/m',
      actual: '0.3%',
      forecast: '0.2%',
      previous: '0.1%',
      impact: 'High',
      currency: 'USD',
      deviation: 'Better',
    },
    {
      time: '15:00 GMT',
      event: 'ECB Monetary Policy Statement',
      actual: null,
      forecast: null,
      previous: null,
      impact: 'High',
      currency: 'EUR',
      deviation: null,
    },
    {
      time: '19:00 GMT',
      event: 'US Federal Budget Balance',
      actual: '-230B',
      forecast: '-225B',
      previous: '-210B',
      impact: 'Medium',
      currency: 'USD',
      deviation: 'Worse',
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getDeviationColor = (deviation: string | null) => {
    if (!deviation) return 'default';
    switch (deviation.toLowerCase()) {
      case 'better':
        return 'success';
      case 'worse':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Economic Calendar
      </Typography>

      <Grid container spacing={3}>
        {/* Today's Events */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Today's Economic Events
                </Typography>
                <Button
                  startIcon={<Notifications />}
                  variant="outlined"
                  size="small"
                >
                  Set Alerts
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Currency</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Impact</TableCell>
                      <TableCell align="right">Actual</TableCell>
                      <TableCell align="right">Forecast</TableCell>
                      <TableCell align="right">Previous</TableCell>
                      <TableCell>Deviation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {economicEvents.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>
                          <Chip 
                            label={event.currency} 
                            size="small" 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>{event.event}</TableCell>
                        <TableCell>
                          <Chip 
                            label={event.impact} 
                            size="small" 
                            color={getImpactColor(event.impact)} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {event.actual || '-'}
                        </TableCell>
                        <TableCell align="right">
                          {event.forecast || '-'}
                        </TableCell>
                        <TableCell align="right">
                          {event.previous || '-'}
                        </TableCell>
                        <TableCell>
                          {event.deviation && (
                            <Chip 
                              label={event.deviation}
                              size="small"
                              color={getDeviationColor(event.deviation)}
                              icon={event.deviation === 'Better' ? <TrendingUp /> : <TrendingDown />}
                            />
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

        {/* Weekly Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Overview
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Weekly calendar overview will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Impact Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Impact Analysis
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Market impact analysis chart will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default CalendarDashboard;
