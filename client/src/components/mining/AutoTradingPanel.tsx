import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { AutoGraph, SwapHoriz, Settings } from '@mui/icons-material';

interface TradingStats {
  totalTrades: number;
  profitLoss: number;
  pendingSwaps: number;
}

interface Props {
  stats: TradingStats;
}

const AutoTradingPanel: React.FC<Props> = ({ stats }) => {
  const [autoTrading, setAutoTrading] = useState(true);
  const [tradingStrategy, setTradingStrategy] = useState('smart');
  const [threshold, setThreshold] = useState(2.5);

  const handleStrategyChange = (event: any) => {
    setTradingStrategy(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Auto-Trading Panel
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Auto-Trading</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={autoTrading}
                  onChange={(e) => setAutoTrading(e.target.checked)}
                  color="primary"
                />
              }
              label={autoTrading ? "Enabled" : "Disabled"}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Trading Settings
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Strategy</InputLabel>
            <Select
              value={tradingStrategy}
              label="Strategy"
              onChange={handleStrategyChange}
            >
              <MenuItem value="smart">Smart (AI-Driven)</MenuItem>
              <MenuItem value="dca">DCA (Dollar Cost Averaging)</MenuItem>
              <MenuItem value="manual">Manual Thresholds</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Profit Threshold (%)"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Trading Statistics
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Total Trades"
                secondary={stats.totalTrades}
              />
              <Chip
                icon={<AutoGraph />}
                label="24h"
                size="small"
                color="primary"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Profit/Loss"
                secondary={`$${stats.profitLoss.toFixed(2)}`}
              />
              <Chip
                label={stats.profitLoss >= 0 ? "Profit" : "Loss"}
                color={stats.profitLoss >= 0 ? "success" : "error"}
                size="small"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Pending Swaps"
                secondary={stats.pendingSwaps}
              />
              <Chip
                icon={<SwapHoriz />}
                label="Active"
                size="small"
                color="warning"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AutoTradingPanel;
