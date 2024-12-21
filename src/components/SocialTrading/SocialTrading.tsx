import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Person,
  Star,
  StarBorder,
  TrendingUp,
  Timeline,
  Share,
  Message,
  PersonAdd,
  MoreVert,
  AttachMoney,
} from '@mui/icons-material';
import './SocialTrading.css';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  profitRate: number;
  followers: number;
  trades: number;
  winRate: number;
  description: string;
  isVerified: boolean;
  isFollowing: boolean;
}

interface Trade {
  id: string;
  traderId: string;
  traderName: string;
  symbol: string;
  type: 'buy' | 'sell';
  openPrice: number;
  currentPrice: number;
  profit: number;
  timestamp: Date;
}

const SocialTrading: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [showTraderDialog, setShowTraderDialog] = useState(false);

  const mockTraders: Trader[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      avatar: '',
      profitRate: 32.5,
      followers: 1250,
      trades: 456,
      winRate: 68.5,
      description: 'Professional forex trader specializing in trend following strategies.',
      isVerified: true,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: '',
      profitRate: 28.7,
      followers: 890,
      trades: 325,
      winRate: 65.2,
      description: 'Day trader focused on technical analysis and momentum trading.',
      isVerified: true,
      isFollowing: true,
    },
  ];

  const mockTrades: Trade[] = [
    {
      id: '1',
      traderId: '1',
      traderName: 'Alex Thompson',
      symbol: 'EUR/USD',
      type: 'buy',
      openPrice: 1.2150,
      currentPrice: 1.2180,
      profit: 0.25,
      timestamp: new Date(),
    },
    {
      id: '2',
      traderId: '2',
      traderName: 'Sarah Chen',
      symbol: 'GBP/JPY',
      type: 'sell',
      openPrice: 155.50,
      currentPrice: 155.20,
      profit: 0.19,
      timestamp: new Date(),
    },
  ];

  const handleFollow = (trader: Trader) => {
    // Implementation for following/unfollowing a trader
  };

  const handleCopyTrade = (trade: Trade) => {
    // Implementation for copying a trade
  };

  const handleOpenTraderProfile = (trader: Trader) => {
    setSelectedTrader(trader);
    setShowTraderDialog(true);
  };

  return (
    <div className="social-trading">
      <Box className="header">
        <Typography variant="h5">Social Trading</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => {}}
        >
          Become a Signal Provider
        </Button>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        className="tabs"
      >
        <Tab label="Top Traders" />
        <Tab label="Live Trades" />
        <Tab label="Following" />
        <Tab label="My Network" />
      </Tabs>

      <Box className="content">
        {tabValue === 0 && (
          <Grid container spacing={2}>
            {mockTraders.map((trader) => (
              <Grid item xs={12} md={6} lg={4} key={trader.id}>
                <Card className="trader-card">
                  <CardHeader
                    avatar={
                      <Avatar src={trader.avatar}>
                        {trader.name.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <IconButton onClick={() => {}}>
                        <MoreVert />
                      </IconButton>
                    }
                    title={
                      <Box className="trader-name">
                        {trader.name}
                        {trader.isVerified && (
                          <Chip
                            size="small"
                            label="Verified"
                            color="primary"
                            className="verified-badge"
                          />
                        )}
                      </Box>
                    }
                    subheader={`${trader.followers} followers`}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Profit Rate
                        </Typography>
                        <Typography
                          variant="h6"
                          color={trader.profitRate > 0 ? 'success.main' : 'error.main'}
                        >
                          {trader.profitRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Win Rate
                        </Typography>
                        <Typography variant="h6">
                          {trader.winRate}%
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      {trader.description}
                    </Typography>
                    <Box className="trader-actions">
                      <Button
                        variant={trader.isFollowing ? 'outlined' : 'contained'}
                        onClick={() => handleFollow(trader)}
                        startIcon={trader.isFollowing ? <Star /> : <StarBorder />}
                      >
                        {trader.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenTraderProfile(trader)}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {tabValue === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Trader</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Open Price</TableCell>
                  <TableCell>Current Price</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.traderName}</TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>
                      <Chip
                        label={trade.type.toUpperCase()}
                        color={trade.type === 'buy' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{trade.openPrice}</TableCell>
                    <TableCell>{trade.currentPrice}</TableCell>
                    <TableCell>
                      <Typography
                        color={trade.profit > 0 ? 'success.main' : 'error.main'}
                      >
                        {trade.profit}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {trade.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleCopyTrade(trade)}
                      >
                        Copy Trade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog
        open={showTraderDialog}
        onClose={() => setShowTraderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTrader && (
          <>
            <DialogTitle>
              <Box className="trader-profile-header">
                <Avatar src={selectedTrader.avatar} sx={{ width: 64, height: 64 }}>
                  {selectedTrader.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedTrader.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTrader.description}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  {/* Performance Chart */}
                  <Paper className="performance-chart">
                    <Typography variant="subtitle1">Performance</Typography>
                    {/* Add chart component here */}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className="stats-panel">
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Total Profit"
                          secondary={`${selectedTrader.profitRate}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Win Rate"
                          secondary={`${selectedTrader.winRate}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Total Trades"
                          secondary={selectedTrader.trades}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Followers"
                          secondary={selectedTrader.followers}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowTraderDialog(false)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => handleFollow(selectedTrader)}
              >
                {selectedTrader.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default SocialTrading;
