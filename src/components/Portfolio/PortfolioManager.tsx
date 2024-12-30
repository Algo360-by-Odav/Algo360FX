import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { Portfolio, Position, RebalanceTarget } from '../../types/trading';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import PositionSizer from './PositionSizer';
import RebalanceDialog from './RebalanceDialog';
import RiskAnalysis from './RiskAnalysis';

const PortfolioManager: React.FC = observer(() => {
  const theme = useTheme();
  const { portfolioStore, riskManagementStore } = useStore();
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(
    null
  );
  const [isAddPositionOpen, setIsAddPositionOpen] = React.useState(false);
  const [isRebalanceOpen, setIsRebalanceOpen] = React.useState(false);
  const [isRiskAnalysisOpen, setIsRiskAnalysisOpen] = React.useState(false);

  // Portfolio summary data
  const portfolioValue = portfolioStore.getTotalValue();
  const dailyPnL = portfolioStore.getDailyPnL();
  const totalPnL = portfolioStore.getTotalPnL();
  const positions = portfolioStore.getPositions();

  // Prepare data for allocation pie chart
  const allocationData = positions.map((position) => ({
    name: position.symbol,
    value: (position.marketValue / portfolioValue) * 100,
  }));

  // Prepare data for equity curve
  const equityData = portfolioStore.getEquityCurve();

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setIsAddPositionOpen(true);
  };

  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position);
    setIsAddPositionOpen(true);
  };

  const handleDeletePosition = async (position: Position) => {
    try {
      await portfolioStore.closePosition(position.id);
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  const handleSavePosition = async (position: Position) => {
    try {
      if (selectedPosition) {
        await portfolioStore.updatePosition(position);
      } else {
        await portfolioStore.addPosition(position);
      }
      setIsAddPositionOpen(false);
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  };

  const handleRebalance = async (targets: RebalanceTarget[]) => {
    try {
      await portfolioStore.rebalancePortfolio(targets);
      setIsRebalanceOpen(false);
    } catch (error) {
      console.error('Failed to rebalance portfolio:', error);
    }
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Portfolio Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Portfolio Value
            </Typography>
            <Typography variant="h6">
              {formatCurrency(portfolioValue)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Daily P&L
            </Typography>
            <Typography
              variant="h6"
              color={dailyPnL >= 0 ? 'success.main' : 'error.main'}
            >
              {formatCurrency(dailyPnL)}
              {' '}
              ({formatPercentage(dailyPnL / (portfolioValue - dailyPnL))})
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Total P&L
            </Typography>
            <Typography
              variant="h6"
              color={totalPnL >= 0 ? 'success.main' : 'error.main'}
            >
              {formatCurrency(totalPnL)}
              {' '}
              ({formatPercentage(totalPnL / (portfolioValue - totalPnL))})
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Risk Score
            </Typography>
            <Typography variant="h6">
              {riskManagementStore.getPortfolioRiskScore().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Portfolio Charts */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Equity Curve */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Portfolio Value Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(date) =>
                      new Date(date).toLocaleString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Asset Allocation
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name} (${entry.value.toFixed(1)}%)`
                    }
                  >
                    {allocationData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Positions Table */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Positions</Typography>
          <Box>
            <Button
              startIcon={<TrendingUpIcon />}
              onClick={() => setIsRiskAnalysisOpen(true)}
              sx={{ mr: 1 }}
            >
              Risk Analysis
            </Button>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => setIsRebalanceOpen(true)}
              sx={{ mr: 1 }}
            >
              Rebalance
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleAddPosition}
            >
              Add Position
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Entry Price</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Market Value</TableCell>
                <TableCell align="right">Unrealized P&L</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.symbol}</TableCell>
                  <TableCell align="right">{position.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(position.entryPrice)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(position.currentPrice)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(position.marketValue)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        position.unrealizedPnL >= 0
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {formatCurrency(position.unrealizedPnL)}
                    {' '}
                    ({formatPercentage(position.unrealizedPnLPercent)})
                  </TableCell>
                  <TableCell align="right">
                    {formatPercentage(position.weight)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPosition(position)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePosition(position)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Position Dialog */}
      <Dialog
        open={isAddPositionOpen}
        onClose={() => setIsAddPositionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPosition ? 'Edit Position' : 'Add Position'}
        </DialogTitle>
        <DialogContent>
          <PositionSizer
            initialPosition={selectedPosition}
            onSave={handleSavePosition}
          />
        </DialogContent>
      </Dialog>

      {/* Rebalance Dialog */}
      <Dialog
        open={isRebalanceOpen}
        onClose={() => setIsRebalanceOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Rebalance Portfolio</DialogTitle>
        <DialogContent>
          <RebalanceDialog
            positions={positions}
            onRebalance={handleRebalance}
          />
        </DialogContent>
      </Dialog>

      {/* Risk Analysis Dialog */}
      <Dialog
        open={isRiskAnalysisOpen}
        onClose={() => setIsRiskAnalysisOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Portfolio Risk Analysis</DialogTitle>
        <DialogContent>
          <RiskAnalysis positions={positions} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRiskAnalysisOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default PortfolioManager;
