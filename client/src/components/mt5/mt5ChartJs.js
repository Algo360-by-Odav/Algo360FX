// mt5ChartJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShowChart as LineChartIcon,
  CandlestickChart as CandlestickIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Brush,
  Legend,
  Bar,
  ComposedChart,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';

const timeframes = [
  { value: 'M1', label: '1 Minute' },
  { value: 'M5', label: '5 Minutes' },
  { value: 'M15', label: '15 Minutes' },
  { value: 'M30', label: '30 Minutes' },
  { value: 'H1', label: '1 Hour' },
  { value: 'H4', label: '4 Hours' },
  { value: 'D1', label: 'Daily' },
  { value: 'W1', label: 'Weekly' },
  { value: 'MN1', label: 'Monthly' },
];

const MT5Chart = observer(({ symbol, onClose }) => {
  const [timeframe, setTimeframe] = useState('M15');
  const [chartType, setChartType] = useState('candlestick');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 1000); // Update every second
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, this would fetch data from MT5
      // For now, we'll generate mock data
      const mockData = generateMockData();
      setChartData(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const data = [];
    const now = Date.now();
    const interval = getIntervalInMs(timeframe);
    
    for (let i = 0; i < 100; i++) {
      const timestamp = now - (99 - i) * interval;
      const basePrice = 1.2500 + Math.sin(i * 0.1) * 0.0100;
      const range = 0.0020;
      
      const open = basePrice + (Math.random() - 0.5) * range;
      const close = basePrice + (Math.random() - 0.5) * range;
      const high = Math.max(open, close) + Math.random() * range * 0.5;
      const low = Math.min(open, close) - Math.random() * range * 0.5;
      const volume = Math.floor(Math.random() * 1000) + 500;

      data.push({ timestamp, open, high, low, close, volume });
    }

    return data;
  };

  const getIntervalInMs = (tf) => {
    const intervals = {
      'M1': 60 * 1000,
      'M5': 5 * 60 * 1000,
      'M15': 15 * 60 * 1000,
      'M30': 30 * 60 * 1000,
      'H1': 60 * 60 * 1000,
      'H4': 4 * 60 * 60 * 1000,
      'D1': 24 * 60 * 60 * 1000,
      'W1': 7 * 24 * 60 * 60 * 1000,
      'MN1': 30 * 24 * 60 * 60 * 1000,
    };
    return intervals[tf] || intervals['M15'];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (timeframe.startsWith('M')) {
      return date.toLocaleTimeString();
    }
    return date.toLocaleDateString();
  };

  const renderCandlestickChart = (data) => {
    return React.createElement(ComposedChart, { data }, [
      React.createElement(XAxis, {
        key: "x-axis",
        dataKey: "timestamp",
        tickFormatter: formatTimestamp,
        scale: "time",
        type: "number",
        domain: ['auto', 'auto']
      }),
      React.createElement(YAxis, {
        key: "y-axis",
        domain: ['auto', 'auto'],
        tickFormatter: (value) => value.toFixed(5)
      }),
      React.createElement(CartesianGrid, {
        key: "grid",
        strokeDasharray: "3 3"
      }),
      React.createElement(RechartsTooltip, {
        key: "tooltip",
        content: ({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return React.createElement(Box, {
              sx: { bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }
            }, [
              React.createElement(Typography, {
                key: "time",
                variant: "body2"
              }, `Time: ${formatTimestamp(data.timestamp)}`),
              React.createElement(Typography, {
                key: "open",
                variant: "body2"
              }, `Open: ${data.open.toFixed(5)}`),
              React.createElement(Typography, {
                key: "high",
                variant: "body2"
              }, `High: ${data.high.toFixed(5)}`),
              React.createElement(Typography, {
                key: "low",
                variant: "body2"
              }, `Low: ${data.low.toFixed(5)}`),
              React.createElement(Typography, {
                key: "close",
                variant: "body2"
              }, `Close: ${data.close.toFixed(5)}`),
              React.createElement(Typography, {
                key: "volume",
                variant: "body2"
              }, `Volume: ${data.volume}`)
            ]);
          }
          return null;
        }
      }),
      React.createElement(Legend, { key: "legend" }),
      React.createElement(Bar, {
        key: "volume-bar",
        dataKey: "volume",
        fill: "#8884d8",
        opacity: 0.3,
        yAxisId: 1
      }),
      React.createElement(Brush, {
        key: "brush",
        dataKey: "timestamp",
        height: 30,
        stroke: "#8884d8",
        tickFormatter: formatTimestamp
      })
    ]);
  };

  const renderLineChart = (data) => {
    return React.createElement(AreaChart, { data }, [
      React.createElement(XAxis, {
        key: "x-axis",
        dataKey: "timestamp",
        tickFormatter: formatTimestamp,
        scale: "time",
        type: "number",
        domain: ['auto', 'auto']
      }),
      React.createElement(YAxis, {
        key: "y-axis",
        domain: ['auto', 'auto'],
        tickFormatter: (value) => value.toFixed(5)
      }),
      React.createElement(CartesianGrid, {
        key: "grid",
        strokeDasharray: "3 3"
      }),
      React.createElement(RechartsTooltip, {
        key: "tooltip",
        content: ({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return React.createElement(Box, {
              sx: { bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }
            }, [
              React.createElement(Typography, {
                key: "time",
                variant: "body2"
              }, `Time: ${formatTimestamp(data.timestamp)}`),
              React.createElement(Typography, {
                key: "price",
                variant: "body2"
              }, `Price: ${data.close.toFixed(5)}`),
              React.createElement(Typography, {
                key: "volume",
                variant: "body2"
              }, `Volume: ${data.volume}`)
            ]);
          }
          return null;
        }
      }),
      React.createElement(Legend, { key: "legend" }),
      React.createElement(Area, {
        key: "area",
        type: "monotone",
        dataKey: "close",
        stroke: "#8884d8",
        fill: "#8884d8",
        fillOpacity: 0.3
      }),
      React.createElement(Brush, {
        key: "brush",
        dataKey: "timestamp",
        height: 30,
        stroke: "#8884d8",
        tickFormatter: formatTimestamp
      })
    ]);
  };

  // Create the chart header
  const createChartHeader = () => {
    return React.createElement(Box, {
      sx: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }
    }, [
      // Title and symbol
      React.createElement(Box, {
        key: "title-box",
        sx: { display: 'flex', alignItems: 'center' }
      }, [
        React.createElement(Typography, {
          key: "title",
          variant: "h6",
          component: "div"
        }, `${symbol} Chart`)
      ]),
      
      // Controls
      React.createElement(Box, {
        key: "controls-box",
        sx: { display: 'flex', alignItems: 'center', gap: 1 }
      }, [
        // Timeframe selector
        React.createElement(FormControl, {
          key: "timeframe-control",
          size: "small",
          sx: { minWidth: 120 }
        }, [
          React.createElement(InputLabel, {
            key: "timeframe-label",
            id: "timeframe-select-label"
          }, "Timeframe"),
          React.createElement(Select, {
            key: "timeframe-select",
            labelId: "timeframe-select-label",
            value: timeframe,
            label: "Timeframe",
            onChange: (e) => setTimeframe(e.target.value),
            size: "small"
          }, timeframes.map(tf => 
            React.createElement(MenuItem, {
              key: tf.value,
              value: tf.value
            }, tf.label)
          ))
        ]),
        
        // Chart type toggle
        React.createElement(ToggleButtonGroup, {
          key: "chart-type-toggle",
          value: chartType,
          exclusive: true,
          onChange: (_event, value) => value && setChartType(value),
          size: "small",
          "aria-label": "chart type"
        }, [
          React.createElement(ToggleButton, {
            key: "candlestick-button",
            value: "candlestick",
            "aria-label": "candlestick chart",
            tabIndex: 0
          }, 
            React.createElement(Tooltip, {
              title: "Candlestick",
              PopperProps: { disablePortal: true }
            }, 
              React.createElement(CandlestickIcon)
            )
          ),
          React.createElement(ToggleButton, {
            key: "line-button",
            value: "line",
            "aria-label": "line chart",
            tabIndex: 0
          }, 
            React.createElement(Tooltip, {
              title: "Line",
              PopperProps: { disablePortal: true }
            }, 
              React.createElement(LineChartIcon)
            )
          )
        ]),
        
        // Refresh button
        React.createElement(Tooltip, {
          key: "refresh-tooltip",
          title: "Refresh",
          PopperProps: { disablePortal: true }
        }, 
          React.createElement(IconButton, {
            onClick: fetchChartData,
            size: "small",
            "aria-label": "refresh chart",
            tabIndex: 0
          }, 
            React.createElement(RefreshIcon)
          )
        ),
        
        // Close button
        React.createElement(Tooltip, {
          key: "close-tooltip",
          title: "Close",
          PopperProps: { disablePortal: true }
        }, 
          React.createElement(IconButton, {
            onClick: onClose,
            size: "small",
            "aria-label": "close chart",
            edge: "end",
            tabIndex: 0
          }, 
            React.createElement(CloseIcon)
          )
        )
      ])
    ]);
  };

  // Create error alert
  const createErrorAlert = () => {
    if (!error) return null;
    
    return React.createElement(Alert, {
      severity: "error",
      sx: { mb: 2 }
    }, error);
  };

  // Create loading indicator
  const createLoadingIndicator = () => {
    if (!loading || chartData.length) return null;
    
    return React.createElement(Box, {
      sx: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }
    }, 
      React.createElement(CircularProgress)
    );
  };

  // Create chart content
  const createChartContent = () => {
    if (loading && !chartData.length) return null;
    
    return React.createElement(Box, {
      sx: { height: 'calc(100% - 48px)' }
    }, 
      React.createElement(ResponsiveContainer, {
        width: "100%",
        height: "100%"
      }, 
        chartType === 'candlestick'
          ? renderCandlestickChart(chartData)
          : renderLineChart(chartData)
      )
    );
  };

  // Main render
  return React.createElement(Paper, {
    sx: {
      height: '100%',
      p: 2,
      display: 'flex',
      flexDirection: 'column'
    }
  }, [
    createChartHeader(),
    createErrorAlert(),
    createLoadingIndicator(),
    createChartContent()
  ]);
});

export default MT5Chart;
