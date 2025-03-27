import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage: React.FC = () => {
  const theme = useTheme();

  // Sample data for the charts
  const portfolioData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [10000, 12000, 11500, 13000, 14500, 15000],
        fill: true,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const performanceMetrics = [
    {
      title: 'Total Balance',
      value: '$15,234.56',
      change: '+2.45%',
      positive: true,
    },
    {
      title: 'Today\'s P/L',
      value: '$234.56',
      change: '+1.23%',
      positive: true,
    },
    {
      title: 'Open Positions',
      value: '8',
      change: '-2',
      positive: false,
    },
    {
      title: 'Win Rate',
      value: '68%',
      change: '+3%',
      positive: true,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#0A192F', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Performance Metrics */}
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: '#1A2233', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {metric.title}
                </Typography>
                <Typography variant="h4" sx={{ my: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {metric.positive ? (
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: metric.positive ? 'success.main' : 'error.main' }}
                  >
                    {metric.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Portfolio Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: '#1A2233', color: 'white', p: 2 }}>
            <CardHeader
              title="Portfolio Performance"
              action={
                <IconButton sx={{ color: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line data={portfolioData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1A2233', color: 'white' }}>
            <CardHeader
              title="Recent Activity"
              action={
                <IconButton sx={{ color: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((_, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      {index === 0 ? 'Buy Order Executed' : index === 1 ? 'Take Profit Hit' : 'Stop Loss Hit'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {index === 0
                        ? 'EUR/USD @ 1.0923'
                        : index === 1
                        ? 'GBP/JPY @ 182.543'
                        : 'USD/CAD @ 1.3456'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
