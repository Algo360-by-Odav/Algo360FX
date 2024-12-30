import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { Ticker } from '../../types/trading';

interface MarketOverviewProps {
  topMovers: Ticker[];
  mostActive: Ticker[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`market-tabpanel-${index}`}
      aria-labelledby={`market-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const MarketOverview: React.FC<MarketOverviewProps> = ({ topMovers, mostActive }) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  const formatVolume = (value: number) =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="market overview tabs">
          <Tab label="Top Movers" />
          <Tab label="Most Active" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <List>
          {topMovers.map((ticker) => (
            <ListItem key={ticker.symbol}>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1">{ticker.symbol}</Typography>
                    <Typography
                      variant="body2"
                      color={
                        ticker.change >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main
                      }
                    >
                      {formatPercentage(ticker.change)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(ticker.price)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <List>
          {mostActive.map((ticker) => (
            <ListItem key={ticker.symbol}>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1">{ticker.symbol}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatVolume(ticker.volume || 0)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(ticker.price)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>
    </Box>
  );
};

export default MarketOverview;
