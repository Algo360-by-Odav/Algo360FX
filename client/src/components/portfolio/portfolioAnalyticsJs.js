// portfolioAnalyticsJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return React.createElement(
    'div',
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `analytics-tabpanel-${index}`,
      'aria-labelledby': `analytics-tab-${index}`,
      ...other
    },
    value === index && React.createElement(Box, { sx: { p: 3 } }, children)
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PortfolioAnalytics = ({ open, onClose, portfolioData }) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('1M');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calculateRiskMetrics = () => {
    return {
      sharpeRatio: 1.85,
      volatility: 12.5,
      beta: 0.92,
      alpha: 3.2,
      maxDrawdown: -15.3,
      informationRatio: 0.75,
      sortinoRatio: 2.1,
      trackingError: 4.2,
    };
  };

  const calculateCorrelations = () => {
    return [
      { asset1: 'EURUSD', asset2: 'GBPUSD', correlation: 0.85 },
      { asset1: 'EURUSD', asset2: 'USDJPY', correlation: -0.32 },
      { asset1: 'GBPUSD', asset2: 'USDJPY', correlation: -0.28 },
      { asset1: 'AUDUSD', asset2: 'EURUSD', correlation: 0.65 },
    ];
  };

  const generatePerformanceReport = () => {
    // Implement report generation logic
    console.log('Generating performance report...');
  };

  const handleExport = (format) => {
    // Implement export logic
    console.log(`Exporting as ${format}...`);
  };

  const renderPerformanceAnalysis = () => {
    return React.createElement(Grid, { container: true, spacing: 3 }, [
      // Time Range Selector
      React.createElement(Grid, { key: "time-range", item: true, xs: 12 }, 
        React.createElement(FormControl, { sx: { minWidth: 200, mb: 2 } }, [
          React.createElement(InputLabel, { key: "time-range-label" }, "Time Range"),
          React.createElement(
            Select,
            {
              key: "time-range-select",
              value: timeRange,
              label: "Time Range",
              onChange: (e) => setTimeRange(e.target.value)
            },
            [
              React.createElement(MenuItem, { key: "1W", value: "1W" }, "1 Week"),
              React.createElement(MenuItem, { key: "1M", value: "1M" }, "1 Month"),
              React.createElement(MenuItem, { key: "3M", value: "3M" }, "3 Months"),
              React.createElement(MenuItem, { key: "6M", value: "6M" }, "6 Months"),
              React.createElement(MenuItem, { key: "1Y", value: "1Y" }, "1 Year"),
              React.createElement(MenuItem, { key: "YTD", value: "YTD" }, "Year to Date"),
            ]
          )
        ])
      ),
      
      // Portfolio Value Chart
      React.createElement(Grid, { key: "portfolio-value", item: true, xs: 12 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "chart-title", variant: "h6", gutterBottom: true }, "Portfolio Value Over Time"),
            React.createElement(ResponsiveContainer, { key: "chart-container", width: "100%", height: 300 },
              React.createElement(LineChart, { data: portfolioData?.chartData || [] }, [
                React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                React.createElement(XAxis, { key: "x-axis", dataKey: "date" }),
                React.createElement(YAxis, { key: "y-axis" }),
                React.createElement(Tooltip, { key: "tooltip" }),
                React.createElement(Legend, { key: "legend" }),
                React.createElement(Line, { 
                  key: "line", 
                  type: "monotone", 
                  dataKey: "value", 
                  stroke: "#8884d8" 
                })
              ])
            )
          ])
        )
      ),
      
      // Daily Returns Distribution
      React.createElement(Grid, { key: "daily-returns", item: true, xs: 12, md: 6 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "returns-title", variant: "h6", gutterBottom: true }, "Daily Returns Distribution"),
            React.createElement(ResponsiveContainer, { key: "returns-container", width: "100%", height: 250 },
              React.createElement(BarChart, { data: portfolioData?.returnsData || [] }, [
                React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                React.createElement(XAxis, { key: "x-axis", dataKey: "range" }),
                React.createElement(YAxis, { key: "y-axis" }),
                React.createElement(Tooltip, { key: "tooltip" }),
                React.createElement(Bar, { 
                  key: "bar", 
                  dataKey: "frequency", 
                  fill: "#8884d8" 
                })
              ])
            )
          ])
        )
      ),
      
      // Asset Allocation
      React.createElement(Grid, { key: "asset-allocation", item: true, xs: 12, md: 6 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "allocation-title", variant: "h6", gutterBottom: true }, "Asset Allocation"),
            React.createElement(ResponsiveContainer, { key: "allocation-container", width: "100%", height: 250 },
              React.createElement(PieChart, null, 
                React.createElement(Pie, { 
                  data: portfolioData?.allocationData || [], 
                  dataKey: "value", 
                  nameKey: "asset", 
                  cx: "50%", 
                  cy: "50%", 
                  outerRadius: 80, 
                  label: true 
                }, (portfolioData?.allocationData || []).map((entry, index) => 
                  React.createElement(Cell, { 
                    key: `cell-${index}`, 
                    fill: COLORS[index % COLORS.length] 
                  })
                ))
              )
            )
          ])
        )
      )
    ]);
  };

  const renderRiskAnalysis = () => {
    const riskMetrics = calculateRiskMetrics();
    
    return React.createElement(Grid, { container: true, spacing: 3 }, [
      // Risk Metrics
      React.createElement(Grid, { key: "risk-metrics", item: true, xs: 12, md: 6 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "metrics-title", variant: "h6", gutterBottom: true }, "Key Risk Metrics"),
            React.createElement(TableContainer, { key: "metrics-table" },
              React.createElement(Table, null, 
                React.createElement(TableBody, null, [
                  React.createElement(TableRow, { key: "sharpe" }, [
                    React.createElement(TableCell, { key: "sharpe-label" }, "Sharpe Ratio"),
                    React.createElement(TableCell, { key: "sharpe-value", align: "right" }, riskMetrics.sharpeRatio)
                  ]),
                  React.createElement(TableRow, { key: "volatility" }, [
                    React.createElement(TableCell, { key: "volatility-label" }, "Volatility"),
                    React.createElement(TableCell, { key: "volatility-value", align: "right" }, `${riskMetrics.volatility}%`)
                  ]),
                  React.createElement(TableRow, { key: "beta" }, [
                    React.createElement(TableCell, { key: "beta-label" }, "Beta"),
                    React.createElement(TableCell, { key: "beta-value", align: "right" }, riskMetrics.beta)
                  ]),
                  React.createElement(TableRow, { key: "alpha" }, [
                    React.createElement(TableCell, { key: "alpha-label" }, "Alpha"),
                    React.createElement(TableCell, { key: "alpha-value", align: "right" }, `${riskMetrics.alpha}%`)
                  ]),
                  React.createElement(TableRow, { key: "drawdown" }, [
                    React.createElement(TableCell, { key: "drawdown-label" }, "Max Drawdown"),
                    React.createElement(TableCell, { key: "drawdown-value", align: "right" }, `${riskMetrics.maxDrawdown}%`)
                  ])
                ])
              )
            )
          ])
        )
      ),
      
      // Advanced Risk Metrics
      React.createElement(Grid, { key: "advanced-metrics", item: true, xs: 12, md: 6 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "advanced-title", variant: "h6", gutterBottom: true }, "Advanced Risk Metrics"),
            React.createElement(TableContainer, { key: "advanced-table" },
              React.createElement(Table, null, 
                React.createElement(TableBody, null, [
                  React.createElement(TableRow, { key: "info-ratio" }, [
                    React.createElement(TableCell, { key: "info-label" }, "Information Ratio"),
                    React.createElement(TableCell, { key: "info-value", align: "right" }, riskMetrics.informationRatio)
                  ]),
                  React.createElement(TableRow, { key: "sortino" }, [
                    React.createElement(TableCell, { key: "sortino-label" }, "Sortino Ratio"),
                    React.createElement(TableCell, { key: "sortino-value", align: "right" }, riskMetrics.sortinoRatio)
                  ]),
                  React.createElement(TableRow, { key: "tracking" }, [
                    React.createElement(TableCell, { key: "tracking-label" }, "Tracking Error"),
                    React.createElement(TableCell, { key: "tracking-value", align: "right" }, `${riskMetrics.trackingError}%`)
                  ])
                ])
              )
            )
          ])
        )
      )
    ]);
  };

  const renderCorrelationAnalysis = () => {
    const correlations = calculateCorrelations();
    
    return React.createElement(Grid, { container: true, spacing: 3 },
      React.createElement(Grid, { key: "correlations", item: true, xs: 12 },
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { key: "corr-title", variant: "h6", gutterBottom: true }, "Asset Correlations"),
            React.createElement(TableContainer, { key: "corr-table" },
              React.createElement(Table, null, [
                React.createElement(TableHead, { key: "corr-head" },
                  React.createElement(TableRow, null, [
                    React.createElement(TableCell, { key: "asset1" }, "Asset 1"),
                    React.createElement(TableCell, { key: "asset2" }, "Asset 2"),
                    React.createElement(TableCell, { key: "corr", align: "right" }, "Correlation")
                  ])
                ),
                React.createElement(TableBody, { key: "corr-body" },
                  correlations.map((correlation, index) => 
                    React.createElement(TableRow, { key: index }, [
                      React.createElement(TableCell, { key: `asset1-${index}` }, correlation.asset1),
                      React.createElement(TableCell, { key: `asset2-${index}` }, correlation.asset2),
                      React.createElement(TableCell, { key: `corr-${index}`, align: "right" }, 
                        correlation.correlation.toFixed(2)
                      )
                    ])
                  )
                )
              ])
            )
          ])
        )
      )
    );
  };

  return React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    maxWidth: "lg",
    fullWidth: true
  }, [
    // Dialog Title with Actions
    React.createElement(DialogTitle, { key: "dialog-title" },
      React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        "Portfolio Analytics",
        React.createElement(Box, { key: "action-buttons" }, [
          React.createElement(IconButton, { 
            key: "export-pdf", 
            onClick: () => handleExport('pdf'), 
            title: "Export as PDF" 
          }, React.createElement(DownloadIcon)),
          React.createElement(IconButton, { 
            key: "export-csv", 
            onClick: () => handleExport('csv'), 
            title: "Export as CSV" 
          }, React.createElement(ShareIcon)),
          React.createElement(IconButton, { 
            key: "print", 
            onClick: generatePerformanceReport, 
            title: "Print Report" 
          }, React.createElement(PrintIcon)),
          React.createElement(IconButton, { 
            key: "close", 
            onClick: onClose 
          }, React.createElement(CloseIcon))
        ])
      ])
    ),
    
    // Dialog Content with Tabs
    React.createElement(DialogContent, { key: "dialog-content" }, [
      React.createElement(Box, { 
        key: "tabs-container", 
        sx: { borderBottom: 1, borderColor: 'divider' } 
      },
        React.createElement(Tabs, { 
          value: tabValue, 
          onChange: handleTabChange 
        }, [
          React.createElement(Tab, { key: "tab-performance", label: "Performance Analysis" }),
          React.createElement(Tab, { key: "tab-risk", label: "Risk Analysis" }),
          React.createElement(Tab, { key: "tab-correlation", label: "Correlation Analysis" })
        ])
      ),
      
      // Tab Panels
      React.createElement(TabPanel, { 
        key: "panel-performance", 
        value: tabValue, 
        index: 0 
      }, renderPerformanceAnalysis()),
      
      React.createElement(TabPanel, { 
        key: "panel-risk", 
        value: tabValue, 
        index: 1 
      }, renderRiskAnalysis()),
      
      React.createElement(TabPanel, { 
        key: "panel-correlation", 
        value: tabValue, 
        index: 2 
      }, renderCorrelationAnalysis())
    ])
  ]);
};

export default PortfolioAnalytics;
