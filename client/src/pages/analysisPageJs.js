// analysisPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import { 
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return React.createElement(
    'div',
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `analysis-tabpanel-${index}`,
      'aria-labelledby': `analysis-tab-${index}`,
      ...other
    },
    value === index && React.createElement(Box, { sx: { p: 3 } }, children)
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalysisPage = observer(() => {
  const theme = useTheme();
  const { mt5Store } = useStores();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [timeRange, setTimeRange] = useState('1M');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (selectedAccount) {
      fetchAnalysisData();
    }
  }, [selectedAccount, timeRange]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mt5Store.getAnalysisData(parseInt(selectedAccount), timeRange);
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  const handleExportData = () => {
    if (!analysisData) return;
    
    const jsonString = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_analysis_${selectedAccount}_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPerformanceMetrics = () => {
    return React.createElement(Grid, { container: true, spacing: 3 }, [
      // Performance Overview Card
      React.createElement(Grid, { key: "performance-overview", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "overview-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Performance Overview"),
            React.createElement(Box, { 
              key: "chart-box",
              sx: { height: 400 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(BarChart, { data: analysisData?.performance || [] }, [
                  React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                  React.createElement(XAxis, { key: "x-axis", dataKey: "date" }),
                  React.createElement(YAxis, { key: "y-axis" }),
                  React.createElement(RechartsTooltip, { key: "tooltip" }),
                  React.createElement(Legend, { key: "legend" }),
                  React.createElement(Bar, { 
                    key: "pnl-bar",
                    dataKey: "pnl",
                    name: "P&L",
                    fill: theme.palette.primary.main
                  }),
                  React.createElement(Bar, { 
                    key: "balance-bar",
                    dataKey: "balance",
                    name: "Balance",
                    fill: theme.palette.success.main
                  }),
                  React.createElement(Bar, { 
                    key: "equity-bar",
                    dataKey: "equity",
                    name: "Equity",
                    fill: theme.palette.info.main
                  })
                ])
              )
            )
          ])
        )
      ),

      // Performance Metrics Card
      React.createElement(Grid, { key: "performance-metrics", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "metrics-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Performance Metrics"),
            React.createElement(TableContainer, { key: "metrics-table" }, 
              React.createElement(Table, { size: "small" }, [
                React.createElement(TableBody, { key: "metrics-body" }, [
                  React.createElement(TableRow, { key: "total-trades" }, [
                    React.createElement(TableCell, { key: "total-trades-label" }, "Total Trades"),
                    React.createElement(TableCell, { key: "total-trades-value", align: "right" }, 
                      analysisData?.metrics?.totalTrades || 0
                    )
                  ]),
                  React.createElement(TableRow, { key: "win-rate" }, [
                    React.createElement(TableCell, { key: "win-rate-label" }, "Win Rate"),
                    React.createElement(TableCell, { key: "win-rate-value", align: "right" }, 
                      `${(analysisData?.metrics?.winRate || 0).toFixed(2)}%`
                    )
                  ]),
                  React.createElement(TableRow, { key: "profit-factor" }, [
                    React.createElement(TableCell, { key: "profit-factor-label" }, "Profit Factor"),
                    React.createElement(TableCell, { key: "profit-factor-value", align: "right" }, 
                      (analysisData?.metrics?.profitFactor || 0).toFixed(2)
                    )
                  ]),
                  React.createElement(TableRow, { key: "avg-win" }, [
                    React.createElement(TableCell, { key: "avg-win-label" }, "Average Win"),
                    React.createElement(TableCell, { key: "avg-win-value", align: "right" }, 
                      `$${(analysisData?.metrics?.averageWin || 0).toFixed(2)}`
                    )
                  ]),
                  React.createElement(TableRow, { key: "avg-loss" }, [
                    React.createElement(TableCell, { key: "avg-loss-label" }, "Average Loss"),
                    React.createElement(TableCell, { key: "avg-loss-value", align: "right" }, 
                      `$${(analysisData?.metrics?.averageLoss || 0).toFixed(2)}`
                    )
                  ]),
                  React.createElement(TableRow, { key: "largest-win" }, [
                    React.createElement(TableCell, { key: "largest-win-label" }, "Largest Win"),
                    React.createElement(TableCell, { key: "largest-win-value", align: "right" }, 
                      `$${(analysisData?.metrics?.largestWin || 0).toFixed(2)}`
                    )
                  ]),
                  React.createElement(TableRow, { key: "largest-loss" }, [
                    React.createElement(TableCell, { key: "largest-loss-label" }, "Largest Loss"),
                    React.createElement(TableCell, { key: "largest-loss-value", align: "right" }, 
                      `$${(analysisData?.metrics?.largestLoss || 0).toFixed(2)}`
                    )
                  ])
                ])
              ])
            )
          ])
        )
      ),

      // Win/Loss Distribution Card
      React.createElement(Grid, { key: "win-loss-dist", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "win-loss-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Win/Loss Distribution"),
            React.createElement(Box, { 
              key: "pie-box",
              sx: { height: 300 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(PieChart, null, 
                  React.createElement(Pie, { 
                    data: [
                      { name: 'Wins', value: analysisData?.metrics?.wins || 0 },
                      { name: 'Losses', value: analysisData?.metrics?.losses || 0 }
                    ],
                    cx: "50%",
                    cy: "50%",
                    labelLine: true,
                    label: (entry) => `${entry.name}: ${entry.value}`,
                    outerRadius: 100,
                    fill: "#8884d8",
                    dataKey: "value"
                  }, [
                    React.createElement(Cell, { key: "win-cell", fill: theme.palette.success.main }),
                    React.createElement(Cell, { key: "loss-cell", fill: theme.palette.error.main })
                  ])
                )
              )
            )
          ])
        )
      )
    ]);
  };

  const renderRiskMetrics = () => {
    return React.createElement(Grid, { container: true, spacing: 3 }, [
      // Drawdown Chart Card
      React.createElement(Grid, { key: "drawdown-chart", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "drawdown-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Drawdown Analysis"),
            React.createElement(Box, { 
              key: "drawdown-box",
              sx: { height: 400 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(LineChart, { data: analysisData?.drawdown || [] }, [
                  React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                  React.createElement(XAxis, { key: "x-axis", dataKey: "date" }),
                  React.createElement(YAxis, { key: "y-axis" }),
                  React.createElement(RechartsTooltip, { key: "tooltip" }),
                  React.createElement(Legend, { key: "legend" }),
                  React.createElement(Line, { 
                    key: "drawdown-line",
                    type: "monotone",
                    dataKey: "drawdown",
                    name: "Drawdown %",
                    stroke: theme.palette.error.main,
                    fill: theme.palette.error.light
                  })
                ])
              )
            )
          ])
        )
      ),

      // Risk Metrics Card
      React.createElement(Grid, { key: "risk-metrics", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "risk-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Risk Metrics"),
            React.createElement(TableContainer, { key: "risk-table" }, 
              React.createElement(Table, { size: "small" }, [
                React.createElement(TableBody, { key: "risk-body" }, [
                  React.createElement(TableRow, { key: "max-drawdown" }, [
                    React.createElement(TableCell, { key: "max-drawdown-label" }, "Maximum Drawdown"),
                    React.createElement(TableCell, { key: "max-drawdown-value", align: "right" }, 
                      `${(analysisData?.riskMetrics?.maxDrawdown || 0).toFixed(2)}%`
                    )
                  ]),
                  React.createElement(TableRow, { key: "sharpe-ratio" }, [
                    React.createElement(TableCell, { key: "sharpe-ratio-label" }, "Sharpe Ratio"),
                    React.createElement(TableCell, { key: "sharpe-ratio-value", align: "right" }, 
                      (analysisData?.riskMetrics?.sharpeRatio || 0).toFixed(2)
                    )
                  ]),
                  React.createElement(TableRow, { key: "sortino-ratio" }, [
                    React.createElement(TableCell, { key: "sortino-ratio-label" }, "Sortino Ratio"),
                    React.createElement(TableCell, { key: "sortino-ratio-value", align: "right" }, 
                      (analysisData?.riskMetrics?.sortinoRatio || 0).toFixed(2)
                    )
                  ]),
                  React.createElement(TableRow, { key: "calmar-ratio" }, [
                    React.createElement(TableCell, { key: "calmar-ratio-label" }, "Calmar Ratio"),
                    React.createElement(TableCell, { key: "calmar-ratio-value", align: "right" }, 
                      (analysisData?.riskMetrics?.calmarRatio || 0).toFixed(2)
                    )
                  ]),
                  React.createElement(TableRow, { key: "volatility" }, [
                    React.createElement(TableCell, { key: "volatility-label" }, "Volatility"),
                    React.createElement(TableCell, { key: "volatility-value", align: "right" }, 
                      `${(analysisData?.riskMetrics?.volatility || 0).toFixed(2)}%`
                    )
                  ]),
                  React.createElement(TableRow, { key: "var" }, [
                    React.createElement(TableCell, { key: "var-label" }, "Value at Risk (95%)"),
                    React.createElement(TableCell, { key: "var-value", align: "right" }, 
                      `$${(analysisData?.riskMetrics?.valueAtRisk || 0).toFixed(2)}`
                    )
                  ]),
                  React.createElement(TableRow, { key: "recovery-factor" }, [
                    React.createElement(TableCell, { key: "recovery-factor-label" }, "Recovery Factor"),
                    React.createElement(TableCell, { key: "recovery-factor-value", align: "right" }, 
                      (analysisData?.riskMetrics?.recoveryFactor || 0).toFixed(2)
                    )
                  ])
                ])
              ])
            )
          ])
        )
      ),

      // Risk Distribution Card
      React.createElement(Grid, { key: "risk-dist", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "risk-dist-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Risk Distribution by Symbol"),
            React.createElement(Box, { 
              key: "risk-dist-box",
              sx: { height: 300 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(PieChart, null, 
                  React.createElement(Pie, { 
                    data: analysisData?.symbolRisk || [],
                    cx: "50%",
                    cy: "50%",
                    labelLine: true,
                    label: (entry) => `${entry.symbol}: ${entry.risk.toFixed(2)}%`,
                    outerRadius: 100,
                    fill: "#8884d8",
                    dataKey: "risk"
                  }, (analysisData?.symbolRisk || []).map((entry, index) => 
                    React.createElement(Cell, { 
                      key: `cell-${index}`, 
                      fill: COLORS[index % COLORS.length] 
                    })
                  ))
                )
              )
            )
          ])
        )
      )
    ]);
  };

  const renderTimeAnalysis = () => {
    return React.createElement(Grid, { container: true, spacing: 3 }, [
      // Time of Day Analysis Card
      React.createElement(Grid, { key: "time-of-day", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "time-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Performance by Time of Day"),
            React.createElement(Box, { 
              key: "time-box",
              sx: { height: 300 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(BarChart, { data: analysisData?.timeOfDay || [] }, [
                  React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                  React.createElement(XAxis, { key: "x-axis", dataKey: "hour" }),
                  React.createElement(YAxis, { key: "y-axis" }),
                  React.createElement(RechartsTooltip, { key: "tooltip" }),
                  React.createElement(Legend, { key: "legend" }),
                  React.createElement(Bar, { 
                    key: "pnl-bar",
                    dataKey: "pnl",
                    name: "P&L",
                    fill: theme.palette.primary.main
                  }),
                  React.createElement(Bar, { 
                    key: "trades-bar",
                    dataKey: "trades",
                    name: "Number of Trades",
                    fill: theme.palette.secondary.main
                  })
                ])
              )
            )
          ])
        )
      ),

      // Day of Week Analysis Card
      React.createElement(Grid, { key: "day-of-week", item: true, xs: 12, md: 6 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "day-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Performance by Day of Week"),
            React.createElement(Box, { 
              key: "day-box",
              sx: { height: 300 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(BarChart, { data: analysisData?.dayOfWeek || [] }, [
                  React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                  React.createElement(XAxis, { key: "x-axis", dataKey: "day" }),
                  React.createElement(YAxis, { key: "y-axis" }),
                  React.createElement(RechartsTooltip, { key: "tooltip" }),
                  React.createElement(Legend, { key: "legend" }),
                  React.createElement(Bar, { 
                    key: "pnl-bar",
                    dataKey: "pnl",
                    name: "P&L",
                    fill: theme.palette.primary.main
                  }),
                  React.createElement(Bar, { 
                    key: "trades-bar",
                    dataKey: "trades",
                    name: "Number of Trades",
                    fill: theme.palette.secondary.main
                  })
                ])
              )
            )
          ])
        )
      ),

      // Trade Duration Analysis Card
      React.createElement(Grid, { key: "trade-duration", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "duration-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Performance by Trade Duration"),
            React.createElement(Box, { 
              key: "duration-box",
              sx: { height: 300 } 
            }, 
              React.createElement(ResponsiveContainer, null, 
                React.createElement(BarChart, { data: analysisData?.tradeDuration || [] }, [
                  React.createElement(CartesianGrid, { key: "grid", strokeDasharray: "3 3" }),
                  React.createElement(XAxis, { key: "x-axis", dataKey: "duration" }),
                  React.createElement(YAxis, { key: "y-axis" }),
                  React.createElement(RechartsTooltip, { key: "tooltip" }),
                  React.createElement(Legend, { key: "legend" }),
                  React.createElement(Bar, { 
                    key: "pnl-bar",
                    dataKey: "pnl",
                    name: "Average P&L",
                    fill: theme.palette.primary.main
                  }),
                  React.createElement(Bar, { 
                    key: "trades-bar",
                    dataKey: "trades",
                    name: "Number of Trades",
                    fill: theme.palette.secondary.main
                  })
                ])
              )
            )
          ])
        )
      )
    ]);
  };

  const renderCorrelations = () => {
    return React.createElement(Grid, { container: true, spacing: 3 }, 
      React.createElement(Grid, { key: "correlations", item: true, xs: 12 }, 
        React.createElement(Card, null, 
          React.createElement(CardContent, null, [
            React.createElement(Typography, { 
              key: "corr-title",
              variant: "h6", 
              gutterBottom: true 
            }, "Symbol Correlations"),
            React.createElement(TableContainer, { key: "corr-table" }, 
              React.createElement(Table, { size: "small" }, [
                React.createElement(TableHead, { key: "corr-head" }, 
                  React.createElement(TableRow, null, [
                    React.createElement(TableCell, { key: "symbol1" }, "Symbol 1"),
                    React.createElement(TableCell, { key: "symbol2" }, "Symbol 2"),
                    React.createElement(TableCell, { key: "correlation", align: "right" }, "Correlation")
                  ])
                ),
                React.createElement(TableBody, { key: "corr-body" }, 
                  (analysisData?.correlations || []).map((correlation, index) => 
                    React.createElement(TableRow, { key: index }, [
                      React.createElement(TableCell, { key: `symbol1-${index}` }, correlation.symbol1),
                      React.createElement(TableCell, { key: `symbol2-${index}` }, correlation.symbol2),
                      React.createElement(TableCell, { key: `corr-${index}`, align: "right" }, 
                        React.createElement(Box, { 
                          component: "span",
                          sx: {
                            color: correlation.correlation > 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                          }
                        }, correlation.correlation.toFixed(2))
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

  return React.createElement(Box, { sx: { p: 3 } }, 
    React.createElement(Paper, { sx: { p: 3 } }, [
      // Header with title and action buttons
      React.createElement(Stack, { 
        key: "header",
        direction: "row", 
        spacing: 2, 
        alignItems: "center", 
        sx: { mb: 3 } 
      }, [
        React.createElement(Typography, { key: "title", variant: "h5" }, "Trading Analysis"),
        React.createElement(Box, { key: "spacer", sx: { flexGrow: 1 } }),
        React.createElement(Stack, { key: "actions", direction: "row", spacing: 1 }, [
          React.createElement(Tooltip, { key: "refresh-tooltip", title: "Refresh Data" }, 
            React.createElement("span", null, 
              React.createElement(IconButton, { 
                onClick: fetchAnalysisData, 
                disabled: !selectedAccount || loading 
              }, React.createElement(RefreshIcon))
            )
          ),
          React.createElement(Tooltip, { key: "export-tooltip", title: "Export Analysis" }, 
            React.createElement("span", null, 
              React.createElement(IconButton, { 
                onClick: handleExportData, 
                disabled: !analysisData 
              }, React.createElement(DownloadIcon))
            )
          )
        ])
      ]),

      // Filters
      React.createElement(Stack, { 
        key: "filters",
        direction: "row", 
        spacing: 2, 
        sx: { mb: 3 } 
      }, [
        React.createElement(FormControl, { key: "account-control", size: "small", sx: { minWidth: 200 } }, [
          React.createElement(InputLabel, { key: "account-label" }, "Account"),
          React.createElement(Select, { 
            key: "account-select",
            value: selectedAccount,
            onChange: (e) => setSelectedAccount(e.target.value),
            label: "Account"
          }, (mt5Store.accounts || []).map((account) => 
            React.createElement(MenuItem, { 
              key: account.login, 
              value: account.login 
            }, `${account.login} (${account.name})`)
          ))
        ]),
        React.createElement(FormControl, { key: "time-control", size: "small", sx: { minWidth: 120 } }, [
          React.createElement(InputLabel, { key: "time-label" }, "Time Range"),
          React.createElement(Select, { 
            key: "time-select",
            value: timeRange,
            onChange: (e) => setTimeRange(e.target.value),
            label: "Time Range"
          }, [
            React.createElement(MenuItem, { key: "1W", value: "1W" }, "1 Week"),
            React.createElement(MenuItem, { key: "1M", value: "1M" }, "1 Month"),
            React.createElement(MenuItem, { key: "3M", value: "3M" }, "3 Months"),
            React.createElement(MenuItem, { key: "6M", value: "6M" }, "6 Months"),
            React.createElement(MenuItem, { key: "1Y", value: "1Y" }, "1 Year"),
            React.createElement(MenuItem, { key: "ALL", value: "ALL" }, "All Time")
          ])
        ])
      ]),

      // Error message
      error && React.createElement(Alert, { 
        key: "error",
        severity: "error", 
        sx: { mb: 3 } 
      }, error),

      // Loading or content
      loading 
        ? React.createElement(Box, { 
            key: "loading",
            sx: { display: 'flex', justifyContent: 'center', p: 3 } 
          }, React.createElement(CircularProgress))
        : React.createElement(React.Fragment, { key: "content" }, [
            // Tabs
            React.createElement(Box, { 
              key: "tabs-container",
              sx: { borderBottom: 1, borderColor: 'divider' } 
            }, 
              React.createElement(Tabs, { 
                value: tabValue, 
                onChange: handleTabChange 
              }, [
                React.createElement(Tab, { key: "tab-perf", label: "Performance", iconPosition: "start" }),
                React.createElement(Tab, { key: "tab-risk", label: "Risk Analysis", iconPosition: "start" }),
                React.createElement(Tab, { key: "tab-time", label: "Time Analysis", iconPosition: "start" }),
                React.createElement(Tab, { key: "tab-corr", label: "Correlations", iconPosition: "start" })
              ])
            ),

            // Tab panels
            React.createElement(TabPanel, { key: "panel-perf", value: tabValue, index: 0 }, 
              renderPerformanceMetrics()
            ),
            React.createElement(TabPanel, { key: "panel-risk", value: tabValue, index: 1 }, 
              renderRiskMetrics()
            ),
            React.createElement(TabPanel, { key: "panel-time", value: tabValue, index: 2 }, 
              renderTimeAnalysis()
            ),
            React.createElement(TabPanel, { key: "panel-corr", value: tabValue, index: 3 }, 
              renderCorrelations()
            )
          ])
    ])
  );
});

export default AnalysisPage;
