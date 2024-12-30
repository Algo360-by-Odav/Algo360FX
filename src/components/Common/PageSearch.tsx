import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Page {
  title: string;
  path: string;
  description?: string;
}

const pages: Page[] = [
  { title: 'Dashboard', path: '/', description: 'Main dashboard view' },
  { title: 'Trading', path: '/trading', description: 'Trading interface' },
  { title: 'Market Data', path: '/market-data', description: 'Market data and analysis' },
  { title: 'Portfolio', path: '/portfolio', description: 'Portfolio management' },
  { title: 'Trading Academy', path: '/academy', description: 'Educational resources' },
  { title: 'Risk Management', path: '/risk-management', description: 'Risk management tools' },
  { title: 'Strategy Builder', path: '/strategy', description: 'Build trading strategies' },
  { title: 'Strategy Marketplace', path: '/strategy-marketplace', description: 'Browse and buy strategies' },
  { title: 'Portfolio Optimizer', path: '/portfolio-optimizer', description: 'Optimize your portfolio' },
  { title: 'Reports', path: '/reports', description: 'View reports and analytics' },
  { title: 'Documentation', path: '/documentation', description: 'Platform documentation' },
  { title: 'Analytics', path: '/analytics', description: 'Advanced analytics' },
  { title: 'Auto Trading', path: '/auto-trading', description: 'Automated trading settings' },
  { title: 'News', path: '/news', description: 'Market news and updates' },
  { title: 'Calendar', path: '/calendar', description: 'Economic calendar' },
  { title: 'Profile', path: '/profile', description: 'User profile settings' },
  { title: 'Settings', path: '/settings', description: 'Application settings' },
  { title: 'Notifications', path: '/notifications', description: 'View notifications' },
];

const PageSearch: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOptionSelect = (_: any, value: Page | null) => {
    if (value) {
      navigate(value.path);
      setInputValue('');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        options={pages}
        getOptionLabel={(option) => option.title}
        onChange={handleOptionSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search pages..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <IconButton
                  size="small"
                  sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Typography variant="body1">{option.title}</Typography>
              {option.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {option.description}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        PaperComponent={({ children }) => (
          <Paper
            elevation={8}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              mt: 1,
            }}
          >
            {children}
          </Paper>
        )}
      />
    </Box>
  );
};

export default PageSearch;
