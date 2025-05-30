import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ScatterController,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ScatterController,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OptimizationParams {
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  riskTolerance: number;
}

const PortfolioOptimizer: React.FC = observer(() => {
  const { portfolioStore } = useStores();
  const [params, setParams] = useState<OptimizationParams>({
    timeframe: 'daily',
    startDate: '2024-01-01',
    endDate: '2025-03-22',
    initialBalance: 10000,
    riskTolerance: 50,
  });
  
  const handleParamChange = (param: keyof OptimizationParams) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setParams({
      ...params,
      [param]: event.target.value,
    });
  };

  const handleOptimize = async () => {
    // TODO: Implement optimization logic
    console.log('Optimizing with params:', params);
  };

  const efficientFrontierData = {
    datasets: [
      {
        label: 'Efficient Frontier',
        data: [
          { x: 10, y: 5 },
          { x: 15, y: 8 },
          { x: 20, y: 12 },
          { x: 25, y: 14 },
          { x: 30, y: 15 },
        ],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Efficient Frontier',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Risk (%)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Expected Return (%)',
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Optimization Parameters
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={params.timeframe}
                label="Timeframe"
                onChange={handleParamChange('timeframe')}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={params.startDate}
              onChange={handleParamChange('startDate')}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={params.endDate}
              onChange={handleParamChange('endDate')}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Initial Balance"
              value={params.initialBalance}
              onChange={handleParamChange('initialBalance')}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Risk Tolerance</Typography>
              <Slider
                value={params.riskTolerance}
                onChange={(_, value) =>
                  setParams({ ...params, riskTolerance: value as number })
                }
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleOptimize}
              sx={{ mt: 2 }}
            >
              Optimize Portfolio
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Efficient Frontier
            </Typography>
            <Box sx={{ height: 400 }}>
              <Scatter options={chartOptions} data={efficientFrontierData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PortfolioOptimizer;
