// dashboardPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

const DashboardPage = () => {
  const theme = useTheme();

  // Sample data for the charts
  const portfolioData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [10000, 12000, 11500, 13500, 14200, 15800],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const tradingData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [300, -200, 500, 800, 400],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: window.innerWidth > 500, // Hide legend on very small screens
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          // Ensure y-axis labels are readable on mobile
          maxRotation: 0,
          font: {
            size: window.innerWidth < 500 ? 9 : 11
          }
        }
      },
      x: {
        ticks: {
          // Ensure x-axis labels are readable on mobile
          maxRotation: 45,
          font: {
            size: window.innerWidth < 500 ? 9 : 11
          }
        }
      }
    },
  };

  // Create portfolio summary card
  const createPortfolioSummaryCard = () => {
    return React.createElement(Card, { elevation: 3 },
      React.createElement(CardHeader, {
        title: "Portfolio Summary",
        action: React.createElement(IconButton, { "aria-label": "settings" },
          React.createElement(MoreVertIcon)
        )
      }),
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h4", gutterBottom: true },
          "$15,800.00"
        ),
        React.createElement(Box, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            color: 'success.main',
          }
        },
          React.createElement(TrendingUp, { sx: { mr: 1 } }),
          React.createElement(Typography, { variant: "body1" },
            "+5.8% this month"
          )
        ),
        React.createElement(Box, { sx: { height: { xs: 200, sm: 250 } } },
          React.createElement(Line, { data: portfolioData, options: chartOptions })
        )
      )
    );
  };

  // Create trading performance card
  const createTradingPerformanceCard = () => {
    return React.createElement(Card, { elevation: 3 },
      React.createElement(CardHeader, {
        title: "Trading Performance",
        action: React.createElement(IconButton, { "aria-label": "settings" },
          React.createElement(MoreVertIcon)
        )
      }),
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h4", gutterBottom: true },
          "$1,800.00"
        ),
        React.createElement(Box, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            color: 'success.main',
          }
        },
          React.createElement(TrendingUp, { sx: { mr: 1 } }),
          React.createElement(Typography, { variant: "body1" },
            "+12.3% this week"
          )
        ),
        React.createElement(Box, { sx: { height: { xs: 200, sm: 250 } } },
          React.createElement(Line, { data: tradingData, options: chartOptions })
        )
      )
    );
  };

  // Create account stats cards
  const createAccountStatsCards = () => {
    const stats = [
      { title: "Open Positions", value: "5", change: "+2", color: "primary.main" },
      { title: "Win Rate", value: "68%", change: "+3.5%", color: "success.main" },
      { title: "Drawdown", value: "8.2%", change: "-1.3%", color: "error.main" },
      { title: "Margin Level", value: "2,450%", change: "+150%", color: "warning.main" },
    ];

    return React.createElement(Grid, { container: true, spacing: 3 },
      stats.map((stat, index) => 
        React.createElement(Grid, { item: true, xs: 6, md: 3, key: index },
          React.createElement(Paper, {
            elevation: 2,
            sx: {
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 120, sm: 140 },
            }
          },
            React.createElement(Typography, { variant: "h6", color: "text.secondary", sx: { fontSize: { xs: '0.9rem', sm: '1.25rem' } } },
              stat.title
            ),
            React.createElement(Typography, {
              variant: "h4",
              component: "div",
              sx: { color: stat.color, my: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }
            }, stat.value),
            React.createElement(Typography, {
              variant: "body2",
              sx: {
                color: stat.change.startsWith('+') ? 'success.main' : 'error.main',
              }
            }, stat.change + " from last period")
          )
        )
      )
    );
  };

  // Create recent activity list
  const createRecentActivityList = () => {
    const activities = [
      { type: "Buy", asset: "EURUSD", amount: "0.5 lot", time: "10:32 AM", profit: "+$120" },
      { type: "Sell", asset: "GBPUSD", amount: "0.3 lot", time: "09:45 AM", profit: "-$50" },
      { type: "Deposit", asset: "USD", amount: "$1,000", time: "Yesterday", profit: "" },
      { type: "Buy", asset: "USDJPY", amount: "0.2 lot", time: "Yesterday", profit: "+$85" },
    ];

    return React.createElement(Card, { elevation: 3 },
      React.createElement(CardHeader, { title: "Recent Activity" }),
      React.createElement(CardContent, null,
        activities.map((activity, index) => 
          React.createElement(Box, {
            key: index,
            sx: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.5,
              borderBottom: index < activities.length - 1 ? 1 : 0,
              borderColor: 'divider',
            }
          },
            React.createElement(Box, null,
              React.createElement(Typography, { variant: "body1", fontWeight: "medium" },
                activity.type + " " + activity.asset
              ),
              React.createElement(Typography, { variant: "body2", color: "text.secondary" },
                activity.amount + " • " + activity.time
              )
            ),
            activity.profit && React.createElement(Typography, {
              variant: "body1",
              sx: {
                color: activity.profit.startsWith('+') ? 'success.main' : 'error.main',
                fontWeight: "medium"
              }
            }, activity.profit)
          )
        )
      )
    );
  };

  // Main component render
  return React.createElement(Box, { sx: { p: { xs: 2, sm: 3 } } },
    
    React.createElement(Grid, { container: true, spacing: { xs: 2, sm: 3 } },
      // Account stats
      React.createElement(Grid, { item: true, xs: 12 },
        createAccountStatsCards()
      ),
      
      // Portfolio summary
      React.createElement(Grid, { item: true, xs: 12, md: 8 },
        createPortfolioSummaryCard()
      ),
      
      // Recent activity
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        createRecentActivityList()
      ),
      
      // Trading performance
      React.createElement(Grid, { item: true, xs: 12 },
        createTradingPerformanceCard()
      ),
      

    )
  );
};

export default DashboardPage;
