// portfolioPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh as RefreshIcon,
  AccountBalance as AccountIcon,
  ShowChart as ChartIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import PortfolioAnalytics from '../components/portfolio/PortfolioAnalytics';

// Mock data
const mockPortfolioData = {
  summary: {
    totalValue: 125750.25,
    totalPnl: 12575.50,
    totalPnlPercentage: 11.12,
    cashBalance: 25750.25,
    investedAmount: 100000,
    numberOfAssets: 8,
  },
  assets: [
    {
      symbol: 'EURUSD',
      allocation: 25.5,
      currentPrice: 1.0925,
      averagePrice: 1.0850,
      quantity: 100000,
      pnl: 750.00,
      pnlPercentage: 6.89,
    },
    {
      symbol: 'GBPUSD',
      allocation: 20.3,
      currentPrice: 1.2725,
      averagePrice: 1.2650,
      quantity: 75000,
      pnl: 562.50,
      pnlPercentage: 5.93,
    },
    {
      symbol: 'USDJPY',
      allocation: 18.7,
      currentPrice: 148.35,
      averagePrice: 147.85,
      quantity: 50000,
      pnl: -250.00,
      pnlPercentage: -3.33,
    },
    {
      symbol: 'AUDUSD',
      allocation: 15.2,
      currentPrice: 0.6585,
      averagePrice: 0.6525,
      quantity: 60000,
      pnl: 360.00,
      pnlPercentage: 4.80,
    },
  ],
  chartData: [
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-08', value: 102500 },
    { date: '2024-01-15', value: 108750 },
    { date: '2024-01-22', value: 115000 },
    { date: '2024-01-29', value: 125750 },
  ],
  dailyReturns: [
    { range: '-2% to -1%', frequency: 5 },
    { range: '-1% to 0%', frequency: 15 },
    { range: '0% to 1%', frequency: 20 },
    { range: '1% to 2%', frequency: 8 },
    { range: '2% to 3%', frequency: 2 },
  ],
  riskMetrics: {
    sharpeRatio: 1.85,
    volatility: 12.5,
    beta: 0.92,
    alpha: 3.2,
    maxDrawdown: -15.3,
    informationRatio: 0.75,
    sortinoRatio: 2.1,
    trackingError: 4.2,
  },
  correlations: [
    { asset1: 'EURUSD', asset2: 'GBPUSD', correlation: 0.85 },
    { asset1: 'EURUSD', asset2: 'USDJPY', correlation: -0.32 },
    { asset1: 'GBPUSD', asset2: 'USDJPY', correlation: -0.28 },
    { asset1: 'AUDUSD', asset2: 'EURUSD', correlation: 0.65 },
  ],
  performance: {
    daily: 1.25,
    weekly: 3.75,
    monthly: 11.12,
    quarterly: 15.8,
    ytd: 25.75,
    yearly: 32.5,
  }
};

const PortfolioPage = observer(() => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return React.createElement(Container, { 
    maxWidth: "lg", 
    sx: { mt: 4, mb: 4 } 
  }, [
    // Empty header with spacing
    React.createElement(Box, { 
      key: "header",
      sx: { mb: 4 } 
    }),

    // Main Grid
    React.createElement(Grid, { 
      key: "main-grid",
      container: true, 
      spacing: 3 
    }, [
      // Summary Cards
      React.createElement(Grid, { key: "summary-grid", item: true, xs: 12 }, 
        React.createElement(Grid, { container: true, spacing: 2 }, [
          // Total Value Card
          React.createElement(Grid, { key: "total-value", item: true, xs: 12, sm: 6, md: 3 }, 
            React.createElement(Card, { sx: { height: '100%' } }, 
              React.createElement(CardContent, null, [
                React.createElement(Box, { 
                  key: "total-value-box",
                  sx: { display: 'flex', alignItems: 'center', mb: 1 } 
                }, [
                  React.createElement(AccountIcon, { 
                    key: "account-icon",
                    sx: { mr: 1, color: 'primary.main' } 
                  }),
                  React.createElement(Typography, { 
                    key: "total-value-title",
                    variant: "h6", 
                    component: "div" 
                  }, "Total Value")
                ]),
                React.createElement(Typography, { 
                  key: "total-value-amount",
                  variant: "h4", 
                  component: "div", 
                  sx: { fontWeight: 'bold' } 
                }, formatCurrency(mockPortfolioData.summary.totalValue)),
                React.createElement(Typography, { 
                  key: "total-value-invested",
                  variant: "body2", 
                  color: "text.secondary" 
                }, `Invested: ${formatCurrency(mockPortfolioData.summary.investedAmount)}`)
              ])
            )
          ),

          // Total P&L Card
          React.createElement(Grid, { key: "total-pnl", item: true, xs: 12, sm: 6, md: 3 }, 
            React.createElement(Card, { sx: { height: '100%' } }, 
              React.createElement(CardContent, null, [
                React.createElement(Box, { 
                  key: "total-pnl-box",
                  sx: { display: 'flex', alignItems: 'center', mb: 1 } 
                }, [
                  React.createElement(MoneyIcon, { 
                    key: "money-icon",
                    sx: { mr: 1, color: 'primary.main' } 
                  }),
                  React.createElement(Typography, { 
                    key: "total-pnl-title",
                    variant: "h6", 
                    component: "div" 
                  }, "Total P&L")
                ]),
                React.createElement(Typography, { 
                  key: "total-pnl-amount",
                  variant: "h4", 
                  component: "div", 
                  sx: { 
                    fontWeight: 'bold',
                    color: mockPortfolioData.summary.totalPnl >= 0 ? 'success.main' : 'error.main',
                  } 
                }, formatCurrency(mockPortfolioData.summary.totalPnl)),
                React.createElement(Box, { 
                  key: "total-pnl-percentage",
                  sx: { display: 'flex', alignItems: 'center' } 
                }, [
                  mockPortfolioData.summary.totalPnlPercentage >= 0 
                    ? React.createElement(TrendingUp, { 
                        key: "trend-up",
                        sx: { color: 'success.main', mr: 0.5 } 
                      })
                    : React.createElement(TrendingDown, { 
                        key: "trend-down",
                        sx: { color: 'error.main', mr: 0.5 } 
                      }),
                  React.createElement(Typography, { 
                    key: "pnl-percentage",
                    variant: "body2", 
                    sx: { 
                      color: mockPortfolioData.summary.totalPnlPercentage >= 0 
                        ? 'success.main' 
                        : 'error.main',
                    } 
                  }, formatPercentage(mockPortfolioData.summary.totalPnlPercentage))
                ])
              ])
            )
          ),

          // Cash Balance Card
          React.createElement(Grid, { key: "cash-balance", item: true, xs: 12, sm: 6, md: 3 }, 
            React.createElement(Card, { sx: { height: '100%' } }, 
              React.createElement(CardContent, null, [
                React.createElement(Box, { 
                  key: "cash-balance-box",
                  sx: { display: 'flex', alignItems: 'center', mb: 1 } 
                }, [
                  React.createElement(MoneyIcon, { 
                    key: "cash-icon",
                    sx: { mr: 1, color: 'primary.main' } 
                  }),
                  React.createElement(Typography, { 
                    key: "cash-balance-title",
                    variant: "h6", 
                    component: "div" 
                  }, "Cash Balance")
                ]),
                React.createElement(Typography, { 
                  key: "cash-balance-amount",
                  variant: "h4", 
                  component: "div", 
                  sx: { fontWeight: 'bold' } 
                }, formatCurrency(mockPortfolioData.summary.cashBalance)),
                React.createElement(Typography, { 
                  key: "cash-balance-percentage",
                  variant: "body2", 
                  color: "text.secondary" 
                }, `${(mockPortfolioData.summary.cashBalance / mockPortfolioData.summary.totalValue * 100).toFixed(2)}% of portfolio`)
              ])
            )
          ),

          // Performance Card
          React.createElement(Grid, { key: "performance", item: true, xs: 12, sm: 6, md: 3 }, 
            React.createElement(Card, { sx: { height: '100%' } }, 
              React.createElement(CardContent, null, [
                React.createElement(Box, { 
                  key: "performance-box",
                  sx: { display: 'flex', alignItems: 'center', mb: 1 } 
                }, [
                  React.createElement(TimelineIcon, { 
                    key: "timeline-icon",
                    sx: { mr: 1, color: 'primary.main' } 
                  }),
                  React.createElement(Typography, { 
                    key: "performance-title",
                    variant: "h6", 
                    component: "div" 
                  }, "Performance")
                ]),
                React.createElement(Box, { 
                  key: "performance-metrics",
                  sx: { display: 'flex', justifyContent: 'space-between', mb: 0.5 } 
                }, [
                  React.createElement(Typography, { 
                    key: "daily-label",
                    variant: "body2", 
                    color: "text.secondary" 
                  }, "Daily:"),
                  React.createElement(Typography, { 
                    key: "daily-value",
                    variant: "body2", 
                    sx: { 
                      fontWeight: 'medium',
                      color: mockPortfolioData.performance.daily >= 0 ? 'success.main' : 'error.main',
                    } 
                  }, formatPercentage(mockPortfolioData.performance.daily))
                ]),
                React.createElement(Box, { 
                  key: "performance-weekly",
                  sx: { display: 'flex', justifyContent: 'space-between', mb: 0.5 } 
                }, [
                  React.createElement(Typography, { 
                    key: "weekly-label",
                    variant: "body2", 
                    color: "text.secondary" 
                  }, "Weekly:"),
                  React.createElement(Typography, { 
                    key: "weekly-value",
                    variant: "body2", 
                    sx: { 
                      fontWeight: 'medium',
                      color: mockPortfolioData.performance.weekly >= 0 ? 'success.main' : 'error.main',
                    } 
                  }, formatPercentage(mockPortfolioData.performance.weekly))
                ]),
                React.createElement(Box, { 
                  key: "performance-monthly",
                  sx: { display: 'flex', justifyContent: 'space-between' } 
                }, [
                  React.createElement(Typography, { 
                    key: "monthly-label",
                    variant: "body2", 
                    color: "text.secondary" 
                  }, "Monthly:"),
                  React.createElement(Typography, { 
                    key: "monthly-value",
                    variant: "body2", 
                    sx: { 
                      fontWeight: 'medium',
                      color: mockPortfolioData.performance.monthly >= 0 ? 'success.main' : 'error.main',
                    } 
                  }, formatPercentage(mockPortfolioData.performance.monthly))
                ])
              ])
            )
          )
        ])
      ),

      // Portfolio Chart
      React.createElement(Grid, { key: "chart-grid", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "chart-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Portfolio Value Over Time"),
            React.createElement(Box, { 
              key: "chart-box",
              sx: { height: 300, width: '100%' } 
            }, 
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, 
                React.createElement(LineChart, { data: mockPortfolioData.chartData }, [
                  React.createElement(CartesianGrid, { 
                    key: "grid",
                    strokeDasharray: "3 3" 
                  }),
                  React.createElement(XAxis, { 
                    key: "x-axis",
                    dataKey: "date",
                    tickFormatter: (value) => new Date(value).toLocaleDateString()
                  }),
                  React.createElement(YAxis, { 
                    key: "y-axis",
                    tickFormatter: (value) => formatCurrency(value)
                  }),
                  React.createElement(ChartTooltip, { 
                    key: "tooltip",
                    formatter: (value) => [formatCurrency(value), 'Portfolio Value'],
                    labelFormatter: (label) => new Date(label).toLocaleDateString()
                  }),
                  React.createElement(Line, { 
                    key: "line",
                    type: "monotone",
                    dataKey: "value",
                    stroke: theme.palette.primary.main,
                    strokeWidth: 2,
                    dot: false
                  })
                ])
              )
            )
          ])
        )
      ),

      // Assets Table
      React.createElement(Grid, { key: "assets-grid", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "assets-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Assets"),
            React.createElement(TableContainer, { key: "table-container" }, 
              React.createElement(Table, null, [
                React.createElement(TableHead, { key: "table-head" }, 
                  React.createElement(TableRow, null, [
                    React.createElement(TableCell, { key: "symbol-header" }, "Symbol"),
                    React.createElement(TableCell, { key: "allocation-header", align: "right" }, "Allocation"),
                    React.createElement(TableCell, { key: "current-price-header", align: "right" }, "Current Price"),
                    React.createElement(TableCell, { key: "avg-price-header", align: "right" }, "Average Price"),
                    React.createElement(TableCell, { key: "quantity-header", align: "right" }, "Quantity"),
                    React.createElement(TableCell, { key: "pnl-header", align: "right" }, "P&L"),
                    React.createElement(TableCell, { key: "pnl-percent-header", align: "right" }, "P&L %")
                  ])
                ),
                React.createElement(TableBody, { key: "table-body" }, 
                  mockPortfolioData.assets.map((asset) => 
                    React.createElement(TableRow, { key: asset.symbol }, [
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-symbol`,
                        component: "th", 
                        scope: "row" 
                      }, asset.symbol),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-allocation`,
                        align: "right" 
                      }, formatPercentage(asset.allocation)),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-current-price`,
                        align: "right" 
                      }, asset.currentPrice.toFixed(4)),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-avg-price`,
                        align: "right" 
                      }, asset.averagePrice.toFixed(4)),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-quantity`,
                        align: "right" 
                      }, asset.quantity.toLocaleString()),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-pnl`,
                        align: "right",
                        sx: {
                          color: asset.pnl >= 0 ? 'success.main' : 'error.main',
                        }
                      }, formatCurrency(asset.pnl)),
                      React.createElement(TableCell, { 
                        key: `${asset.symbol}-pnl-percent`,
                        align: "right",
                        sx: {
                          color: asset.pnlPercentage >= 0 ? 'success.main' : 'error.main',
                        }
                      }, formatPercentage(asset.pnlPercentage))
                    ])
                  )
                )
              ])
            ),
            React.createElement(TablePagination, {
              key: "table-pagination",
              rowsPerPageOptions: [5, 10, 25],
              component: "div",
              count: mockPortfolioData.assets.length,
              rowsPerPage: rowsPerPage,
              page: page,
              onPageChange: (_, newPage) => setPage(newPage),
              onRowsPerPageChange: (event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }
            })
          ])
        )
      )
    ]),

    // Bottom buttons
    React.createElement(Box, { 
      key: "bottom-buttons",
      sx: { 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4, 
        mb: 2 
      } 
    }, [
      React.createElement(Button, {
        key: "refresh-btn",
        variant: "contained",
        color: "primary",
        startIcon: React.createElement(RefreshIcon),
        onClick: handleRefresh,
        disabled: loading,
        sx: { mr: 2 }
      }, "Refresh"),
      React.createElement(Button, {
        key: "analytics-btn",
        variant: "outlined",
        color: "primary",
        startIcon: React.createElement(AnalyticsIcon),
        onClick: () => setAnalyticsOpen(true)
      }, "Analytics")
    ]),

    // Portfolio Analytics Dialog
    React.createElement(PortfolioAnalytics, {
      key: "portfolio-analytics",
      open: analyticsOpen,
      onClose: () => setAnalyticsOpen(false),
      portfolioData: mockPortfolioData
    })
  ]);
});

export default PortfolioPage;
