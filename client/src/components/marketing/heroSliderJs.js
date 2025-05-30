// heroSliderJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Slide data
const slides = [
  {
    image: '/images/carousel/professional_trading.jpg', // Image 3 (Team meeting with charts)
    title: 'Professional Trading Environment',
    subtitle: 'Access advanced charting, real-time market data, and powerful trading tools designed for both novice and experienced traders.',
    cta: 'Explore Features',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
  {
    image: '/images/carousel/trader_first.jpg', // Image 1 (Business woman with laptop)
    title: 'We Put Our Traders First',
    subtitle: 'Take advantage of competitive trading costs that beat 80% of the competition. All the tools you need for trading success.',
    cta: 'Try Demo',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
  {
    image: '/images/carousel/trade_anywhere.jpg', // Image 2 (Child with colorful paper crane)
    title: 'Trade Anywhere, Anytime',
    subtitle: 'Experience seamless trading on any device with our advanced mobile platform. Stay connected to the markets 24/7.',
    cta: 'Get Started',
    backgroundColor: 'linear-gradient(45deg, #0A192F 30%, #1E3557 90%)',
  },
];

// Create motion components
const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);

const HeroSlider = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Create indicator dots
  const createIndicators = () => {
    return React.createElement(Stack, {
      direction: "row",
      spacing: 1,
      justifyContent: "center",
      sx: { mt: 4 }
    }, 
      slides.map((_, index) => 
        React.createElement(Box, {
          key: index,
          component: motion.div,
          sx: {
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: index === currentSlide ? 'primary.main' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
          },
          onClick: () => setCurrentSlide(index),
          whileHover: { scale: 1.2 }
        })
      )
    );
  };

  // Create the current slide content
  const createSlideContent = () => {
    const slide = slides[currentSlide];
    
    return React.createElement(MotionBox, {
      key: currentSlide,
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
      transition: { duration: 0.5 },
      sx: {
        background: slide.backgroundColor,
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        color: 'white',
        position: 'relative',
      }
    },
      React.createElement(MotionContainer, { maxWidth: "lg" },
        React.createElement(Box, {
          sx: {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }
        },
          // Left column - Text content
          React.createElement(Box, null,
            // Title
            React.createElement(MotionTypography, {
              variant: "h2",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              fontWeight: "bold",
              gutterBottom: true
            }, slide.title),
            
            // Subtitle
            React.createElement(MotionTypography, {
              variant: "h5",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              sx: { mb: 4, opacity: 0.9 }
            }, slide.subtitle),
            
            // Buttons
            React.createElement(Stack, {
              component: motion.div,
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.4 },
              direction: { xs: 'column', sm: 'row' },
              spacing: 2
            },
              React.createElement(MotionButton, {
                variant: "contained",
                size: "large",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
              }, slide.cta),
              
              React.createElement(Button, {
                variant: "outlined",
                size: "large",
                sx: {
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }
              }, "Learn More")
            )
          ),
          
          // Right column - Image
          React.createElement(Box, {
            component: motion.div,
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.2 },
            sx: {
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              height: 400,
              width: '100%',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }
          },
            React.createElement(Box, {
              component: "img",
              src: slide.image,
              alt: slide.title,
              sx: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }
            })
          )
        ),
        
        // Indicators
        createIndicators()
      )
    );
  };

  // Main component render
  return React.createElement(Box, { sx: { position: 'relative', overflow: 'hidden' } },
    React.createElement(AnimatePresence, { mode: "wait" },
      createSlideContent()
    )
  );
};

export default HeroSlider;
