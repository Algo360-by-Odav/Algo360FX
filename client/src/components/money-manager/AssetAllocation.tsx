import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AssetAllocation = observer(() => {
  const { moneyManagerStore } = useStores();
  const allocation = moneyManagerStore.getAssetAllocation();

  const pieData = allocation.map((item) => ({
    name: item.assetClass,
    value: item.current,
  }));

  const formatCurrency = (value: number | undefined) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'buy':
        return 'success';
      case 'sell':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Current Asset Allocation Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Asset Allocation
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#666"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {name} ({value}%)
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
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
            </Box>
          </Paper>
        </Grid>

        {/* Allocation Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Allocation Details
            </Typography>
            {allocation.map((asset) => (
              <Box key={asset.assetClass} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1">{asset.assetClass}</Typography>
                  <Typography variant="subtitle1">
                    {asset.current}% / {asset.target}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={asset.current}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: COLORS[allocation.indexOf(asset) % COLORS.length],
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color={asset.difference > 0 ? 'error.main' : 'success.main'}
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  {asset.difference > 0 ? 'Overweight' : asset.difference < 0 ? 'Underweight' : 'On Target'} by{' '}
                  {Math.abs(asset.difference)}%
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Rebalancing Recommendations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rebalancing Recommendations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Class</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Target</TableCell>
                    <TableCell align="right">Difference</TableCell>
                    <TableCell align="right">Required Action</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocation.map((asset) => (
                    <TableRow key={asset.assetClass}>
                      <TableCell component="th" scope="row">
                        {asset.assetClass}
                      </TableCell>
                      <TableCell align="right">{asset.current}%</TableCell>
                      <TableCell align="right">{asset.target}%</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            asset.difference > 0
                              ? 'error.main'
                              : asset.difference < 0
                              ? 'success.main'
                              : 'text.primary',
                        }}
                      >
                        {asset.difference > 0
                          ? `+${asset.difference}`
                          : asset.difference}
                        %
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={
                            asset.actionRequired === 'Hold'
                              ? 'text.secondary'
                              : getActionColor(asset.actionRequired)
                          }
                        >
                          {asset.actionRequired}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(asset.amount)}
                      </TableCell>
                      <TableCell align="right">
                        {asset.actionRequired !== 'Hold' && (
                          <Button
                            variant="contained"
                            color={getActionColor(asset.actionRequired)}
                            size="small"
                          >
                            {asset.actionRequired}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

