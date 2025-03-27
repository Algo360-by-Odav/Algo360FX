import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: '/images/trading-platform.svg',
    title: 'We Put Our Traders First',
    subtitle: 'Take advantage of competitive trading costs that beat 80% of the competition. All the tools you need for trading success.',
    cta: 'Try Demo',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    title: 'Professional Trading Environment',
    subtitle: 'Access advanced charting, real-time market data, and powerful trading tools designed for both novice and experienced traders.',
    cta: 'Explore Features',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    title: 'Trade Anywhere, Anytime',
    subtitle: 'Experience seamless trading on any device with our advanced mobile platform. Stay connected to the markets 24/7.',
    cta: 'Get Started',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
];

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);

const HeroSlider: React.FC = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <MotionBox
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          sx={{
            background: slides[currentSlide].backgroundColor,
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 12 },
            color: 'white',
            position: 'relative',
          }}
        >
          <MotionContainer maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Box>
                <MotionTypography
                  variant="h2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  fontWeight="bold"
                  gutterBottom
                >
                  {slides[currentSlide].title}
                </MotionTypography>
                <MotionTypography
                  variant="h5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  sx={{ mb: 4, opacity: 0.9 }}
                >
                  {slides[currentSlide].subtitle}
                </MotionTypography>
                <Stack
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                >
                  <MotionButton
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.white, 0.9),
                      },
                    }}
                  >
                    {slides[currentSlide].cta}
                  </MotionButton>
                  <MotionButton
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: alpha(theme.palette.common.white, 0.9),
                        bgcolor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    Learn More
                  </MotionButton>
                </Stack>
              </Box>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'contain',
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                    p: 2,
                  }}
                />
              </Box>
            </Box>
          </MotionContainer>
        </MotionBox>
      </AnimatePresence>
      
      {/* Slide indicators */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: currentSlide === index ? 'white' : alpha('#fff', 0.5),
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default HeroSlider;
