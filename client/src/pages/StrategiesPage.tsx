import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  Timeline as BacktestIcon
} from '@mui/icons-material';
import { useApp } from '@/context/AppContext';
import { privateApi } from '@/config/api';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE';
  symbols: string[];
  parameters: Record<string, any>;
  performance: {
    totalPnl: number;
    winRate: number;
    trades: number;
    sharpeRatio: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface StrategySummary {
  totalStrategies: number;
  activeStrategies: number;
  totalPnl: number;
  averageWinRate: number;
}

interface StrategyFormData {
  name: string;
  description: string;
  type: string;
  symbols: string[];
  parameters: Record<string, any>;
}

const defaultStrategyFormData: StrategyFormData = {
  name: '',
  description: '',
  type: 'TREND_FOLLOWING',
  symbols: [],
  parameters: {}
};

const StrategiesPage: React.FC = () => {
  const theme = useTheme();
  const { showNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [summary, setSummary] = useState<StrategySummary | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>(defaultStrategyFormData);
  const [availableSymbols] = useState(['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD']);
  const [strategyTypes] = useState(['TREND_FOLLOWING', 'MEAN_REVERSION', 'BREAKOUT', 'SCALPING']);

  const fetchStrategiesData = async () => {
    try {
      setLoading(true);
      const [strategiesResponse, summaryResponse] = await Promise.all([
        privateApi.get('/strategies'),
        privateApi.get('/strategies/summary')
      ]);

      setStrategies(strategiesResponse.data);
      setSummary(summaryResponse.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to fetch strategies data',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategiesData();
  }, []);

  const handleSubmitStrategy = async () => {
    try {
      if (selectedStrategy) {
        await privateApi.patch(`/strategies/${selectedStrategy.id}`, formData);
        showNotification('Strategy updated successfully', 'success');
      } else {
        await privateApi.post('/strategies', formData);
        showNotification('Strategy created successfully', 'success');
      }
      setFormDialogOpen(false);
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to save strategy',
        'error'
      );
    }
  };

  const handleDeleteStrategy = async (strategyId: string) => {
    try {
      await privateApi.delete(`/strategies/${strategyId}`);
      showNotification('Strategy deleted successfully', 'success');
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to delete strategy',
        'error'
      );
    }
  };

  const handleToggleStrategy = async (strategy: Strategy) => {
    try {
      await privateApi.post(`/strategies/${strategy.id}/${strategy.status === 'ACTIVE' ? 'stop' : 'start'}`);
      showNotification(`Strategy ${strategy.status === 'ACTIVE' ? 'stopped' : 'started'} successfully`, 'success');
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to toggle strategy',
        'error'
      );
    }
  };

  const handleBacktest = async (strategyId: string) => {
    try {
      await privateApi.post(`/strategies/${strategyId}/backtest`);
      showNotification('Backtest started successfully', 'success');
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to start backtest',
        'error'
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  if (loading && !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Trading Strategies
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStrategy(null);
              setFormData(defaultStrategyFormData);
              setFormDialogOpen(true);
            }}
          >
            New Strategy
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchStrategiesData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Total Strategies
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {summary.totalStrategies}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active: {summary.activeStrategies}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {summary.totalPnl >= 0 ? (
                    <ProfitIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                  ) : (
                    <LossIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                  )}
                  <Typography variant="h6" component="div">
                    Total P&L
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    mb: 1,
                    color: summary.totalPnl >= 0 
                      ? theme.palette.success.main 
                      : theme.palette.error.main
                  }}
                >
                  {formatCurrency(summary.totalPnl)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Average Win Rate
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {formatPercentage(summary.averageWinRate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Symbols</TableCell>
                <TableCell align="right">Win Rate</TableCell>
                <TableCell align="right">Total P&L</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {strategies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell>{strategy.name}</TableCell>
                    <TableCell>{strategy.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={strategy.status}
                        color={strategy.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {strategy.symbols.join(', ')}
                    </TableCell>
                    <TableCell align="right">
                      {formatPercentage(strategy.performance.winRate)}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: strategy.performance.totalPnl >= 0 
                          ? theme.palette.success.main 
                          : theme.palette.error.main 
                      }}
                    >
                      {formatCurrency(strategy.performance.totalPnl)}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedStrategy(strategy);
                              setFormData({
                                name: strategy.name,
                                description: strategy.description,
                                type: strategy.type,
                                symbols: strategy.symbols,
                                parameters: strategy.parameters
                              });
                              setFormDialogOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={strategy.status === 'ACTIVE' ? 'Stop' : 'Start'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStrategy(strategy)}
                          >
                            {strategy.status === 'ACTIVE' ? <StopIcon /> : <StartIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Backtest">
                          <IconButton
                            size="small"
                            onClick={() => handleBacktest(strategy.id)}
                          >
                            <BacktestIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteStrategy(strategy.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={strategies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedStrategy ? 'Edit Strategy' : 'New Strategy'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                {strategyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Symbols</InputLabel>
              <Select
                multiple
                value={formData.symbols}
                label="Symbols"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  symbols: typeof e.target.value === 'string' 
                    ? e.target.value.split(',') 
                    : e.target.value
                }))}
              >
                {availableSymbols.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitStrategy} variant="contained">
            {selectedStrategy ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StrategiesPage;
