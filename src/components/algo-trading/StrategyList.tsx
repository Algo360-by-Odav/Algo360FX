import React, { useEffect, useState } from 'react';
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
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { TradingStrategy } from '../../types/algo-trading';
import { useAlgoTradingStore } from '../../stores/AlgoTradingStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const StrategyList: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    setLoading(true);
    try {
      await algoTradingStore.loadStrategies();
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (strategy: TradingStrategy) => {
    try {
      await algoTradingStore.startStrategy(strategy.id);
    } catch (error) {
      console.error('Failed to start strategy:', error);
    }
  };

  const handleStop = async (strategy: TradingStrategy) => {
    try {
      await algoTradingStore.stopStrategy(strategy.id);
    } catch (error) {
      console.error('Failed to stop strategy:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedStrategy) return;

    try {
      await algoTradingStore.deleteStrategy(selectedStrategy.id);
      setDeleteDialogOpen(false);
      setSelectedStrategy(null);
    } catch (error) {
      console.error('Failed to delete strategy:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#4caf50';
      case 'PAUSED':
        return '#ff9800';
      case 'STOPPED':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
          Active Strategies
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Type
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Symbols
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Performance
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {algoTradingStore.strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell sx={{ color: 'white' }}>{strategy.name}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {strategy.type.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {strategy.symbols.map((symbol) => (
                        <Chip
                          key={symbol}
                          label={symbol}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.status}
                      sx={{
                        backgroundColor: `${getStatusColor(strategy.status)}20`,
                        color: getStatusColor(strategy.status),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {strategy.backtestResults ? (
                      <Box>
                        <Typography variant="body2">
                          Win Rate:{' '}
                          {formatPercent(strategy.backtestResults.winRate)}
                        </Typography>
                        <Typography variant="body2">
                          Net Profit:{' '}
                          {formatCurrency(strategy.backtestResults.netProfit)}
                        </Typography>
                      </Box>
                    ) : (
                      'No data'
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {strategy.status === 'ACTIVE' ? (
                        <IconButton
                          onClick={() => handleStop(strategy)}
                          sx={{ color: '#f44336' }}
                        >
                          <StopIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleStart(strategy)}
                          sx={{ color: '#4caf50' }}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => {
                          // Handle edit
                        }}
                        sx={{ color: '#2196f3' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedStrategy(strategy);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          // Handle view performance
                        }}
                        sx={{ color: '#ffeb3b' }}
                      >
                        <AssessmentIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1F2937',
              color: 'white',
            },
          }}
        >
          <DialogTitle>Delete Strategy</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this strategy? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: 'white' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              sx={{ color: '#f44336' }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
});

export default StrategyList;
