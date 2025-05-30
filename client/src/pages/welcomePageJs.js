// welcomePageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
  Paper,
  Rating,
  alpha,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ForexPairs from '../components/trading/ForexPairs';
import HeroSlider from '../components/marketing/HeroSlider';
// Auth is now handled differently, no need to import useAuth
import TrulyStandalonePage from '../components/layout/TrulyStandalonePage';

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionButton = motion.create(Button);

// Testimonial data
const testimonials = [
  {
    name: "Adrian",
    date: "October 30",
    rating: 5,
    comment: "Algo360FX has transformed my trading strategy. The AI-powered signals are incredibly accurate!",
    verified: true
  },
  {
    name: "Sarah",
    date: "November 15",
    rating: 5,
    comment: "The platform is intuitive and the educational resources are top-notch. Highly recommended!",
    verified: true
  },
  {
    name: "Michael",
    date: "December 2",
    rating: 4,
    comment: "Great platform with excellent customer support. The advanced charting tools are exceptional.",
    verified: true
  }
];

// Trading assets
const tradingAssets = [
  { type: 'Forex', count: 50 },
  { type: 'Crypto CFDs', count: 30 },
  { type: 'Share CFDs', count: 100 },
  { type: 'Commodities', count: 15 },
  { type: 'Spot Metals', count: 10 },
  { type: 'Energies', count: 8 },
  { type: 'Indices', count: 20 }
];

// Features data
const features = [
  {
    icon: TimelineIcon,
    title: "Advanced Trading Tools",
    description: "Access professional-grade charting, technical indicators, and automated trading systems."
  },
  {
    icon: SecurityIcon,
    title: "Secure Platform",
    description: "Your funds and data are protected with bank-level encryption and security protocols."
  },
  {
    icon: LanguageIcon,
    title: "Global Market Access",
    description: "Trade on international markets 24/7 with competitive spreads and low latency execution."
  },
  {
    icon: PaymentIcon,
    title: "Flexible Payment Options",
    description: "Multiple deposit and withdrawal methods including crypto for your convenience."
  }
];

const WelcomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Authentication is disabled, using direct navigation

  const handleGetStarted = () => {
    // Direct navigation to dashboard since authentication is disabled
    navigate('/dashboard');
  };

  // Create hero section
  const createHeroSection = () => {
    return React.createElement(Box, {
      component: MotionBox,
      sx: {
        bgcolor: 'background.paper',
        pt: { xs: 5, md: 8 },
        pb: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden'
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8 }
    },
      React.createElement(Container, { maxWidth: "lg" },
        React.createElement(Grid, { container: true, spacing: 4, alignItems: "center" },
          // Left column with text
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(Typography, {
              component: "h1",
              variant: "h2",
              color: "primary",
              fontWeight: "bold",
              gutterBottom: true,
              sx: { fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' } }
            }, "Next-Gen Trading Platform"),
            
            React.createElement(Typography, {
              variant: "body1",
              color: "text.secondary",
              paragraph: true,
              mb: { xs: 3, md: 4 },
              sx: { fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }
            }, "Experience the future of trading with AI-powered signals, advanced analytics, and seamless execution."),
            
            React.createElement(Stack, {
              direction: "row",
              spacing: 2
            },
              React.createElement(Button, {
                component: MotionButton,
                variant: "contained",
                size: "large",
                onClick: handleGetStarted,
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
              }, "Get Started"),
              
              React.createElement(Button, {
                variant: "outlined",
                size: "large",
                onClick: () => navigate('/trading-platform')
              }, "Try Demo")
            )
          ),
          
          // Right column with slider
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(HeroSlider)
          )
        )
      )
    );
  };

  // Create features section
  const createFeaturesSection = () => {
    return React.createElement(Box, {
      sx: { 
        py: { xs: 5, md: 8 },
        px: { xs: 1, sm: 2, md: 3 }, 
        bgcolor: alpha(theme.palette.primary.main, 0.05) 
      }
    },
      React.createElement(Container, { maxWidth: "lg" },
        React.createElement(Typography, {
          variant: "h3",
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 4, md: 6 },
          sx: { fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }
        }, "Why Choose Algo360FX"),
        
        React.createElement(Grid, { container: true, spacing: 4 },
          features.map((feature, index) => 
            React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: index },
              React.createElement(Card, {
                elevation: 0,
                sx: {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }
              },
                React.createElement(CardContent, { sx: { flexGrow: 1, textAlign: 'center' } },
                  React.createElement(feature.icon, {
                    sx: { fontSize: 60, color: 'primary.main', mb: 2 }
                  }),
                  React.createElement(Typography, {
                    gutterBottom: true,
                    variant: "h5",
                    component: "h2",
                    fontWeight: "bold"
                  }, feature.title),
                  React.createElement(Typography, {
                    variant: "body1",
                    color: "text.secondary"
                  }, feature.description)
                )
              )
            )
          )
        )
      )
    );
  };

  // Create trading assets section
  const createTradingAssetsSection = () => {
    return React.createElement(Box, { sx: { py: { xs: 5, md: 8 }, px: { xs: 1, sm: 2, md: 3 } } },
      React.createElement(Container, { maxWidth: "lg" },
        React.createElement(Typography, {
          variant: "h3",
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 4, md: 6 },
          sx: { fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }
        }, "Diverse Trading Assets"),
        
        React.createElement(Grid, { container: true, spacing: 2 },
          tradingAssets.map((asset, index) => 
            React.createElement(Grid, { item: true, xs: 6, sm: 4, md: 3, lg: 'auto', key: asset.type },
              React.createElement(Paper, {
                sx: {
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              },
                React.createElement(Typography, { variant: "h6", fontWeight: "bold" },
                  asset.count
                ),
                React.createElement(Typography, { variant: "body2" },
                  asset.type
                )
              )
            )
          )
        ),
        
        React.createElement(Box, { mt: 6 },
          React.createElement(Typography, {
            variant: "h4",
            textAlign: "center",
            mb: 4
          }, "Live Forex Pairs"),
          
          React.createElement(ForexPairs)
        )
      )
    );
  };

  // Create testimonials section
  const createTestimonialsSection = () => {
    return React.createElement(Box, {
      sx: { 
        py: { xs: 5, md: 8 }, 
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: alpha(theme.palette.primary.main, 0.05) 
      }
    },
      React.createElement(Container, { maxWidth: "lg" },
        React.createElement(Typography, {
          variant: "h3",
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 4, md: 6 },
          sx: { fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }
        }, "What Our Traders Say"),
        
        React.createElement(Grid, { container: true, spacing: 4 },
          testimonials.map((testimonial, index) => 
            React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 4, key: index },
              React.createElement(Card, {
                sx: {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2
                }
              },
                React.createElement(CardContent, { sx: { flexGrow: 1 } },
                  React.createElement(Box, {
                    sx: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }
                  },
                    React.createElement(Typography, { variant: "h6", fontWeight: "bold" },
                      testimonial.name
                    ),
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                      testimonial.date
                    )
                  ),
                  
                  React.createElement(Box, {
                    sx: {
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }
                  },
                    React.createElement(Rating, {
                      value: testimonial.rating,
                      readOnly: true,
                      icon: React.createElement(StarIcon, { fontSize: "small" }),
                      emptyIcon: React.createElement(StarIcon, { fontSize: "small" })
                    }),
                    testimonial.verified && 
                      React.createElement(Box, {
                        sx: {
                          display: 'flex',
                          alignItems: 'center',
                          ml: 2
                        }
                      },
                        React.createElement(VerifiedIcon, {
                          fontSize: "small",
                          color: "primary",
                          sx: { mr: 0.5 }
                        }),
                        React.createElement(Typography, { variant: "caption" },
                          "Verified Trader"
                        )
                      )
                  ),
                  
                  React.createElement(Typography, { variant: "body1" },
                    testimonial.comment
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Create CTA section
  const createCTASection = () => {
    return React.createElement(Box, {
      sx: {
        py: { xs: 6, md: 10 },
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: 'primary.main',
        color: 'white',
        textAlign: 'center'
      }
    },
      React.createElement(Container, { maxWidth: "md" },
        React.createElement(Typography, {
          variant: "h3",
          fontWeight: "bold",
          mb: { xs: 2, md: 3 },
          sx: { fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }
        }, "Ready to Transform Your Trading?"),
        
        React.createElement(Typography, {
          variant: "body1",
          mb: { xs: 3, md: 4 },
          sx: { fontSize: { xs: '1rem', sm: '1.25rem' } }
        }, "Join thousands of traders using Algo360FX to achieve their financial goals."),
        
        React.createElement(Button, {
          variant: "contained",
          size: "large",
          onClick: handleGetStarted,
          sx: {
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.9)
            },
            px: 4,
            py: 1.5
          }
        }, "Get Started Now")
      )
    );
  };

  // Main render
  return React.createElement(TrulyStandalonePage, null,
    React.createElement(React.Fragment, null,
      createHeroSection(),
      createFeaturesSection(),
      createTradingAssetsSection(),
      createTestimonialsSection(),
      createCTASection()
    )
  );
};

export default WelcomePage;
