// InvestorDashboardJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Assessment,
  Timeline,
  AttachMoney,
  ShowChart,
  Info,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
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
import { useStores } from '../../stores/storeProviderJs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const InvestorDashboard = observer(() => {
  const { investorPortalStore } = useStores();
  
  // Ensure investorPortalStore exists and has required methods
  if (!investorPortalStore || !investorPortalStore.getProfile || !investorPortalStore.getAllocations) {
    console.warn('InvestorPortalStore is not properly initialized');
    return React.createElement(
      Box, 
      { sx: { p: 3 } },
      React.createElement(
        Typography, 
        { variant: 'h6', color: 'text.secondary' },
        'Investor Portal data is not available'
      )
    );
  }
  
  const profile = investorPortalStore.getProfile();
  const allocations = investorPortalStore.getAllocations();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Sample data for charts
  const monthlyPerformance = [
    { month: 'Jan', return: 4.5, benchmark: 3.2 },
    { month: 'Feb', return: 3.8, benchmark: 2.8 },
    { month: 'Mar', return: 5.2, benchmark: 4.1 },
    { month: 'Apr', return: 4.1, benchmark: 3.5 },
    { month: 'May', return: 6.3, benchmark: 4.8 },
    { month: 'Jun', return: 5.5, benchmark: 4.2 },
  ];

  const assetAllocation = [
    { name: 'Forex', value: 45 },
    { name: 'Commodities', value: 25 },
    { name: 'Indices', value: 20 },
    { name: 'Crypto', value: 10 },
  ];

  return React.createElement(
    Box,
    null,
    React.createElement(
      Grid,
      { container: true, spacing: 3 },
      [
        // Profile Overview
        React.createElement(
          Grid,
          { item: true, xs: 12, key: 'profile-overview' },
          React.createElement(
            Paper,
            { sx: { p: 3 } },
            React.createElement(
              Grid,
              { container: true, spacing: 3 },
              [
                React.createElement(
                  Grid,
                  { item: true, xs: 12, md: 6, key: 'profile-info' },
                  React.createElement(
                    Box,
                    { sx: { display: 'flex', alignItems: 'center' } },
                    [
                      React.createElement(
                        Avatar,
                        {
                          sx: { width: 64, height: 64, mr: 2, bgcolor: 'primary.main' },
                          key: 'profile-avatar'
                        },
                        profile.name[0]
                      ),
                      React.createElement(
                        Box,
                        { key: 'profile-details' },
                        [
                          React.createElement(
                            Typography,
                            { variant: 'h6', key: 'profile-name' },
                            profile.name
                          ),
                          React.createElement(
                            Box,
                            { sx: { display: 'flex', alignItems: 'center', mt: 0.5 }, key: 'profile-chips' },
                            [
                              React.createElement(
                                Chip,
                                {
                                  label: profile.type,
                                  size: 'small',
                                  color: 'primary',
                                  sx: { mr: 1 },
                                  key: 'profile-type-chip'
                                }
                              ),
                              React.createElement(
                                Chip,
                                {
                                  label: profile.riskProfile,
                                  size: 'small',
                                  color:
                                    profile.riskProfile === 'Conservative'
                                      ? 'success'
                                      : profile.riskProfile === 'Moderate'
                                      ? 'warning'
                                      : 'error',
                                  key: 'profile-risk-chip'
                                }
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ),
                React.createElement(
                  Grid,
                  { item: true, xs: 12, md: 6, key: 'profile-stats' },
                  React.createElement(
                    Grid,
                    { container: true, spacing: 2 },
                    [
                      React.createElement(
                        Grid,
                        { item: true, xs: 6, key: 'account-size' },
                        [
                          React.createElement(
                            Typography,
                            { variant: 'body2', color: 'text.secondary', key: 'account-size-label' },
                            'Account Size'
                          ),
                          React.createElement(
                            Typography,
                            { variant: 'h6', key: 'account-size-value' },
                            formatCurrency(profile.accountSize)
                          )
                        ]
                      ),
                      React.createElement(
                        Grid,
                        { item: true, xs: 6, key: 'ytd-return' },
                        [
                          React.createElement(
                            Typography,
                            { variant: 'body2', color: 'text.secondary', key: 'ytd-return-label' },
                            'YTD Return'
                          ),
                          React.createElement(
                            Typography,
                            {
                              variant: 'h6',
                              color: profile.performance.yearToDate > 0 ? 'success.main' : 'error.main',
                              key: 'ytd-return-value'
                            },
                            formatPercent(profile.performance.yearToDate)
                          )
                        ]
                      )
                    ]
                  )
                )
              ]
            )
          )
        ),

        // Performance Metrics
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 8, key: 'performance-metrics' },
          React.createElement(
            Paper,
            { sx: { p: 3 } },
            [
              React.createElement(
                Typography,
                { variant: 'h6', gutterBottom: true, key: 'performance-title' },
                'Performance Overview'
              ),
              React.createElement(
                Box,
                { sx: { height: 400 }, key: 'performance-chart' },
                React.createElement(
                  ResponsiveContainer,
                  null,
                  React.createElement(
                    LineChart,
                    {
                      data: monthlyPerformance,
                      margin: { top: 5, right: 30, left: 20, bottom: 5 }
                    },
                    [
                      React.createElement(CartesianGrid, { strokeDasharray: '3 3', key: 'chart-grid' }),
                      React.createElement(XAxis, { dataKey: 'month', key: 'chart-xaxis' }),
                      React.createElement(YAxis, { key: 'chart-yaxis' }),
                      React.createElement(Tooltip, { key: 'chart-tooltip' }),
                      React.createElement(Legend, { key: 'chart-legend' }),
                      React.createElement(
                        Line,
                        {
                          type: 'monotone',
                          dataKey: 'return',
                          stroke: '#8884d8',
                          name: 'Return %',
                          key: 'chart-line-return'
                        }
                      ),
                      React.createElement(
                        Line,
                        {
                          type: 'monotone',
                          dataKey: 'benchmark',
                          stroke: '#82ca9d',
                          name: 'Benchmark %',
                          key: 'chart-line-benchmark'
                        }
                      )
                    ]
                  )
                )
              )
            ]
          )
        ),

        // Asset Allocation
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 4, key: 'asset-allocation' },
          React.createElement(
            Paper,
            { sx: { p: 3 } },
            [
              React.createElement(
                Typography,
                { variant: 'h6', gutterBottom: true, key: 'allocation-title' },
                'Asset Allocation'
              ),
              React.createElement(
                Box,
                { sx: { height: 400 }, key: 'allocation-chart' },
                React.createElement(
                  ResponsiveContainer,
                  null,
                  React.createElement(
                    PieChart,
                    null,
                    [
                      React.createElement(
                        Pie,
                        {
                          data: assetAllocation,
                          cx: '50%',
                          cy: '50%',
                          labelLine: true,
                          label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`,
                          outerRadius: 100,
                          fill: '#8884d8',
                          dataKey: 'value',
                          key: 'pie-chart'
                        },
                        assetAllocation.map((entry, index) =>
                          React.createElement(Cell, {
                            key: `cell-${index}`,
                            fill: COLORS[index % COLORS.length]
                          })
                        )
                      ),
                      React.createElement(Tooltip, { key: 'pie-tooltip' }),
                      React.createElement(Legend, { key: 'pie-legend' })
                    ]
                  )
                )
              )
            ]
          )
        ),

        // Portfolio Stats
        React.createElement(
          Grid,
          { item: true, xs: 12, key: 'portfolio-stats' },
          React.createElement(
            Grid,
            { container: true, spacing: 3 },
            [
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 3, key: 'portfolio-value' },
                React.createElement(
                  Card,
                  null,
                  React.createElement(
                    CardContent,
                    null,
                    [
                      React.createElement(
                        Typography,
                        { color: 'textSecondary', gutterBottom: true, key: 'portfolio-value-label' },
                        'Total Portfolio Value'
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'h5', key: 'portfolio-value-amount' },
                        formatCurrency(profile.portfolio.totalValue)
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'body2', color: 'text.secondary', key: 'portfolio-value-desc' },
                        'Total Investments'
                      )
                    ]
                  )
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 3, key: 'cash-balance' },
                React.createElement(
                  Card,
                  null,
                  React.createElement(
                    CardContent,
                    null,
                    [
                      React.createElement(
                        Typography,
                        { color: 'textSecondary', gutterBottom: true, key: 'cash-balance-label' },
                        'Cash Balance'
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'h5', key: 'cash-balance-amount' },
                        formatCurrency(profile.portfolio.cashBalance)
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'body2', color: 'text.secondary', key: 'cash-balance-desc' },
                        'Available for Investment'
                      )
                    ]
                  )
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 3, key: 'margin-used' },
                React.createElement(
                  Card,
                  null,
                  React.createElement(
                    CardContent,
                    null,
                    [
                      React.createElement(
                        Typography,
                        { color: 'textSecondary', gutterBottom: true, key: 'margin-used-label' },
                        'Margin Utilized'
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'h5', key: 'margin-used-amount' },
                        formatCurrency(profile.portfolio.marginUsed)
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'body2', color: 'text.secondary', key: 'margin-used-desc' },
                        'Leveraged Positions'
                      )
                    ]
                  )
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 3, key: 'open-positions' },
                React.createElement(
                  Card,
                  null,
                  React.createElement(
                    CardContent,
                    null,
                    [
                      React.createElement(
                        Typography,
                        { color: 'textSecondary', gutterBottom: true, key: 'open-positions-label' },
                        'Open Positions'
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'h5', key: 'open-positions-count' },
                        profile.portfolio.openPositions
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'body2', color: 'text.secondary', key: 'open-positions-desc' },
                        'Active Investments'
                      )
                    ]
                  )
                )
              )
            ]
          )
        ),

        // Recent Activity
        React.createElement(
          Grid,
          { item: true, xs: 12, key: 'recent-activity' },
          React.createElement(
            Paper,
            { sx: { p: 3 } },
            [
              React.createElement(
                Typography,
                { variant: 'h6', gutterBottom: true, key: 'activity-title' },
                'Recent Activity'
              ),
              React.createElement(
                Grid,
                { container: true, spacing: 2, key: 'activity-list' },
                allocations.map((allocation) =>
                  React.createElement(
                    Grid,
                    { item: true, xs: 12, key: allocation.id },
                    React.createElement(
                      Box,
                      {
                        sx: {
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                        }
                      },
                      React.createElement(
                        Grid,
                        { container: true, spacing: 2, alignItems: 'center' },
                        [
                          React.createElement(
                            Grid,
                            { item: true, xs: 12, md: 3, key: `allocation-name-${allocation.id}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'subtitle1', key: `allocation-title-${allocation.id}` },
                                investorPortalStore.getOpportunityById(allocation.opportunityId)?.name || 'Unknown Opportunity'
                              ),
                              React.createElement(
                                Typography,
                                { variant: 'body2', color: 'text.secondary', key: `allocation-amount-${allocation.id}` },
                                `${formatCurrency(allocation.amount)} Invested`
                              )
                            ]
                          ),
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, md: 2, key: `allocation-value-${allocation.id}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'body2', color: 'text.secondary', key: `allocation-value-label-${allocation.id}` },
                                'Current Value'
                              ),
                              React.createElement(
                                Typography,
                                { variant: 'subtitle1', key: `allocation-value-amount-${allocation.id}` },
                                formatCurrency(allocation.performance.currentValue)
                              )
                            ]
                          ),
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, md: 2, key: `allocation-return-${allocation.id}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'body2', color: 'text.secondary', key: `allocation-return-label-${allocation.id}` },
                                'Total Return'
                              ),
                              React.createElement(
                                Typography,
                                {
                                  variant: 'subtitle1',
                                  color: allocation.performance.totalReturn > 0 ? 'success.main' : 'error.main',
                                  key: `allocation-return-value-${allocation.id}`
                                },
                                formatPercent(allocation.performance.totalReturn)
                              )
                            ]
                          ),
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, md: 2, key: `allocation-pnl-${allocation.id}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'body2', color: 'text.secondary', key: `allocation-pnl-label-${allocation.id}` },
                                'Unrealized P/L'
                              ),
                              React.createElement(
                                Typography,
                                {
                                  variant: 'subtitle1',
                                  color: allocation.performance.unrealizedPnL > 0 ? 'success.main' : 'error.main',
                                  key: `allocation-pnl-value-${allocation.id}`
                                },
                                formatCurrency(allocation.performance.unrealizedPnL)
                              )
                            ]
                          ),
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, md: 3, key: `allocation-actions-${allocation.id}` },
                            React.createElement(
                              Box,
                              { sx: { display: 'flex', justifyContent: 'flex-end' } },
                              [
                                React.createElement(
                                  Button,
                                  {
                                    variant: 'outlined',
                                    size: 'small',
                                    startIcon: React.createElement(Info),
                                    sx: { mr: 1 },
                                    key: `allocation-details-${allocation.id}`
                                  },
                                  'Details'
                                ),
                                React.createElement(
                                  Button,
                                  {
                                    variant: 'contained',
                                    size: 'small',
                                    startIcon: React.createElement(TrendingUp),
                                    key: `allocation-manage-${allocation.id}`
                                  },
                                  'Manage'
                                )
                              ]
                            )
                          )
                        ]
                      )
                    )
                  )
                )
              )
            ]
          )
        )
      ]
    )
  );
});

export default InvestorDashboard;
