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
import { useAuth } from '@/context/AuthContext';

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionButton = motion.create(Button);

// Testimonial interface
interface Testimonial {
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
}

// Trading asset type
type TradingAssetType = 'Forex' | 'Crypto CFDs' | 'Share CFDs' | 'Commodities' | 'Spot Metals' | 'Energies' | 'Indices';

const testimonials: Testimonial[] = [
  {
    name: "Adrian",
    date: "October 30",
    rating: 5,
    comment: "Good spreads, and a good platform delivery, worthy of a live account",
    verified: true
  },
  {
    name: "Emre",
    date: "November 1",
    rating: 5,
    comment: "I think it is an extraordinary broker with the platform and the employees are very helpful",
    verified: true
  },
  {
    name: "Client",
    date: "November 4",
    rating: 5,
    comment: "Fast and helpful customer service ever, everything is great",
    verified: true
  }
];

const WelcomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [activeAsset, setActiveAsset] = React.useState<TradingAssetType>('Forex');
  const [showSignIn, setShowSignIn] = React.useState(false);

  const features = [
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Multi-Asset Platform',
      description: 'Multiple trading assets covering stocks, crypto, forex, commodities and more'
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Top Shelf Trading Environment',
      description: 'Enjoy top-shelf trading conditions, with costs that beat 80% of our peers'
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Veteran Expertise',
      description: "Our team consists of trading veterans with a deep, first-hand understanding of markets"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '100% Client Fund Segregation',
      description: 'Enjoy the assurance of complete fund segregation, ensuring your investments are secure and protected at all times with AA-rated banks'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Hassle-free Deposit & Withdrawal',
      description: 'Experience seamless transactions with over 20 payment options globally. Enjoy instant deposits and fast withdrawals'
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Fully Regulated Brokerage',
      description: "We're licensed and fully compliant across multiple jurisdictions to ensure the highest levels of integrity"
    }
  ];

  const tradingAssets = [
    { name: 'Forex', icon: '/images/forex-icon.svg' },
    { name: 'Crypto CFDs', icon: '/images/crypto-icon.svg' },
    { name: 'Share CFDs', icon: '/images/shares-icon.svg' },
    { name: 'Commodities', icon: '/images/commodities-icon.svg' },
    { name: 'Spot Metals', icon: '/images/metals-icon.svg' },
    { name: 'Energies', icon: '/images/energy-icon.svg' },
    { name: 'Indices', icon: '/images/indices-icon.svg' }
  ];

  return (
    <MotionBox sx={{ bgcolor: '#0A192F' }}>
      {/* Header with Logo and Auth Buttons */}
      <MotionContainer maxWidth="lg" sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/images/algo360fx-logo.svg"
            alt="ALGO360FX"
            sx={{
              height: 50,
              width: 'auto',
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/auth/signin')}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/auth/signup')}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </MotionContainer>

      {/* Hero Section */}
      <HeroSlider />

      {/* Trading Assets Section */}
      <MotionContainer maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {tradingAssets.map((asset, index) => (
            <Grid item key={index}>
              <Paper
                elevation={0}
                onClick={() => setActiveAsset(asset.name as TradingAssetType)}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: asset.name === activeAsset ? '#1E3557' : 'transparent',
                  color: asset.name === activeAsset ? 'white' : 'text.secondary',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: (theme) =>
                      asset.name === activeAsset
                        ? '#1E3557'
                        : alpha('#1E3557', 0.1),
                  },
                }}
              >
                <Typography variant="body1">
                  {asset.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Trading Asset Content */}
        <Box sx={{ mt: 4 }}>
          {activeAsset === 'Forex' && <ForexPairs />}
          {activeAsset === 'Crypto CFDs' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Cryptocurrency CFDs Trading
            </Typography>
          )}
          {activeAsset === 'Share CFDs' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Share CFDs Trading
            </Typography>
          )}
          {activeAsset === 'Commodities' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Commodities Trading
            </Typography>
          )}
          {activeAsset === 'Spot Metals' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Spot Metals Trading
            </Typography>
          )}
          {activeAsset === 'Energies' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Energy Products Trading
            </Typography>
          )}
          {activeAsset === 'Indices' && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Coming Soon: Global Indices Trading
            </Typography>
          )}
        </Box>
      </MotionContainer>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#0A192F', py: 8 }}>
        <MotionContainer maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ color: 'white', mb: 6 }}
          >
            Why Choose Algo360FX
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: '#1E3557',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#263B5C',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        color: 'primary.main',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MotionContainer>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#0A192F', py: 8 }}>
        <MotionContainer maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ color: 'white', mb: 6 }}
          >
            What Our Traders Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: '#1E3557',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#263B5C',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      {testimonial.verified && (
                        <VerifiedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      )}
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MotionContainer>
      </Box>

      {/* Mobile App Section */}
      <Box sx={{ bgcolor: '#0A192F', py: 8 }}>
        <MotionContainer maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ color: 'white' }}>
                Trade on the Go
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                Download our mobile app and trade from anywhere, at any time.
              </Typography>
              <Stack direction="row" spacing={2}>
                <MotionButton
                  variant="contained"
                  sx={{
                    bgcolor: '#1E3557',
                    '&:hover': { bgcolor: '#263B5C' },
                  }}
                >
                  <img
                    src="/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    style={{ height: 40 }}
                  />
                </MotionButton>
                <MotionButton
                  variant="contained"
                  sx={{
                    bgcolor: '#1E3557',
                    '&:hover': { bgcolor: '#263B5C' },
                  }}
                >
                  <img
                    src="/images/app-store-badge.png"
                    alt="Download on the App Store"
                    style={{ height: 40 }}
                  />
                </MotionButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/mobile-app-preview.svg"
                alt="Mobile App Preview"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </MotionContainer>
      </Box>

      {/* Footer Section */}
      <Box sx={{ bgcolor: '#0A192F', py: 4 }}>
        <MotionContainer maxWidth="lg">
          <Typography variant="body2" align="center" color="text.secondary">
            Made with ❤️ in Australia
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary" display="block" sx={{ mt: 2 }}>
            &copy; Copyright {new Date().getFullYear()} Algo360FX
          </Typography>
        </MotionContainer>
      </Box>
    </MotionBox>
  );
};

export default WelcomePage;