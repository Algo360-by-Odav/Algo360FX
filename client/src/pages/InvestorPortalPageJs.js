// InvestorPortalPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  Search,
  AccountBalance,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { InvestorDashboard } from '../components/investor-portal/InvestorDashboardJs';

// Enhanced Portfolio Overview
const PortfolioOverview = () => {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 374250.65,
    performanceYTD: 12.3,
    performanceAllTime: 42.8,
    riskScore: 64,
    diversificationScore: 78,
    allocations: [
      { category: 'Forex', value: 145000, percentage: 38.7, performance: 14.2 },
      { category: 'Stocks', value: 95000, percentage: 25.4, performance: 9.8 },
      { category: 'Crypto', value: 75000, percentage: 20.0, performance: 22.5 },
      { category: 'Commodities', value: 42500, percentage: 11.4, performance: 4.2 },
      { category: 'Bonds', value: 16750.65, percentage: 4.5, performance: 2.1 }
    ],
    recentInvestments: [
      { id: 'inv-001', name: 'Meta Trader Strategy Fund', amount: 25000, date: '2024-05-15', type: 'Strategy', status: 'active' },
      { id: 'inv-002', name: 'Alpha FX Trader', amount: 15000, date: '2024-05-10', type: 'Copy Trade', status: 'active' },
      { id: 'inv-003', name: 'EURUSD Momentum Strategy', amount: 10000, date: '2024-04-28', type: 'Strategy', status: 'pending' },
      { id: 'inv-004', name: 'Algorithmic Trend Fund', amount: 20000, date: '2024-04-15', type: 'Fund', status: 'active' },
    ]
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  return React.createElement(Box, { sx: { p: 0 } }, [
    // Summary cards row
    React.createElement(Grid, { container: true, spacing: 3, sx: { mb: 4 }, key: 'summary-cards' }, [
      // Total Value card
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'value-card' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle2', color: 'text.secondary', gutterBottom: true, key: 'value-label' }, 'Portfolio Value'),
          React.createElement(Typography, { variant: 'h4', key: 'value-amount' }, formatCurrency(portfolioData.totalValue)),
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mt: 1 }, key: 'value-change' }, [
            React.createElement(TrendingUp, { sx: { color: 'success.main', mr: 0.5 }, fontSize: 'small', key: 'trend-icon' }),
            React.createElement(Typography, { variant: 'body2', color: 'success.main', key: 'change-text' }, 
              `${formatPercentage(portfolioData.performanceYTD)} YTD`
            )
          ])
        ])
      ),
      
      // Performance card
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'performance-card' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle2', color: 'text.secondary', gutterBottom: true, key: 'perf-label' }, 'All-Time Performance'),
          React.createElement(Typography, { variant: 'h4', key: 'perf-amount' }, formatPercentage(portfolioData.performanceAllTime)),
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mt: 1 }, key: 'inception-date' }, [
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', key: 'since-text' }, 'Since Jan 2023')
          ])
        ])
      ),
      
      // Risk Score card
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'risk-card' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle2', color: 'text.secondary', gutterBottom: true, key: 'risk-label' }, 'Risk Score'),
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center' }, key: 'risk-indicator' }, [
            React.createElement(Typography, { variant: 'h4', key: 'risk-value' }, portfolioData.riskScore),
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { ml: 1 }, key: 'risk-scale' }, '/100')
          ]),
          React.createElement(Box, { sx: { mt: 1 }, key: 'risk-meter' }, [
            React.createElement(Box, { sx: { height: 6, borderRadius: 3, bgcolor: 'background.default', overflow: 'hidden', width: '100%' }, key: 'risk-bg' },
              React.createElement(Box, { 
                sx: { 
                  height: '100%', 
                  width: `${portfolioData.riskScore}%`, 
                  bgcolor: portfolioData.riskScore > 75 ? 'error.main' : portfolioData.riskScore > 50 ? 'warning.main' : 'success.main',
                  transition: 'width 0.5s'
                }
              })
            )
          ])
        ])
      ),
      
      // Diversification card
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'diversification-card' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle2', color: 'text.secondary', gutterBottom: true, key: 'div-label' }, 'Diversification'),
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center' }, key: 'div-indicator' }, [
            React.createElement(Typography, { variant: 'h4', key: 'div-value' }, portfolioData.diversificationScore),
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { ml: 1 }, key: 'div-scale' }, '/100')
          ]),
          React.createElement(Box, { sx: { mt: 1 }, key: 'div-meter' }, [
            React.createElement(Box, { sx: { height: 6, borderRadius: 3, bgcolor: 'background.default', overflow: 'hidden', width: '100%' }, key: 'div-bg' },
              React.createElement(Box, { 
                sx: { 
                  height: '100%', 
                  width: `${portfolioData.diversificationScore}%`, 
                  bgcolor: portfolioData.diversificationScore > 75 ? 'success.main' : portfolioData.diversificationScore > 50 ? 'warning.main' : 'error.main',
                  transition: 'width 0.5s'
                }
              })
            )
          ])
        ])
      )
    ]),
    
    // Portfolio allocation
    React.createElement(Grid, { container: true, spacing: 3, key: 'allocation-section' }, [
      React.createElement(Grid, { item: true, xs: 12, md: 8, key: 'allocation-pie' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true, key: 'allocation-title' }, 'Asset Allocation'),
          React.createElement(Box, { sx: { height: 300, position: 'relative' }, key: 'chart-box' }, [
            // SVG Pie Chart
            React.createElement('svg', {
              width: '100%',
              height: '100%',
              viewBox: '0 0 300 300',
              style: { maxWidth: '300px', margin: '0 auto', display: 'block' }
            }, [
              // Pie slices with appropriate colors
              // Forex (38.7%) - Primary
              React.createElement('path', {
                d: 'M150,150 L150,0 A150,150 0 0,1 273.35,111.91 Z',
                fill: '#1976d2'
              }),
              // Stocks (25.4%) - Secondary
              React.createElement('path', {
                d: 'M150,150 L273.35,111.91 A150,150 0 0,1 252.63,247.5 Z',
                fill: '#9c27b0'
              }),
              // Crypto (20.0%) - Info
              React.createElement('path', {
                d: 'M150,150 L252.63,247.5 A150,150 0 0,1 104,292.5 Z',
                fill: '#03a9f4'
              }),
              // Commodities (11.4%) - Success
              React.createElement('path', {
                d: 'M150,150 L104,292.5 A150,150 0 0,1 16,193.5 Z',
                fill: '#4caf50'
              }),
              // Bonds (4.5%) - Warning
              React.createElement('path', {
                d: 'M150,150 L16,193.5 A150,150 0 0,1 150,0 Z',
                fill: '#ff9800'
              }),
              // Center circle for donut chart style
              React.createElement('circle', {
                cx: 150,
                cy: 150,
                r: 70,
                fill: 'white'
              }),
              // Total value text
              React.createElement('text', {
                x: 150,
                y: 140,
                textAnchor: 'middle',
                dominantBaseline: 'middle',
                fontSize: '14px',
                fontWeight: 'bold'
              }, '$374,250'),
              React.createElement('text', {
                x: 150,
                y: 165,
                textAnchor: 'middle',
                dominantBaseline: 'middle',
                fontSize: '12px',
                fill: '#666'
              }, 'Total Value')
            ]),
            
            // Legend to explain the pie chart segments
            React.createElement(Box, {
              sx: {
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pr: 2
              }
            }, portfolioData.allocations.map((allocation, index) => 
              React.createElement(Box, {
                key: `legend-${index}`,
                sx: { display: 'flex', alignItems: 'center', gap: 1 }
              }, [
                React.createElement(Box, {
                  sx: {
                    width: 12,
                    height: 12,
                    borderRadius: '2px',
                    bgcolor: index === 0 ? 'primary.main' :
                            index === 1 ? 'secondary.main' :
                            index === 2 ? 'info.main' :
                            index === 3 ? 'success.main' :
                                         'warning.main'
                  }
                }),
                React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 0.5 } }, [
                  React.createElement(Typography, { variant: 'caption' }, `${allocation.category} `),
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, `(${allocation.percentage}%)`)
                ])
              ])
            ))
          ])
        ])
      ),
      React.createElement(Grid, { item: true, xs: 12, md: 4, key: 'allocation-table' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true, key: 'allocation-breakdown' }, 'Allocation Breakdown'),
          React.createElement(Box, { sx: { overflowY: 'auto', maxHeight: 300 }, key: 'allocation-list' },
            portfolioData.allocations.map((allocation, index) => 
              React.createElement(Box, { key: `allocation-${index}`, sx: { mb: 2 } }, [
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 0.5 }, key: `allocation-header-${index}` }, [
                  React.createElement(Typography, { variant: 'body2', key: `category-${index}` }, allocation.category),
                  React.createElement(Typography, { variant: 'body2', key: `percentage-${index}` }, `${allocation.percentage.toFixed(1)}%`)
                ]),
                React.createElement(Box, { sx: { height: 6, borderRadius: 3, bgcolor: 'background.default', overflow: 'hidden', width: '100%' }, key: `meter-bg-${index}` },
                  React.createElement(Box, { 
                    sx: { 
                      height: '100%', 
                      width: `${allocation.percentage}%`, 
                      bgcolor: index % 5 === 0 ? 'primary.main' : 
                              index % 5 === 1 ? 'secondary.main' : 
                              index % 5 === 2 ? 'info.main' : 
                              index % 5 === 3 ? 'success.main' : 'warning.main'
                    }
                  })
                ),
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 0.5 }, key: `allocation-footer-${index}` }, [
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary', key: `value-${index}` }, formatCurrency(allocation.value)),
                  React.createElement(Typography, { 
                    variant: 'caption', 
                    color: allocation.performance >= 0 ? 'success.main' : 'error.main', 
                    key: `performance-${index}` 
                  }, 
                    formatPercentage(allocation.performance)
                  )
                ])
              ])
            )
          )
        ])
      )
    ]),
    
    // Recent investments
    React.createElement(Grid, { container: true, spacing: 3, sx: { mt: 1 }, key: 'investments-section' },
      React.createElement(Grid, { item: true, xs: 12, key: 'investments-grid' },
        React.createElement(Paper, { sx: { p: 3 } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true, key: 'investments-title' }, 'Recent Investments'),
          React.createElement(Box, { sx: { overflowX: 'auto' }, key: 'table-container' },
            React.createElement('table', { 
              style: { 
                width: '100%', 
                borderCollapse: 'collapse' 
              }
            }, [
              React.createElement('thead', { key: 'thead' },
                React.createElement('tr', { key: 'header-row' }, [
                  React.createElement('th', { style: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-name' }, 'Name'),
                  React.createElement('th', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-amount' }, 'Amount'),
                  React.createElement('th', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-date' }, 'Date'),
                  React.createElement('th', { style: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-type' }, 'Type'),
                  React.createElement('th', { style: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-status' }, 'Status')
                ])
              ),
              React.createElement('tbody', { key: 'tbody' },
                portfolioData.recentInvestments.map((investment, index) =>
                  React.createElement('tr', { key: `row-${investment.id}` }, [
                    React.createElement('td', { style: { padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, investment.name),
                    React.createElement('td', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, formatCurrency(investment.amount)),
                    React.createElement('td', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, investment.date),
                    React.createElement('td', { style: { padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, investment.type),
                    React.createElement('td', { style: { padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, 
                      React.createElement(Box, { display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 
                        investment.status === 'active' ? 'success.light' : 
                        investment.status === 'pending' ? 'warning.light' : 'error.light',
                        color: investment.status === 'active' ? 'success.dark' : 
                        investment.status === 'pending' ? 'warning.dark' : 'error.dark'
                      }, 
                        investment.status.charAt(0).toUpperCase() + investment.status.slice(1)
                      )
                    )
                  ])
                )
              )
            ])
          )
        ])
      )
    )
  ]);
};

const InvestmentOpportunities = () => {
  // Mock investment opportunities data
  const opportunities = [
    {
      id: 'opp-001',
      name: 'EURUSD Algorithmic Strategy',
      type: 'Auto Strategy',
      category: 'Forex',
      roi: 18.5,
      risk: 'Medium',
      minInvestment: 5000,
      duration: '6 months',
      traders: 342,
      rating: 4.7,
      description: 'Algorithmic trading strategy focused on EUR/USD pair utilizing momentum indicators and price action patterns.',
      performance: [
        { month: 'Jan', return: 2.1 },
        { month: 'Feb', return: 1.8 },
        { month: 'Mar', return: -0.7 },
        { month: 'Apr', return: 3.2 },
        { month: 'May', return: 1.9 },
      ]
    },
    {
      id: 'opp-002',
      name: 'Expert Gold Trader',
      type: 'Copy Trading',
      category: 'Commodities',
      roi: 24.3,
      risk: 'High',
      minInvestment: 10000,
      duration: 'Ongoing',
      traders: 578,
      rating: 4.5,
      description: 'Copy trading opportunity following an experienced gold trader with 8+ years of market experience and consistent returns.',
      performance: [
        { month: 'Jan', return: 3.8 },
        { month: 'Feb', return: 4.2 },
        { month: 'Mar', return: -1.5 },
        { month: 'Apr', return: 4.1 },
        { month: 'May', return: 2.7 },
      ]
    },
    {
      id: 'opp-003',
      name: 'Conservative Forex Fund',
      type: 'Managed Fund',
      category: 'Forex',
      roi: 11.2,
      risk: 'Low',
      minInvestment: 2500,
      duration: '12 months',
      traders: 1205,
      rating: 4.8,
      description: 'Low-risk forex fund focusing on major currency pairs with strict risk management and consistent monthly returns.',
      performance: [
        { month: 'Jan', return: 1.1 },
        { month: 'Feb', return: 0.9 },
        { month: 'Mar', return: 1.2 },
        { month: 'Apr', return: 0.8 },
        { month: 'May', return: 1.0 },
      ]
    },
    {
      id: 'opp-004',
      name: 'Tech Stock Portfolio',
      type: 'Copy Portfolio',
      category: 'Stocks',
      roi: 16.7,
      risk: 'Medium',
      minInvestment: 7500,
      duration: 'Ongoing',
      traders: 827,
      rating: 4.3,
      description: 'Diversified portfolio of technology stocks managed by a team of professional analysts with focus on long-term growth.',
      performance: [
        { month: 'Jan', return: 2.4 },
        { month: 'Feb', return: 1.9 },
        { month: 'Mar', return: -0.3 },
        { month: 'Apr', return: 2.7 },
        { month: 'May', return: 1.5 },
      ]
    },
  ];
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  // Filters
  const filters = {
    categories: ['All', 'Forex', 'Stocks', 'Crypto', 'Commodities', 'Indices'],
    types: ['All Types', 'Auto Strategy', 'Copy Trading', 'Managed Fund', 'Copy Portfolio'],
    risk: ['All Risk Levels', 'Low', 'Medium', 'High'],
    sort: ['Highest Return', 'Lowest Risk', 'Most Popular', 'Newest']
  };
  
  return React.createElement(Box, { sx: { p: 0 } }, [
    // Filters section
    React.createElement(Paper, { sx: { p: 3, mb: 3 }, key: 'filters-paper' }, [
      React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true, key: 'filter-title' }, 'Find Investment Opportunities'),
      React.createElement(Grid, { container: true, spacing: 2, alignItems: 'flex-end', key: 'filter-grid' }, [
        // Category filter
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'category-filter' },
          React.createElement(Box, { sx: { mb: 1 } }, [
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mb: 1 }, key: 'cat-label' }, 'Asset Category'),
            React.createElement('select', { 
              style: { 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid rgba(0, 0, 0, 0.23)' 
              } 
            }, filters.categories.map(cat => 
              React.createElement('option', { value: cat.toLowerCase(), key: `cat-${cat}` }, cat)
            ))
          ])
        ),
        
        // Type filter
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'type-filter' },
          React.createElement(Box, { sx: { mb: 1 } }, [
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mb: 1 }, key: 'type-label' }, 'Investment Type'),
            React.createElement('select', { 
              style: { 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid rgba(0, 0, 0, 0.23)' 
              } 
            }, filters.types.map(type => 
              React.createElement('option', { value: type.toLowerCase().replace(' ', '-'), key: `type-${type}` }, type)
            ))
          ])
        ),
        
        // Risk filter
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'risk-filter' },
          React.createElement(Box, { sx: { mb: 1 } }, [
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mb: 1 }, key: 'risk-label' }, 'Risk Level'),
            React.createElement('select', { 
              style: { 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid rgba(0, 0, 0, 0.23)' 
              } 
            }, filters.risk.map(risk => 
              React.createElement('option', { value: risk.toLowerCase().replace(' ', '-'), key: `risk-${risk}` }, risk)
            ))
          ])
        ),
        
        // Sort filter
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: 'sort-filter' },
          React.createElement(Box, { sx: { mb: 1 } }, [
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mb: 1 }, key: 'sort-label' }, 'Sort By'),
            React.createElement('select', { 
              style: { 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid rgba(0, 0, 0, 0.23)' 
              } 
            }, filters.sort.map(sort => 
              React.createElement('option', { value: sort.toLowerCase().replace(' ', '-'), key: `sort-${sort}` }, sort)
            ))
          ])
        )
      ])
    ]),
    
    // Featured opportunities
    React.createElement(Typography, { variant: 'h6', sx: { mb: 2 }, key: 'featured-title' }, 'Featured Opportunities'),
    React.createElement(Grid, { container: true, spacing: 3, key: 'opportunities-grid' },
      opportunities.map((opportunity) => 
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 6, lg: 3, key: `opp-${opportunity.id}` },
          React.createElement(Paper, { 
            sx: { 
              p: 0, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
              }
            }
          }, [
            // Card header
            React.createElement(Box, { 
              sx: { 
                p: 2, 
                backgroundColor: opportunity.risk === 'Low' ? '#e8f5e9' : 
                                  opportunity.risk === 'Medium' ? '#fff8e1' : 
                                  '#ffebee',
                borderBottom: '1px solid rgba(0,0,0,0.08)'
              },
              key: `header-${opportunity.id}`
            }, [
              React.createElement(Box, { 
                sx: { 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center' 
                }
              }, [
                React.createElement(Typography, { 
                  variant: 'body2', 
                  sx: { 
                    bgcolor: opportunity.risk === 'Low' ? 'success.main' : 
                              opportunity.risk === 'Medium' ? 'warning.main' : 
                              'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }
                }, opportunity.risk),
                React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, opportunity.category)
              ])
            ]),
            
            // Card content
            React.createElement(Box, { sx: { p: 2, flexGrow: 1 }, key: `content-${opportunity.id}` }, [
              React.createElement(Typography, { variant: 'subtitle1', fontWeight: 'bold', gutterBottom: true }, opportunity.name),
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mb: 2, height: '40px', overflow: 'hidden' } }, 
                opportunity.description
              ),
              
              // Stats grid
              React.createElement(Grid, { container: true, spacing: 1, sx: { mb: 2 } }, [
                React.createElement(Grid, { item: true, xs: 6 }, [
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Annual Return'),
                  React.createElement(Typography, { 
                    variant: 'body2', 
                    fontWeight: 'bold',
                    color: 'success.main'
                  }, formatPercentage(opportunity.roi))
                ]),
                React.createElement(Grid, { item: true, xs: 6 }, [
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Min Investment'),
                  React.createElement(Typography, { variant: 'body2', fontWeight: 'bold' }, formatCurrency(opportunity.minInvestment))
                ]),
                React.createElement(Grid, { item: true, xs: 6 }, [
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Duration'),
                  React.createElement(Typography, { variant: 'body2' }, opportunity.duration)
                ]),
                React.createElement(Grid, { item: true, xs: 6 }, [
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Traders'),
                  React.createElement(Box, { sx: { display: 'flex', alignItems: 'center' } }, [
                    React.createElement(Typography, { variant: 'body2' }, opportunity.traders),
                    React.createElement(Box, { 
                      component: 'span', 
                      sx: { 
                        display: 'inline-flex',
                        ml: 1,
                        alignItems: 'center',
                        color: 'warning.main'
                      }
                    }, [
                      // Star rating would go here
                      React.createElement(Typography, { variant: 'body2' }, opportunity.rating)
                    ])
                  ])
                ])
              ])
            ]),
            
            // Card footer
            React.createElement(Box, { 
              sx: { 
                p: 2, 
                pt: 1, 
                backgroundColor: 'background.default', 
                borderTop: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              },
              key: `footer-${opportunity.id}`
            }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, opportunity.type),
              React.createElement('button', { 
                style: { 
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  fontWeight: '500'
                }
              }, 'Invest')
            ])
          ])
        )
      )
    )
  ]);
};

const InvestmentAnalytics = () => {
  // Mock analytics data
  const analyticsData = {
    totalReturn: 18.7,
    monthlyReturns: [
      { month: 'Jan', return: 2.4 },
      { month: 'Feb', return: 1.8 },
      { month: 'Mar', return: -0.5 },
      { month: 'Apr', return: 3.2 },
      { month: 'May', return: 1.9 },
      { month: 'Jun', return: 2.1 },
      { month: 'Jul', return: 0.8 },
      { month: 'Aug', return: -1.2 },
      { month: 'Sep', return: 2.3 },
      { month: 'Oct', return: 1.7 },
      { month: 'Nov', return: 3.1 },
      { month: 'Dec', return: 1.1 },
    ],
    performance: {
      ytd: 12.3,
      '1m': 1.9,
      '3m': 7.3,
      '6m': 10.4,
      '1y': 18.7,
      '3y': 47.2,
    },
    assets: [
      { name: 'EURUSD Strategy', allocation: 25, performance: 14.2 },
      { name: 'Gold Trading', allocation: 15, performance: 22.3 },
      { name: 'Tech Stocks', allocation: 22, performance: 17.8 },
      { name: 'Conservative Forex', allocation: 18, performance: 9.4 },
      { name: 'Crypto Fund', allocation: 10, performance: 32.5 },
      { name: 'Indices ETF', allocation: 10, performance: 12.1 },
    ],
    metrics: {
      sharpeRatio: 1.78,
      maxDrawdown: -8.4,
      volatility: 6.2,
      winRate: 68.5,
      beta: 0.82,
      alpha: 5.4
    },
    riskAnalysis: {
      riskScore: 64,
      stressTest: -12.8,
      varDaily: -1.2,
      correlationToSP: 0.65
    }
  };
  
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Time range filter options
  const timeRanges = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y', 'MAX'];
  
  return React.createElement(Box, { sx: { p: 0 } }, [
    // Performance overview row
    React.createElement(Grid, { container: true, spacing: 3, sx: { mb: 4 }, key: 'performance-row' }, [
      // Main performance card
      React.createElement(Grid, { item: true, xs: 12, md: 8, key: 'main-performance' },
        React.createElement(Paper, { sx: { p: 3 } }, [
          React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 } }, [
            React.createElement(Typography, { variant: 'subtitle1' }, 'Performance Overview'),
            React.createElement(Box, { sx: { display: 'flex', gap: 1 } },
              timeRanges.map(range => 
                React.createElement('button', { 
                  key: `range-${range}`,
                  style: {
                    border: range === 'YTD' ? '1px solid #1976d2' : '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: range === 'YTD' ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    color: range === 'YTD' ? '#1976d2' : 'inherit',
                    cursor: 'pointer'
                  }
                }, range)
              )
            )
          ]),
          // SVG chart implementation
          React.createElement(Box, { sx: { height: '300px', position: 'relative', pt: 2 } }, [
            // Y-axis labels
            React.createElement(Box, { 
              sx: { 
                position: 'absolute', 
                left: 0, 
                top: 0, 
                bottom: 20, 
                width: '50px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                pr: 1,
                pb: 2,
                pt: 2
              } 
            }, [
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '+20%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '+15%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '+10%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '+5%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '0%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, '-5%')
            ]),
            
            // Chart content
            React.createElement(Box, { 
              sx: { 
                position: 'absolute', 
                left: '50px', 
                right: 0, 
                top: 0, 
                bottom: 0,
                pb: 2
              } 
            }, [
              // SVG chart
              React.createElement('svg', { 
                width: '100%', 
                height: '100%', 
                viewBox: '0 0 1000 300',
                preserveAspectRatio: 'none'
              }, [
                // Horizontal grid lines
                React.createElement('line', { x1: 0, y1: 50, x2: 1000, y2: 50, stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }),
                React.createElement('line', { x1: 0, y1: 100, x2: 1000, y2: 100, stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }),
                React.createElement('line', { x1: 0, y1: 150, x2: 1000, y2: 150, stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }),
                React.createElement('line', { x1: 0, y1: 200, x2: 1000, y2: 200, stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }),
                React.createElement('line', { x1: 0, y1: 250, x2: 1000, y2: 250, stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }),
                
                // 0% reference line (bold)
                React.createElement('line', { x1: 0, y1: 150, x2: 1000, y2: 150, stroke: 'rgba(0,0,0,0.15)', strokeWidth: 2 }),
                
                // Performance line
                React.createElement('path', {
                  d: 'M0,120 L83.33,110 L166.66,128 L250,85 L333.33,65 L416.66,90 L500,80 L583.33,140 L666.66,105 L750,70 L833.33,90 L916.66,50 L1000,60',
                  fill: 'none',
                  stroke: '#1976d2',
                  strokeWidth: 3
                }),
                
                // Gradient area under the line
                React.createElement('linearGradient', { id: 'gradient', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, [
                  React.createElement('stop', { offset: '0%', stopColor: '#1976d2', stopOpacity: 0.2 }),
                  React.createElement('stop', { offset: '100%', stopColor: '#1976d2', stopOpacity: 0 })
                ]),
                React.createElement('path', {
                  d: 'M0,120 L83.33,110 L166.66,128 L250,85 L333.33,65 L416.66,90 L500,80 L583.33,140 L666.66,105 L750,70 L833.33,90 L916.66,50 L1000,60 L1000,300 L0,300 Z',
                  fill: 'url(#gradient)'
                }),
                
                // Data points
                React.createElement('circle', { cx: 0, cy: 120, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 83.33, cy: 110, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 166.66, cy: 128, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 250, cy: 85, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 333.33, cy: 65, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 416.66, cy: 90, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 500, cy: 80, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 583.33, cy: 140, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 666.66, cy: 105, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 750, cy: 70, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 833.33, cy: 90, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 916.66, cy: 50, r: 5, fill: '#1976d2' }),
                React.createElement('circle', { cx: 1000, cy: 60, r: 5, fill: '#1976d2' })
              ])
            ]),
            
            // X-axis labels
            React.createElement(Box, { 
              sx: { 
                position: 'absolute', 
                left: '50px', 
                right: 0, 
                bottom: 0, 
                height: '20px', 
                display: 'flex', 
                justifyContent: 'space-between',
                px: 2
              } 
            }, 
              analyticsData.monthlyReturns.map((item, index) => 
                React.createElement(Typography, { 
                  key: `month-${index}`,
                  variant: 'caption', 
                  color: 'text.secondary' 
                }, item.month)
              )
            ),
            
            // Tooltip - would be dynamic in a real app
            React.createElement(Box, {
              sx: {
                position: 'absolute',
                top: '60px',
                left: '250px',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                borderRadius: 1,
                p: 1,
                zIndex: 2,
                border: '1px solid',
                borderColor: 'divider',
                width: '150px'
              }
            }, [
              React.createElement(Typography, { variant: 'subtitle2' }, 'April 2024'),
              React.createElement(Typography, { variant: 'body2', color: 'success.main', fontWeight: 'medium' }, '+3.2%'),
              React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Monthly return')
            ])
          ]),
          // Performance metrics
          React.createElement(Box, { sx: { display: 'flex', flexWrap: 'wrap', mt: 3, gap: 3, justifyContent: 'space-between' } },
            Object.entries(analyticsData.performance).map(([period, value]) => 
              React.createElement(Box, { key: `perf-${period}` }, [
                React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 
                  period === 'ytd' ? 'YTD' : period
                ),
                React.createElement(Typography, {
                  variant: 'body2',
                  fontWeight: 'bold',
                  color: value >= 0 ? 'success.main' : 'error.main'
                }, formatPercentage(value))
              ])
            )
          )
        ])
      ),
      // Risk metrics sidebar
      React.createElement(Grid, { item: true, xs: 12, md: 4, key: 'risk-metrics' },
        React.createElement(Paper, { sx: { p: 3, height: '100%' } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, 'Performance Metrics'),
          React.createElement(Box, { sx: { mt: 2 } },
            Object.entries(analyticsData.metrics).map(([metric, value]) => 
              React.createElement(Box, { key: `metric-${metric}`, sx: { mb: 2 } }, [
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } }, [
                  React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 
                    metric === 'sharpeRatio' ? 'Sharpe Ratio' :
                    metric === 'maxDrawdown' ? 'Max Drawdown' :
                    metric === 'volatility' ? 'Volatility' :
                    metric === 'winRate' ? 'Win Rate' :
                    metric === 'beta' ? 'Beta' :
                    'Alpha'
                  ),
                  React.createElement(Typography, { 
                    variant: 'body2', 
                    fontWeight: 'medium',
                    color: (metric === 'maxDrawdown' || metric === 'volatility') ? 
                           (value < 0 ? 'error.main' : 'text.primary') :
                           (value >= 0 ? 'success.main' : 'error.main')
                  }, 
                    metric === 'maxDrawdown' || metric === 'volatility' || metric === 'varDaily' ? formatPercentage(value) :
                    metric === 'winRate' ? `${value.toFixed(1)}%` :
                    value.toFixed(2)
                  )
                ])
              ])
            )
          )
        ])
      )
    ]),
    
    // Asset allocation and risk assessment row
    React.createElement(Grid, { container: true, spacing: 3, key: 'asset-risk-row' }, [
      // Asset allocation card
      React.createElement(Grid, { item: true, xs: 12, md: 7, key: 'asset-allocation' },
        React.createElement(Paper, { sx: { p: 3 } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, 'Asset Performance'),
          React.createElement(Box, { sx: { maxHeight: 350, overflow: 'auto' } },
            React.createElement('table', { 
              style: { 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '500px'
              }
            }, [
              React.createElement('thead', { key: 'thead' },
                React.createElement('tr', { key: 'header-row' }, [
                  React.createElement('th', { style: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-asset' }, 'Asset'),
                  React.createElement('th', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-allocation' }, 'Allocation'),
                  React.createElement('th', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-performance' }, '1Y Return'),
                  React.createElement('th', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, key: 'th-contrib' }, 'Contribution')
                ])
              ),
              React.createElement('tbody', { key: 'tbody' },
                analyticsData.assets.map((asset) => {
                  const contribution = (asset.allocation / 100) * asset.performance;
                  return React.createElement('tr', { key: `row-${asset.name}` }, [
                    React.createElement('td', { style: { padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, asset.name),
                    React.createElement('td', { style: { textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }, `${asset.allocation}%`),
                    React.createElement('td', { 
                      style: { 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                        color: asset.performance >= 0 ? '#2e7d32' : '#d32f2f'
                      } 
                    }, formatPercentage(asset.performance)),
                    React.createElement('td', { 
                      style: { 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                        color: contribution >= 0 ? '#2e7d32' : '#d32f2f'
                      } 
                    }, formatPercentage(contribution))
                  ]);
                })
              )
            ])
          )
        ])
      ),
      
      // Risk assessment card
      React.createElement(Grid, { item: true, xs: 12, md: 5, key: 'risk-assessment' },
        React.createElement(Paper, { sx: { p: 3 } }, [
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, 'Risk Assessment'),
          
          // Risk score
          React.createElement(Box, { sx: { mb: 3, mt: 2 } }, [
            React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 } }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'Risk Score'),
              React.createElement(Typography, { variant: 'body1', fontWeight: 'medium' }, `${analyticsData.riskAnalysis.riskScore}/100`)
            ]),
            React.createElement(Box, { sx: { height: 8, borderRadius: 4, bgcolor: 'background.default', overflow: 'hidden' } },
              React.createElement(Box, { 
                sx: { 
                  height: '100%', 
                  width: `${analyticsData.riskAnalysis.riskScore}%`, 
                  bgcolor: analyticsData.riskAnalysis.riskScore > 75 ? 'error.main' : 
                          analyticsData.riskAnalysis.riskScore > 50 ? 'warning.main' : 'success.main',
                  transition: 'width 0.5s'
                }
              })
            ),
            React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 0.5 } }, [
              React.createElement(Typography, { variant: 'caption', color: 'success.main' }, 'Low'),
              React.createElement(Typography, { variant: 'caption', color: 'warning.main' }, 'Medium'),
              React.createElement(Typography, { variant: 'caption', color: 'error.main' }, 'High')
            ])
          ]),
          
          // Other risk metrics
          React.createElement(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 } }, [
            React.createElement(Box, { key: 'stress-test' }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Stress Test (Market Crash)'),
              React.createElement(Typography, { 
                variant: 'body1', 
                fontWeight: 'medium',
                color: 'error.main'
              }, formatPercentage(analyticsData.riskAnalysis.stressTest))
            ]),
            
            React.createElement(Box, { key: 'var-daily' }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Value at Risk (Daily, 95%)'),
              React.createElement(Typography, { 
                variant: 'body1', 
                fontWeight: 'medium',
                color: 'error.main'
              }, formatPercentage(analyticsData.riskAnalysis.varDaily))
            ]),
            
            React.createElement(Box, { key: 'correlation' }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Correlation to S&P 500'),
              React.createElement(Typography, { 
                variant: 'body1', 
                fontWeight: 'medium'
              }, analyticsData.riskAnalysis.correlationToSP.toFixed(2))
            ])
          ])
        ])
      )
    ])
  ]);
};

const InvestorSettings = () => {
  // Mock user and settings data
  const userData = {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-06-15',
    tier: 'Premium',
    twoFactorEnabled: true,
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      weeklyReports: true,
      marketUpdates: true,
      newOpportunities: true
    },
    preferences: {
      theme: 'light',
      defaultCurrency: 'USD',
      riskProfile: 'moderate',
      autoInvest: false,
      language: 'English',
      timezone: 'GMT-4'
    },
    apiKeys: [
      { name: 'MT5 Trading Bot', created: '2024-03-10', lastUsed: '2024-05-30', status: 'active' },
      { name: 'Portfolio Analysis', created: '2024-01-22', lastUsed: '2024-04-15', status: 'active' },
    ],
    devices: [
      { type: 'Web Browser (Chrome)', lastActive: '2024-05-31', location: 'New York, US', ipAddress: '192.168.1.xxx' },
      { type: 'Mobile App (iOS)', lastActive: '2024-05-30', location: 'New York, US', ipAddress: '10.0.0.xxx' },
      { type: 'Desktop App (Windows)', lastActive: '2024-05-28', location: 'Boston, US', ipAddress: '172.16.0.xxx' },
    ]
  };
  
  // Settings categories with items
  const settingsCategories = [
    { 
      id: 'account', 
      name: 'Account Settings',
      icon: 'account_circle',
      items: [
        { id: 'profile', name: 'Profile Information' },
        { id: 'password', name: 'Change Password' },
        { id: 'verification', name: 'Identity Verification' },
        { id: 'subscription', name: 'Subscription Plan' },
      ]
    },
    { 
      id: 'security', 
      name: 'Security',
      icon: 'security',
      items: [
        { id: 'twoFactor', name: '2-Factor Authentication' },
        { id: 'devices', name: 'Devices & Sessions' },
        { id: 'apiKeys', name: 'API Keys' },
        { id: 'loginHistory', name: 'Login History' },
      ]
    },
    { 
      id: 'notifications', 
      name: 'Notifications',
      icon: 'notifications',
      items: [
        { id: 'emailAlerts', name: 'Email Alerts' },
        { id: 'smsAlerts', name: 'SMS Alerts' },
        { id: 'pushNotifications', name: 'Push Notifications' },
        { id: 'reports', name: 'Reports & Updates' },
      ]
    },
    { 
      id: 'preferences', 
      name: 'Preferences',
      icon: 'tune',
      items: [
        { id: 'appearance', name: 'Appearance' },
        { id: 'language', name: 'Language & Region' },
        { id: 'riskProfile', name: 'Risk Profile' },
        { id: 'autoInvest', name: 'Auto-Investment' },
      ]
    },
    {
      id: 'privacy',
      name: 'Privacy',
      icon: 'privacy_tip',
      items: [
        { id: 'dataSharing', name: 'Data Sharing' },
        { id: 'dataDeletion', name: 'Data Deletion' },
        { id: 'tracking', name: 'Activity Tracking' },
      ]
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: 'help',
      items: [
        { id: 'faq', name: 'FAQ & Knowledge Base' },
        { id: 'contact', name: 'Contact Support' },
        { id: 'feedback', name: 'Submit Feedback' },
      ]
    }
  ];

  return React.createElement(Box, { sx: { p: 0 } }, [
    // Settings grid layout
    React.createElement(Grid, { container: true, spacing: 3, key: 'settings-grid' }, [
      // Left sidebar with categories
      React.createElement(Grid, { item: true, xs: 12, md: 4, lg: 3, key: 'settings-sidebar' },
        React.createElement(Paper, { sx: { p: 0, mb: { xs: 3, md: 0 } } }, [
          // User profile summary
          React.createElement(Box, { 
            sx: { 
              p: 3, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            },
            key: 'profile-summary'
          }, [
            // Avatar placeholder
            React.createElement(Box, { 
              sx: { 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }
            }, userData.name.split(' ').map(part => part[0]).join('')),
            
            // User info
            React.createElement(Box, { sx: { flex: 1 } }, [
              React.createElement(Typography, { variant: 'subtitle1', fontWeight: 'medium' }, userData.name),
              React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 } }, [
                React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, userData.tier),
                React.createElement(Box, { 
                  component: 'span', 
                  sx: { 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main', 
                    display: 'inline-block' 
                  } 
                })
              ])
            ])
          ]),
          
          // Settings navigation
          React.createElement(Box, { sx: { p: 1 }, key: 'settings-nav' },
            settingsCategories.map(category => 
              React.createElement(Box, { key: `category-${category.id}`, sx: { mb: 1 } }, [
                React.createElement(Typography, { 
                  variant: 'overline', 
                  color: 'text.secondary',
                  sx: { pl: 2, display: 'block', mt: 1 }
                }, category.name),
                
                category.items.map(item => 
                  React.createElement(Box, { 
                    key: `item-${item.id}`,
                    sx: { 
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer',
                      ...(category.id === 'account' && item.id === 'profile' ? { bgcolor: 'action.selected' } : {})
                    }
                  },
                    React.createElement(Box, { 
                      sx: { 
                        display: 'flex', 
                        alignItems: 'center', 
                        px: 1, 
                        py: 0.75 
                      } 
                    }, [
                      React.createElement(Typography, { variant: 'body2' }, item.name)
                    ])
                  )
                )
              ])
            )
          )
        ])
      ),
      
      // Right content area - Profile Information (as default selected)
      React.createElement(Grid, { item: true, xs: 12, md: 8, lg: 9, key: 'settings-content' },
        React.createElement(Paper, { sx: { p: 3 } }, [
          // Content header
          React.createElement(Box, { sx: { mb: 4 } }, [
            React.createElement(Typography, { variant: 'h6', gutterBottom: true }, 'Profile Information'),
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 
              'Manage your personal information, contact details, and account settings'
            )
          ]),
          
          // Profile form
          React.createElement(Grid, { container: true, spacing: 3 }, [
            // Full name
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Full Name'),
              React.createElement('input', {
                type: 'text',
                value: userData.name,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              })
            ]),
            
            // Email
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Email Address'),
              React.createElement('input', {
                type: 'email',
                value: userData.email,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              })
            ]),
            
            // Phone
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Phone Number'),
              React.createElement('input', {
                type: 'tel',
                value: userData.phone,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              })
            ]),
            
            // Timezone
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Timezone'),
              React.createElement('select', {
                value: userData.preferences.timezone,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              }, [
                React.createElement('option', { value: 'GMT-4' }, 'Eastern Time (GMT-4)'),
                React.createElement('option', { value: 'GMT-5' }, 'Central Time (GMT-5)'),
                React.createElement('option', { value: 'GMT-7' }, 'Pacific Time (GMT-7)'),
                React.createElement('option', { value: 'GMT+0' }, 'London (GMT+0)'),
                React.createElement('option', { value: 'GMT+1' }, 'Central Europe (GMT+1)'),
                React.createElement('option', { value: 'GMT+8' }, 'Singapore/Hong Kong (GMT+8)')
              ])
            ]),
            
            // Default Currency
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Default Currency'),
              React.createElement('select', {
                value: userData.preferences.defaultCurrency,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              }, [
                React.createElement('option', { value: 'USD' }, 'US Dollar (USD)'),
                React.createElement('option', { value: 'EUR' }, 'Euro (EUR)'),
                React.createElement('option', { value: 'GBP' }, 'British Pound (GBP)'),
                React.createElement('option', { value: 'JPY' }, 'Japanese Yen (JPY)'),
                React.createElement('option', { value: 'CAD' }, 'Canadian Dollar (CAD)')
              ])
            ]),
            
            // Language
            React.createElement(Grid, { item: true, xs: 12, sm: 6 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Language'),
              React.createElement('select', {
                value: userData.preferences.language,
                style: {
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }
              }, [
                React.createElement('option', { value: 'English' }, 'English'),
                React.createElement('option', { value: 'Spanish' }, 'Spanish'),
                React.createElement('option', { value: 'French' }, 'French'),
                React.createElement('option', { value: 'German' }, 'German'),
                React.createElement('option', { value: 'Japanese' }, 'Japanese')
              ])
            ]),
            
            // Risk Profile
            React.createElement(Grid, { item: true, xs: 12, sm: 12 }, [
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', gutterBottom: true }, 'Risk Profile'),
              React.createElement(Box, { sx: { display: 'flex', gap: 2 } }, [
                ['conservative', 'moderate', 'aggressive'].map(risk => 
                  React.createElement(Box, { 
                    key: `risk-${risk}`,
                    sx: { 
                      flex: 1,
                      p: 2,
                      border: '1px solid',
                      borderColor: userData.preferences.riskProfile === risk ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: userData.preferences.riskProfile === risk ? 'primary.light' : 'background.paper'
                    }
                  }, [
                    React.createElement(Typography, { 
                      variant: 'subtitle2', 
                      color: userData.preferences.riskProfile === risk ? 'primary.main' : 'text.primary',
                      textTransform: 'capitalize'
                    }, risk),
                    React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 
                      risk === 'conservative' ? 'Lower risk, stable returns' :
                      risk === 'moderate' ? 'Balanced risk-reward' :
                      'Higher risk, growth focused'
                    )
                  ])
                )
              ])
            ])
          ]),
          
          // Form buttons
          React.createElement(Box, { sx: { mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 } }, [
            React.createElement('button', {
              style: {
                padding: '8px 16px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }
            }, 'Cancel'),
            
            React.createElement('button', {
              style: {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#1976d2',
                color: 'white',
                cursor: 'pointer'
              }
            }, 'Save Changes')
          ])
        ])
      )
    ])
  ]);
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return React.createElement(
    'div',
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `investor-portal-tabpanel-${index}`,
      'aria-labelledby': `investor-portal-tab-${index}`,
      ...other
    },
    value === index && React.createElement(Box, { sx: { p: 3 } }, children)
  );
}

export const InvestorPortalPage = observer(() => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return React.createElement(
    Box,
    { sx: { flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' } },
    [
      React.createElement(
        Paper,
        {
          sx: {
            borderRadius: 0,
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          key: 'tabs-container'
        },
        React.createElement(
          Tabs,
          {
            value: activeTab,
            onChange: handleTabChange,
            variant: 'scrollable',
            scrollButtons: 'auto',
            sx: {
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.875rem',
              },
            }
          },
          [
            React.createElement(
              Tab,
              {
                icon: React.createElement(Dashboard),
                label: 'Dashboard',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'dashboard-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(AccountBalance),
                label: 'Portfolio',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'portfolio-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Search),
                label: 'Opportunities',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'opportunities-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Assessment),
                label: 'Analytics',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'analytics-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Settings),
                label: 'Settings',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'settings-tab'
              }
            )
          ]
        )
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 0, key: 'dashboard-panel' },
        React.createElement(InvestorDashboard)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 1, key: 'portfolio-panel' },
        React.createElement(PortfolioOverview)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 2, key: 'opportunities-panel' },
        React.createElement(InvestmentOpportunities)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 3, key: 'analytics-panel' },
        React.createElement(InvestmentAnalytics)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 4, key: 'settings-panel' },
        React.createElement(InvestorSettings)
      )
    ]
  );
});

export default InvestorPortalPage;
