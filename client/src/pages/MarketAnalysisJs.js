// MarketAnalysisJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/storeProviderJs';
import TopBar from '../components/layout/TopBar';

// Market Analysis Page component
const MarketAnalysis = observer(function MarketAnalysis() {
  const theme = useTheme();
  const location = useLocation();
  // Check if we're on a standalone route or within the dashboard layout
  const isStandalone = !location.pathname.includes('/dashboard');
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [marketData, setMarketData] = useState({
    forex: [
      { pair: 'EUR/USD', price: '1.0921', change: '+0.15%', direction: 'up' },
      { pair: 'GBP/USD', price: '1.2654', change: '-0.22%', direction: 'down' },
      { pair: 'USD/JPY', price: '153.42', change: '+0.31%', direction: 'up' },
      { pair: 'AUD/USD', price: '0.6587', change: '-0.18%', direction: 'down' },
      { pair: 'USD/CAD', price: '1.3642', change: '+0.12%', direction: 'up' },
      { pair: 'USD/CHF', price: '0.9087', change: '+0.05%', direction: 'up' },
      { pair: 'NZD/USD', price: '0.5984', change: '-0.27%', direction: 'down' },
    ],
    commodities: [
      { name: 'Gold', price: '2,321.45', change: '+0.75%', direction: 'up' },
      { name: 'Silver', price: '27.32', change: '+0.42%', direction: 'up' },
      { name: 'Crude Oil', price: '78.65', change: '-1.24%', direction: 'down' },
      { name: 'Natural Gas', price: '2.15', change: '-0.85%', direction: 'down' },
      { name: 'Copper', price: '4.52', change: '+0.63%', direction: 'up' },
    ],
    indices: [
      { name: 'S&P 500', price: '5,234.78', change: '+0.32%', direction: 'up' },
      { name: 'Dow Jones', price: '38,654.42', change: '+0.18%', direction: 'up' },
      { name: 'Nasdaq', price: '16,432.65', change: '+0.45%', direction: 'up' },
      { name: 'FTSE 100', price: '8,142.28', change: '-0.24%', direction: 'down' },
      { name: 'DAX', price: '18,321.54', change: '+0.15%', direction: 'up' },
      { name: 'Nikkei 225', price: '38,654.32', change: '-0.52%', direction: 'down' },
    ],
    crypto: [
      { name: 'Bitcoin', price: '68,432.21', change: '+2.45%', direction: 'up' },
      { name: 'Ethereum', price: '3,542.87', change: '+1.87%', direction: 'up' },
      { name: 'Solana', price: '142.65', change: '+3.21%', direction: 'up' },
      { name: 'Cardano', price: '0.45', change: '-0.75%', direction: 'down' },
      { name: 'XRP', price: '0.52', change: '-1.24%', direction: 'down' },
    ],
    economicCalendar: [
      { time: '08:30', country: 'USD', event: 'Non-Farm Payrolls', impact: 'High', forecast: '180K', previous: '175K' },
      { time: '10:00', country: 'EUR', event: 'ECB Interest Rate Decision', impact: 'High', forecast: '4.50%', previous: '4.50%' },
      { time: '14:30', country: 'GBP', event: 'Manufacturing PMI', impact: 'Medium', forecast: '51.2', previous: '50.8' },
      { time: '16:00', country: 'USD', event: 'ISM Manufacturing PMI', impact: 'High', forecast: '49.8', previous: '48.7' },
      { time: '20:00', country: 'USD', event: 'FOMC Meeting Minutes', impact: 'High', forecast: 'N/A', previous: 'N/A' },
    ]
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Render market overview
  const renderMarketOverview = () => {
    return React.createElement(Box, { key: 'market-overview' }, [
      // Title
      React.createElement(Typography, { 
        key: 'market-overview-title', 
        variant: 'h5', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, 'Market Overview'),
      
      // Market data grid
      React.createElement(Grid, { key: 'market-data-grid', container: true, spacing: 3 }, [
        // Forex card
        React.createElement(Grid, { key: 'forex-grid', item: true, xs: 12, md: 6, lg: 3 }, [
          React.createElement(Card, { key: 'forex-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'forex-content' }, [
              React.createElement(Typography, { key: 'forex-title', variant: 'h6', gutterBottom: true }, 'Forex'),
              React.createElement(Divider, { key: 'forex-divider', sx: { mb: 2 } }),
              ...marketData.forex.map((item, index) => 
                React.createElement(Box, { 
                  key: `forex-item-${index}`, 
                  sx: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  } 
                }, [
                  React.createElement(Typography, { key: `forex-pair-${index}`, variant: 'body2' }, item.pair),
                  React.createElement(Box, { key: `forex-data-${index}`, sx: { textAlign: 'right' } }, [
                    React.createElement(Typography, { key: `forex-price-${index}`, variant: 'body2' }, item.price),
                    React.createElement(Typography, { 
                      key: `forex-change-${index}`, 
                      variant: 'caption',
                      color: item.direction === 'up' ? 'success.main' : 'error.main'
                    }, item.change)
                  ])
                ])
              )
            ])
          ])
        ]),
        
        // Commodities card
        React.createElement(Grid, { key: 'commodities-grid', item: true, xs: 12, md: 6, lg: 3 }, [
          React.createElement(Card, { key: 'commodities-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'commodities-content' }, [
              React.createElement(Typography, { key: 'commodities-title', variant: 'h6', gutterBottom: true }, 'Commodities'),
              React.createElement(Divider, { key: 'commodities-divider', sx: { mb: 2 } }),
              ...marketData.commodities.map((item, index) => 
                React.createElement(Box, { 
                  key: `commodity-item-${index}`, 
                  sx: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  } 
                }, [
                  React.createElement(Typography, { key: `commodity-name-${index}`, variant: 'body2' }, item.name),
                  React.createElement(Box, { key: `commodity-data-${index}`, sx: { textAlign: 'right' } }, [
                    React.createElement(Typography, { key: `commodity-price-${index}`, variant: 'body2' }, item.price),
                    React.createElement(Typography, { 
                      key: `commodity-change-${index}`, 
                      variant: 'caption',
                      color: item.direction === 'up' ? 'success.main' : 'error.main'
                    }, item.change)
                  ])
                ])
              )
            ])
          ])
        ]),
        
        // Indices card
        React.createElement(Grid, { key: 'indices-grid', item: true, xs: 12, md: 6, lg: 3 }, [
          React.createElement(Card, { key: 'indices-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'indices-content' }, [
              React.createElement(Typography, { key: 'indices-title', variant: 'h6', gutterBottom: true }, 'Indices'),
              React.createElement(Divider, { key: 'indices-divider', sx: { mb: 2 } }),
              ...marketData.indices.map((item, index) => 
                React.createElement(Box, { 
                  key: `index-item-${index}`, 
                  sx: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  } 
                }, [
                  React.createElement(Typography, { key: `index-name-${index}`, variant: 'body2' }, item.name),
                  React.createElement(Box, { key: `index-data-${index}`, sx: { textAlign: 'right' } }, [
                    React.createElement(Typography, { key: `index-price-${index}`, variant: 'body2' }, item.price),
                    React.createElement(Typography, { 
                      key: `index-change-${index}`, 
                      variant: 'caption',
                      color: item.direction === 'up' ? 'success.main' : 'error.main'
                    }, item.change)
                  ])
                ])
              )
            ])
          ])
        ]),
        
        // Crypto card
        React.createElement(Grid, { key: 'crypto-grid', item: true, xs: 12, md: 6, lg: 3 }, [
          React.createElement(Card, { key: 'crypto-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'crypto-content' }, [
              React.createElement(Typography, { key: 'crypto-title', variant: 'h6', gutterBottom: true }, 'Cryptocurrencies'),
              React.createElement(Divider, { key: 'crypto-divider', sx: { mb: 2 } }),
              ...marketData.crypto.map((item, index) => 
                React.createElement(Box, { 
                  key: `crypto-item-${index}`, 
                  sx: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  } 
                }, [
                  React.createElement(Typography, { key: `crypto-name-${index}`, variant: 'body2' }, item.name),
                  React.createElement(Box, { key: `crypto-data-${index}`, sx: { textAlign: 'right' } }, [
                    React.createElement(Typography, { key: `crypto-price-${index}`, variant: 'body2' }, item.price),
                    React.createElement(Typography, { 
                      key: `crypto-change-${index}`, 
                      variant: 'caption',
                      color: item.direction === 'up' ? 'success.main' : 'error.main'
                    }, item.change)
                  ])
                ])
              )
            ])
          ])
        ])
      ])
    ]);
  };

  // Render economic calendar
  const renderEconomicCalendar = () => {
    return React.createElement(Box, { key: 'economic-calendar' }, [
      // Title
      React.createElement(Typography, { 
        key: 'economic-calendar-title', 
        variant: 'h5', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, 'Economic Calendar'),
      
      // Calendar card
      React.createElement(Card, { key: 'calendar-card', elevation: 2 }, [
        React.createElement(CardContent, { key: 'calendar-content' }, [
          // Table headers
          React.createElement(Grid, { 
            key: 'calendar-header', 
            container: true,
            sx: { 
              fontWeight: 'bold', 
              borderBottom: 1, 
              borderColor: 'divider',
              py: 1
            }
          }, [
            React.createElement(Grid, { key: 'header-time', item: true, xs: 1 }, 'Time'),
            React.createElement(Grid, { key: 'header-country', item: true, xs: 1 }, 'Country'),
            React.createElement(Grid, { key: 'header-event', item: true, xs: 5 }, 'Event'),
            React.createElement(Grid, { key: 'header-impact', item: true, xs: 2 }, 'Impact'),
            React.createElement(Grid, { key: 'header-forecast', item: true, xs: 1.5 }, 'Forecast'),
            React.createElement(Grid, { key: 'header-previous', item: true, xs: 1.5 }, 'Previous')
          ]),
          
          // Calendar items
          ...marketData.economicCalendar.map((item, index) => 
            React.createElement(Grid, { 
              key: `calendar-item-${index}`, 
              container: true,
              sx: { 
                borderBottom: 1, 
                borderColor: 'divider',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }, [
              React.createElement(Grid, { key: `item-time-${index}`, item: true, xs: 1 }, item.time),
              React.createElement(Grid, { key: `item-country-${index}`, item: true, xs: 1 }, item.country),
              React.createElement(Grid, { key: `item-event-${index}`, item: true, xs: 5 }, item.event),
              React.createElement(Grid, { key: `item-impact-${index}`, item: true, xs: 2 }, 
                React.createElement(Typography, { 
                  variant: 'body2',
                  color: item.impact === 'High' ? 'error.main' : item.impact === 'Medium' ? 'warning.main' : 'info.main'
                }, item.impact)
              ),
              React.createElement(Grid, { key: `item-forecast-${index}`, item: true, xs: 1.5 }, item.forecast),
              React.createElement(Grid, { key: `item-previous-${index}`, item: true, xs: 1.5 }, item.previous)
            ])
          )
        ])
      ])
    ]);
  };

  // Render market analysis
  const renderMarketAnalysis = () => {
    return React.createElement(Box, { key: 'market-analysis' }, [
      // Title
      React.createElement(Typography, { 
        key: 'market-analysis-title', 
        variant: 'h5', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, 'Market Analysis'),
      
      // Analysis cards
      React.createElement(Grid, { key: 'analysis-grid', container: true, spacing: 3 }, [
        // EUR/USD Analysis
        React.createElement(Grid, { key: 'eurusd-analysis-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'eurusd-analysis-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'eurusd-analysis-content' }, [
              React.createElement(Typography, { key: 'eurusd-analysis-title', variant: 'h6', gutterBottom: true }, 'EUR/USD Analysis'),
              React.createElement(Divider, { key: 'eurusd-analysis-divider', sx: { mb: 2 } }),
              React.createElement(Typography, { key: 'eurusd-analysis-text', variant: 'body2', paragraph: true }, 
                'EUR/USD continues to trade in a narrow range as markets await the ECB interest rate decision. Technical indicators suggest a bullish bias with resistance at 1.0950 and support at 1.0880. The pair remains above the 200-day moving average, indicating a potential continuation of the uptrend if economic data supports the Euro.'
              ),
              React.createElement(Box, { key: 'eurusd-levels', sx: { mt: 2 } }, [
                React.createElement(Typography, { key: 'eurusd-levels-title', variant: 'subtitle2', gutterBottom: true }, 'Key Levels:'),
                React.createElement(Grid, { key: 'eurusd-levels-grid', container: true, spacing: 2 }, [
                  React.createElement(Grid, { key: 'eurusd-resistance', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'eurusd-resistance-title', variant: 'caption', color: 'text.secondary' }, 'Resistance'),
                    React.createElement(Typography, { key: 'eurusd-resistance-values', variant: 'body2' }, '1.0950, 1.1000, 1.1050')
                  ]),
                  React.createElement(Grid, { key: 'eurusd-support', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'eurusd-support-title', variant: 'caption', color: 'text.secondary' }, 'Support'),
                    React.createElement(Typography, { key: 'eurusd-support-values', variant: 'body2' }, '1.0880, 1.0850, 1.0800')
                  ])
                ])
              ])
            ])
          ])
        ]),
        
        // Gold Analysis
        React.createElement(Grid, { key: 'gold-analysis-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'gold-analysis-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'gold-analysis-content' }, [
              React.createElement(Typography, { key: 'gold-analysis-title', variant: 'h6', gutterBottom: true }, 'Gold (XAU/USD) Analysis'),
              React.createElement(Divider, { key: 'gold-analysis-divider', sx: { mb: 2 } }),
              React.createElement(Typography, { key: 'gold-analysis-text', variant: 'body2', paragraph: true }, 
                'Gold prices continue to surge amid geopolitical tensions and inflation concerns. The precious metal has broken above the $2,300 level, establishing a new all-time high. RSI indicators are showing overbought conditions, suggesting a potential short-term pullback before the next leg higher. Central bank buying remains strong, providing fundamental support.'
              ),
              React.createElement(Box, { key: 'gold-levels', sx: { mt: 2 } }, [
                React.createElement(Typography, { key: 'gold-levels-title', variant: 'subtitle2', gutterBottom: true }, 'Key Levels:'),
                React.createElement(Grid, { key: 'gold-levels-grid', container: true, spacing: 2 }, [
                  React.createElement(Grid, { key: 'gold-resistance', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'gold-resistance-title', variant: 'caption', color: 'text.secondary' }, 'Resistance'),
                    React.createElement(Typography, { key: 'gold-resistance-values', variant: 'body2' }, '$2,350, $2,400, $2,450')
                  ]),
                  React.createElement(Grid, { key: 'gold-support', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'gold-support-title', variant: 'caption', color: 'text.secondary' }, 'Support'),
                    React.createElement(Typography, { key: 'gold-support-values', variant: 'body2' }, '$2,300, $2,250, $2,200')
                  ])
                ])
              ])
            ])
          ])
        ]),
        
        // S&P 500 Analysis
        React.createElement(Grid, { key: 'sp500-analysis-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'sp500-analysis-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'sp500-analysis-content' }, [
              React.createElement(Typography, { key: 'sp500-analysis-title', variant: 'h6', gutterBottom: true }, 'S&P 500 Analysis'),
              React.createElement(Divider, { key: 'sp500-analysis-divider', sx: { mb: 2 } }),
              React.createElement(Typography, { key: 'sp500-analysis-text', variant: 'body2', paragraph: true }, 
                'The S&P 500 continues to trade near all-time highs as strong corporate earnings and economic resilience outweigh concerns about inflation and interest rates. Technical indicators remain bullish, with the index trading above all major moving averages. Market breadth has improved, with more stocks participating in the rally, which is a positive sign for market health.'
              ),
              React.createElement(Box, { key: 'sp500-levels', sx: { mt: 2 } }, [
                React.createElement(Typography, { key: 'sp500-levels-title', variant: 'subtitle2', gutterBottom: true }, 'Key Levels:'),
                React.createElement(Grid, { key: 'sp500-levels-grid', container: true, spacing: 2 }, [
                  React.createElement(Grid, { key: 'sp500-resistance', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'sp500-resistance-title', variant: 'caption', color: 'text.secondary' }, 'Resistance'),
                    React.createElement(Typography, { key: 'sp500-resistance-values', variant: 'body2' }, '5,300, 5,350, 5,400')
                  ]),
                  React.createElement(Grid, { key: 'sp500-support', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'sp500-support-title', variant: 'caption', color: 'text.secondary' }, 'Support'),
                    React.createElement(Typography, { key: 'sp500-support-values', variant: 'body2' }, '5,200, 5,150, 5,100')
                  ])
                ])
              ])
            ])
          ])
        ]),
        
        // Bitcoin Analysis
        React.createElement(Grid, { key: 'btc-analysis-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'btc-analysis-card', elevation: 2 }, [
            React.createElement(CardContent, { key: 'btc-analysis-content' }, [
              React.createElement(Typography, { key: 'btc-analysis-title', variant: 'h6', gutterBottom: true }, 'Bitcoin (BTC/USD) Analysis'),
              React.createElement(Divider, { key: 'btc-analysis-divider', sx: { mb: 2 } }),
              React.createElement(Typography, { key: 'btc-analysis-text', variant: 'body2', paragraph: true }, 
                'Bitcoin has consolidated above the $65,000 level after its recent all-time high. Institutional adoption continues to drive the market, with ETF inflows remaining strong. On-chain metrics show accumulation by long-term holders, which historically precedes major price movements. The upcoming halving event is expected to reduce supply and potentially drive prices higher.'
              ),
              React.createElement(Box, { key: 'btc-levels', sx: { mt: 2 } }, [
                React.createElement(Typography, { key: 'btc-levels-title', variant: 'subtitle2', gutterBottom: true }, 'Key Levels:'),
                React.createElement(Grid, { key: 'btc-levels-grid', container: true, spacing: 2 }, [
                  React.createElement(Grid, { key: 'btc-resistance', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'btc-resistance-title', variant: 'caption', color: 'text.secondary' }, 'Resistance'),
                    React.createElement(Typography, { key: 'btc-resistance-values', variant: 'body2' }, '$70,000, $72,000, $75,000')
                  ]),
                  React.createElement(Grid, { key: 'btc-support', item: true, xs: 6 }, [
                    React.createElement(Typography, { key: 'btc-support-title', variant: 'caption', color: 'text.secondary' }, 'Support'),
                    React.createElement(Typography, { key: 'btc-support-values', variant: 'body2' }, '$65,000, $62,000, $60,000')
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]);
  };

  // Create the main content
  const createContent = () => React.createElement(Container, {
    maxWidth: 'xl',
    sx: { py: 4, flexGrow: 1 }
  }, [
    // Page header
    React.createElement(Typography, { 
      key: 'page-title',
      variant: 'h4', 
      component: 'h1',
      gutterBottom: true,
      sx: { mb: 4 }
    }, 'Market Analysis'),
    
    // Tabs
    React.createElement(Box, { key: 'tabs-box', sx: { borderBottom: 1, borderColor: 'divider', mb: 3 } }, [
      React.createElement(Tabs, {
        key: 'tabs',
        value: selectedTab,
        onChange: handleTabChange,
        indicatorColor: 'primary',
        textColor: 'primary'
      }, [
        React.createElement(Tab, { key: 'overview-tab', label: 'Market Overview' }),
        React.createElement(Tab, { key: 'calendar-tab', label: 'Economic Calendar' }),
        React.createElement(Tab, { key: 'analysis-tab', label: 'Market Analysis' })
      ])
    ]),
    
    // Tab content
    selectedTab === 0 ? renderMarketOverview() : 
    selectedTab === 1 ? renderEconomicCalendar() :
    renderMarketAnalysis()
  ]);
  
  // Main render
  return isStandalone ? 
    React.createElement(
      Box, 
      { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
      [
        // Top navigation bar with enhanced features for standalone mode
        React.createElement(TopBar, {
          pageTitle: 'Market Analysis',
          pageIcon: React.createElement(BarChartIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'refresh-data',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(RefreshIcon),
                color: 'primary'
              },
              'Refresh Data'
            ),
            React.createElement(
              Button, 
              {
                key: 'export-report',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(DownloadIcon),
                color: 'primary'
              },
              'Export Report'
            )
          ],
          onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
        }),
        createContent()
      ]
    ) : 
    createContent();
});

export default MarketAnalysis;
