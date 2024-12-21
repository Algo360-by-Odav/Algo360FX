import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search,
  Notifications,
  NotificationsOff,
  Flag,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Event {
  id: string;
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

const Calendar: React.FC = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);

  const events: Event[] = [
    {
      id: '1',
      time: '08:30',
      country: 'USD',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      actual: '200K',
      forecast: '180K',
      previous: '175K',
    },
    {
      id: '2',
      time: '10:00',
      country: 'EUR',
      event: 'CPI y/y',
      impact: 'high',
      forecast: '2.1%',
      previous: '2.0%',
    },
    {
      id: '3',
      time: '12:30',
      country: 'GBP',
      event: 'BOE Rate Decision',
      impact: 'high',
      forecast: '4.25%',
      previous: '4.25%',
    },
  ];

  const countries = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];

  const handleCountryChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedCountries(event.target.value as string[]);
  };

  const handleImpactChange = (event: SelectChangeEvent) => {
    setImpactFilter(event.target.value);
  };

  const toggleNotification = (eventId: string) => {
    if (notifiedEvents.includes(eventId)) {
      setNotifiedEvents(notifiedEvents.filter(id => id !== eventId));
    } else {
      setNotifiedEvents([...notifiedEvents, eventId]);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Filters */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Countries</InputLabel>
                  <Select
                    multiple
                    value={selectedCountries}
                    onChange={handleCountryChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            size="small"
                            icon={<Flag />}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Impact</InputLabel>
                  <Select
                    value={impactFilter}
                    onChange={handleImpactChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="high">High Impact</MenuItem>
                    <MenuItem value="medium">Medium Impact</MenuItem>
                    <MenuItem value="low">Low Impact</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Impact</TableCell>
                    <TableCell align="right">Actual</TableCell>
                    <TableCell align="right">Forecast</TableCell>
                    <TableCell align="right">Previous</TableCell>
                    <TableCell align="center">Notify</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Flag sx={{ mr: 1 }} />
                          {event.country}
                        </Box>
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
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => toggleNotification(event.id)}
                        >
                          {notifiedEvents.includes(event.id) ? (
                            <Notifications color="primary" />
                          ) : (
                            <NotificationsOff />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Calendar;
