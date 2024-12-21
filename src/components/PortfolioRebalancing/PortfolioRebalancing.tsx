import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { portfolioRebalancingService } from '../../services/portfolio/PortfolioRebalancingService';
import { Portfolio, RebalanceStrategy, RebalanceTarget, RebalanceConstraints } from '../../types/trading';
import './PortfolioRebalancing.css';

interface PortfolioRebalancingProps {
  portfolio: Portfolio;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PortfolioRebalancing: React.FC<PortfolioRebalancingProps> = observer(({ portfolio }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<RebalanceStrategy>('CALENDAR');
  const [targets, setTargets] = useState<RebalanceTarget[]>([]);
  const [constraints, setConstraints] = useState<RebalanceConstraints>({
    minWeight: 0,
    maxWeight: 1,
    maxTurnover: 0.2,
    threshold: 0.05,
  });
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [showTargetDialog, setShowTargetDialog] = useState(false);
  const [newTarget, setNewTarget] = useState<Partial<RebalanceTarget>>({});
  const [rebalanceHistory, setRebalanceHistory] = useState<any[]>([]);

  useEffect(() => {
    loadRebalanceHistory();
  }, [portfolio.id]);

  const loadRebalanceHistory = () => {
    const history = portfolioRebalancingService.getRebalanceHistory(portfolio.id);
    setRebalanceHistory(history);
  };

  const handleStrategyChange = (event: any) => {
    setSelectedStrategy(event.target.value);
  };

  const handleAddTarget = () => {
    if (newTarget.symbol && newTarget.weight) {
      setTargets([...targets, newTarget as RebalanceTarget]);
      setNewTarget({});
      setShowTargetDialog(false);
    }
  };

  const handleRemoveTarget = (index: number) => {
    const newTargets = [...targets];
    newTargets.splice(index, 1);
    setTargets(newTargets);
  };

  const handleConstraintChange = (field: keyof RebalanceConstraints) => (event: any) => {
    setConstraints({
      ...constraints,
      [field]: parseFloat(event.target.value),
    });
  };

  const handleRebalance = async () => {
    setIsRebalancing(true);
    try {
      await portfolioRebalancingService.rebalancePortfolio(
        portfolio.id,
        selectedStrategy,
        targets,
        constraints
      );
      loadRebalanceHistory();
    } catch (error) {
      console.error('Rebalancing failed:', error);
    } finally {
      setIsRebalancing(false);
    }
  };

  const renderStrategyForm = () => (
    <Card className="strategy-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rebalancing Strategy
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Strategy</InputLabel>
          <Select value={selectedStrategy} onChange={handleStrategyChange}>
            <MenuItem value="CALENDAR">Calendar Rebalancing</MenuItem>
            <MenuItem value="THRESHOLD">Threshold Rebalancing</MenuItem>
            <MenuItem value="RISK_PARITY">Risk Parity</MenuItem>
            <MenuItem value="MINIMUM_VARIANCE">Minimum Variance</MenuItem>
            <MenuItem value="SMART_BETA">Smart Beta</MenuItem>
          </Select>
        </FormControl>
        <div className="strategy-info">
          <Typography className="strategy-info-title">
            {selectedStrategy === 'CALENDAR' && 'Calendar Rebalancing'}
            {selectedStrategy === 'THRESHOLD' && 'Threshold Rebalancing'}
            {selectedStrategy === 'RISK_PARITY' && 'Risk Parity'}
            {selectedStrategy === 'MINIMUM_VARIANCE' && 'Minimum Variance'}
            {selectedStrategy === 'SMART_BETA' && 'Smart Beta'}
          </Typography>
          <Typography className="strategy-info-description">
            {selectedStrategy === 'CALENDAR' &&
              'Rebalances the portfolio at fixed time intervals to maintain target weights.'}
            {selectedStrategy === 'THRESHOLD' &&
              'Rebalances when asset weights deviate beyond specified thresholds.'}
            {selectedStrategy === 'RISK_PARITY' &&
              'Allocates risk equally across assets for optimal diversification.'}
            {selectedStrategy === 'MINIMUM_VARIANCE' &&
              'Minimizes portfolio volatility while maintaining target returns.'}
            {selectedStrategy === 'SMART_BETA' &&
              'Combines multiple factors for enhanced risk-adjusted returns.'}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );

  const renderTargetsForm = () => (
    <Card className="targets-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Target Weights</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowTargetDialog(true)}
          >
            Add Target
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {targets.map((target, index) => (
            <Chip
              key={index}
              label={`${target.symbol}: ${(target.weight * 100).toFixed(1)}%`}
              onDelete={() => handleRemoveTarget(index)}
              color="primary"
              className="target-chip"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderConstraintsForm = () => (
    <Card className="constraints-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Constraints
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Min Weight"
              type="number"
              value={constraints.minWeight}
              onChange={handleConstraintChange('minWeight')}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Max Weight"
              type="number"
              value={constraints.maxWeight}
              onChange={handleConstraintChange('maxWeight')}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Max Turnover"
              type="number"
              value={constraints.maxTurnover}
              onChange={handleConstraintChange('maxTurnover')}
              inputProps={{ step: 0.01, min: 0 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Threshold"
              type="number"
              value={constraints.threshold}
              onChange={handleConstraintChange('threshold')}
              inputProps={{ step: 0.01, min: 0 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderMetrics = () => (
    <div className="metrics-grid">
      {rebalanceHistory.length > 0 && (
        <>
          <div className="metric-card">
            <Typography className="metric-title">Average Turnover</Typography>
            <Typography className="metric-value">
              {(
                rebalanceHistory.reduce(
                  (sum, item) => sum + item.metrics.turnover,
                  0
                ) / rebalanceHistory.length
              ).toFixed(2)}
              %
            </Typography>
          </div>
          <div className="metric-card">
            <Typography className="metric-title">Tracking Error</Typography>
            <Typography className="metric-value">
              {(
                rebalanceHistory.reduce(
                  (sum, item) => sum + item.metrics.tracking_error,
                  0
                ) / rebalanceHistory.length
              ).toFixed(2)}
              %
            </Typography>
          </div>
          <div className="metric-card">
            <Typography className="metric-title">Transaction Costs</Typography>
            <Typography className="metric-value">
              {(
                rebalanceHistory.reduce(
                  (sum, item) => sum + item.metrics.transaction_costs,
                  0
                ) / rebalanceHistory.length
              ).toFixed(2)}
              %
            </Typography>
          </div>
        </>
      )}
    </div>
  );

  const renderRebalanceHistory = () => (
    <Card className="history-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rebalance History
        </Typography>
        {renderMetrics()}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className="chart-container">
              <ResponsiveContainer>
                <LineChart data={rebalanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="metrics.turnover"
                    name="Turnover"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="metrics.tracking_error"
                    name="Tracking Error"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="chart-container">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={targets}
                    dataKey="weight"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {targets.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <div className="portfolio-rebalancing">
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Portfolio Rebalancing
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {portfolio.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderStrategyForm()}
        </Grid>
        <Grid item xs={12} md={8}>
          {renderTargetsForm()}
        </Grid>
        <Grid item xs={12}>
          {renderConstraintsForm()}
        </Grid>
        <Grid item xs={12}>
          {renderRebalanceHistory()}
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleRebalance}
          disabled={isRebalancing || targets.length === 0}
          startIcon={isRebalancing ? <CircularProgress size={20} /> : null}
          className="rebalance-button"
        >
          {isRebalancing ? 'Rebalancing...' : 'Rebalance Portfolio'}
        </Button>
      </Box>

      <Dialog open={showTargetDialog} onClose={() => setShowTargetDialog(false)}>
        <DialogTitle>Add Target Weight</DialogTitle>
        <DialogContent>
          <div className="target-weight-form">
            <TextField
              fullWidth
              label="Symbol"
              value={newTarget.symbol || ''}
              onChange={(e) => setNewTarget({ ...newTarget, symbol: e.target.value })}
            />
            <TextField
              fullWidth
              label="Weight"
              type="number"
              value={newTarget.weight || ''}
              onChange={(e) =>
                setNewTarget({ ...newTarget, weight: parseFloat(e.target.value) })
              }
              inputProps={{ step: 0.01, min: 0, max: 1 }}
              helperText="Enter weight as decimal (e.g., 0.25 for 25%)"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTargetDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddTarget}
            color="primary"
            disabled={!newTarget.symbol || !newTarget.weight}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default PortfolioRebalancing;
