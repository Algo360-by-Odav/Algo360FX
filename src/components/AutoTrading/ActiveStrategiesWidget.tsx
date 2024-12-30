import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface ActiveStrategy {
  id: string;
  name: string;
  symbol: string;
  status: 'running' | 'stopped';
  profit: number;
  trades: number;
}

const sampleStrategies: ActiveStrategy[] = [
  {
    id: '1',
    name: 'Trend Rider Pro',
    symbol: 'EURUSD',
    status: 'running',
    profit: 245.50,
    trades: 12,
  },
  {
    id: '2',
    name: 'Scalping Master',
    symbol: 'GBPUSD',
    status: 'stopped',
    profit: -32.25,
    trades: 8,
  },
];

const ActiveStrategiesWidget: React.FC = observer(() => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedStrategy, setSelectedStrategy] = React.useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, strategyId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedStrategy(strategyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStrategy(null);
  };

  const handleStartStop = (strategyId: string) => {
    // Implement start/stop logic here
    console.log('Toggle strategy:', strategyId);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Active Strategies</Typography>
          <Button
            size="small"
            startIcon={<SettingsIcon />}
            onClick={() => console.log('Open settings')}
          >
            Settings
          </Button>
        </Box>

        <List>
          {sampleStrategies.map((strategy, index) => (
            <React.Fragment key={strategy.id}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleStartStop(strategy.id)}
                      color={strategy.status === 'running' ? 'error' : 'success'}
                    >
                      {strategy.status === 'running' ? <StopIcon /> : <PlayIcon />}
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleMenuClick(e, strategy.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1">{strategy.name}</Typography>
                      <Chip
                        label={strategy.symbol}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color={strategy.profit >= 0 ? 'success.main' : 'error.main'}
                      >
                        {strategy.profit >= 0 ? '+' : ''}{strategy.profit.toFixed(2)} USD
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {strategy.trades} trades
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Edit Parameters</MenuItem>
          <MenuItem onClick={handleMenuClose}>View Performance</MenuItem>
          <MenuItem onClick={handleMenuClose}>Remove Strategy</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
});

export default ActiveStrategiesWidget;
