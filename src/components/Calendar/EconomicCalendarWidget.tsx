import React, { useState, useEffect } from 'react';
import {
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
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import {
  Event,
  FilterList,
  Search,
  Flag,
  TrendingUp,
  DateRange,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface EconomicEvent {
  id: string;
  datetime: Date;
  country: string;
  currency: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  actual?: string;
  forecast?: string;
  previous?: string;
}

const EconomicCalendarWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedImpact, setSelectedImpact] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated economic events data
  const [events, setEvents] = useState<EconomicEvent[]>([
    {
      id: '1',
      datetime: new Date(),
      country: 'US',
      currency: 'USD',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      actual: '263K',
      forecast: '200K',
      previous: '315K',
    },
    {
      id: '2',
      datetime: new Date(),
      country: 'EU',
      currency: 'EUR',
      event: 'CPI y/y',
      impact: 'high',
      actual: '10.0%',
      forecast: '9.7%',
      previous: '9.1%',
    },
    {
      id: '3',
      datetime: new Date(),
      country: 'GB',
      currency: 'GBP',
      event: 'GDP q/q',
      impact: 'medium',
      actual: '-0.2%',
      forecast: '-0.5%',
      previous: '0.2%',
    },
  ]);

  const countries = ['US', 'EU', 'GB', 'JP', 'AU', 'CA', 'CH', 'NZ'];
  const impactLevels = ['low', 'medium', 'high'];

  const handleCountryChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedCountries(event.target.value as string[]);
  };

  const handleImpactChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedImpact(event.target.value as string[]);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return theme.palette.info.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesCountry =
      selectedCountries.length === 0 ||
      selectedCountries.includes(event.country);
    const matchesImpact =
      selectedImpact.length === 0 || selectedImpact.includes(event.impact);
    const matchesSearch =
      searchQuery === '' ||
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesImpact && matchesSearch;
  });

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Event />
          <Typography variant="h6">Economic Calendar</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => newValue && setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: 150 }} />
              )}
            />
          </LocalizationProvider>
          <IconButton
            size="small"
            onClick={(event) => setFilterAnchor(event.currentTarget)}
          >
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Event</TableCell>
                <TableCell align="right">Impact</TableCell>
                <TableCell align="right">Actual</TableCell>
                <TableCell align="right">Forecast</TableCell>
                <TableCell align="right">Previous</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    {event.datetime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{event.country}</Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {event.currency}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{event.event}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={event.impact}
                      size="small"
                      sx={{
                        bgcolor: `${getImpactColor(event.impact)}20`,
                        color: getImpactColor(event.impact),
                        minWidth: 70,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        color: event.actual
                          ? event.actual > (event.forecast || '')
                            ? theme.palette.success.main
                            : theme.palette.error.main
                          : 'text.primary',
                      }}
                    >
                      {event.actual || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {event.forecast || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {event.previous || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filters
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Countries</InputLabel>
            <Select
              multiple
              value={selectedCountries}
              onChange={handleCountryChange}
              label="Countries"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
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
          <FormControl fullWidth size="small">
            <InputLabel>Impact</InputLabel>
            <Select
              multiple
              value={selectedImpact}
              onChange={handleImpactChange}
              label="Impact"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        bgcolor: `${getImpactColor(value)}20`,
                        color: getImpactColor(value),
                      }}
                    />
                  ))}
                </Box>
              )}
            >
              {impactLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Menu>
    </Card>
  );
});

export default EconomicCalendarWidget;
