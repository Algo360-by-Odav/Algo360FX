import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  InfoOutlined,
  CheckCircle,
  Cancel,
  TrendingUp,
  TrendingDown,
  AccessTime,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

export const ActiveSignals = observer(() => {
  const { signalProviderStore } = useStores();
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (signal: any) => {
    setSelectedSignal(signal);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'success';
      case 'closed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success.main';
    if (confidence >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box>
      {/* Filters and Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Provider"
              defaultValue="all"
              size="small"
            >
              <MenuItem value="all">All Providers</MenuItem>
              {signalProviderStore.getProviders().map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              defaultValue="all"
              size="small"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Instrument"
              defaultValue="all"
              size="small"
            >
              <MenuItem value="all">All Instruments</MenuItem>
              <MenuItem value="EURUSD">EUR/USD</MenuItem>
              <MenuItem value="GBPUSD">GBP/USD</MenuItem>
              <MenuItem value="USDJPY">USD/JPY</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Time Frame"
              defaultValue="all"
              size="small"
            >
              <MenuItem value="all">All Timeframes</MenuItem>
              <MenuItem value="M5">M5</MenuItem>
              <MenuItem value="M15">M15</MenuItem>
              <MenuItem value="H1">H1</MenuItem>
              <MenuItem value="H4">H4</MenuItem>
              <MenuItem value="D1">D1</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Signals Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Instrument</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Entry</TableCell>
              <TableCell align="right">Stop Loss</TableCell>
              <TableCell align="right">Take Profit</TableCell>
              <TableCell>Time Frame</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signalProviderStore.getActiveSignals().map((signal) => {
              const provider = signalProviderStore.getProviderById(signal.providerId);
              return (
                <TableRow key={signal.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {provider?.name}
                      {provider?.verified && (
                        <CheckCircle
                          color="primary"
                          sx={{ fontSize: 16, ml: 0.5 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{signal.pair}</TableCell>
                  <TableCell>
                    <Chip
                      label={signal.type}
                      color={signal.type === 'BUY' ? 'success' : 'error'}
                      size="small"
                      icon={signal.type === 'BUY' ? <TrendingUp /> : <TrendingDown />}
                    />
                  </TableCell>
                  <TableCell align="right">{signal.entryPrice}</TableCell>
                  <TableCell align="right">{signal.stopLoss}</TableCell>
                  <TableCell align="right">{signal.takeProfit.join(', ')}</TableCell>
                  <TableCell>{signal.timeframe}</TableCell>
                  <TableCell>
                    <Chip
                      label={signal.status}
                      color={getStatusColor(signal.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flex: 1, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={signal.confidence}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getConfidenceColor(signal.confidence),
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="caption">
                        {signal.confidence}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {formatDateTime(signal.timestamp)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(signal)}
                    >
                      <InfoOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Signal Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedSignal && (
          <>
            <DialogTitle>
              Signal Details - {selectedSignal.pair}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Trade Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Entry Price: {selectedSignal.entryPrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stop Loss: {selectedSignal.stopLoss}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Take Profit Levels: {selectedSignal.takeProfit.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level: {selectedSignal.risk}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Analysis
                  </Typography>
                  <Typography variant="body2">
                    {selectedSignal.rationale}
                  </Typography>
                </Grid>
                {selectedSignal.result && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Trade Result
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Exit Price: {selectedSignal.result.exitPrice}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pips: {selectedSignal.result.pips}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        P/L: {selectedSignal.result.profitLoss}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Holding Time: {selectedSignal.result.holdingTime}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

