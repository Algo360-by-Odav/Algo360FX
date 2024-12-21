import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #0A1929 0%, #1A2027 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
});

const GridBackground = styled(Box)({
  position: 'absolute',
  width: '200%',
  height: '200%',
  top: '-50%',
  left: '-50%',
  backgroundImage: `
    linear-gradient(rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(66, 153, 225, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
  transform: 'rotate(-45deg)',
  opacity: 0,
  animation: 'fadeIn 3s ease-out forwards',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 0.5 }
  }
});

const Circle = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  border: '2px solid rgba(66, 153, 225, 0.3)',
  boxShadow: '0 0 20px rgba(66, 153, 225, 0.2)',
});

const DataPoint = styled(motion.div)({
  position: 'absolute',
  width: '6px',
  height: '6px',
  background: '#4299E1',
  borderRadius: '50%',
  boxShadow: '0 0 15px rgba(66, 153, 225, 0.6)',
});

const Line = styled(motion.div)({
  position: 'absolute',
  height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(66, 153, 225, 0.8), transparent)',
  transformOrigin: 'center',
});

const TextContainer = styled(motion.div)({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
});

const IntroAnimation: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 10000); // 10s total duration
    return () => clearTimeout(timer);
  }, [navigate]);

  // Expanding circles with 8-10s duration
  const circles = Array.from({ length: 3 }, (_, i) => ({
    size: (i + 1) * 300,
    delay: i * 2,
    duration: 8 + i * 1,
  }));

  // Rotating lines with 4s duration
  const lines = Array.from({ length: 12 }, (_, i) => ({
    rotation: (i * 30) % 360,
    delay: i * 0.2,
    length: 200 + Math.random() * 300,
  }));

  // Data points with 4s duration and 2-6s delay range
  const dataPoints = Array.from({ length: 20 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: 2 + Math.random() * 4,
  }));

  return (
    <Container>
      <GridBackground />

      {/* Expanding Circles */}
      {circles.map((circle, i) => (
        <Circle
          key={i}
          style={{
            width: circle.size,
            height: circle.size,
            left: '50%',
            top: '50%',
            marginLeft: -circle.size / 2,
            marginTop: -circle.size / 2,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.5],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: circle.delay,
          }}
        />
      ))}

      {/* Rotating Lines */}
      {lines.map((line, i) => (
        <Line
          key={i}
          style={{
            width: line.length,
            transform: `rotate(${line.rotation}deg)`,
            left: '50%',
            top: '50%',
            marginLeft: -line.length / 2,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Data Points */}
      {dataPoints.map((point, i) => (
        <DataPoint
          key={i}
          style={{
            left: point.x,
            top: point.y,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: point.delay,
          }}
        />
      ))}

      {/* Title Animation - 2s start, 1.5s fade-in */}
      <TextContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4299E1, #63B3ED, #90CDF4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(66, 153, 225, 0.3)',
            letterSpacing: '0.05em',
            mb: 2,
          }}
        >
          Algo360FX
        </Typography>
      </TextContainer>

      {/* Subtitle Animation - 3.5s start, 1.2s fade-in */}
      <TextContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 3.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 300,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            letterSpacing: '0.1em',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          Advanced Algorithmic Trading
        </Typography>
      </TextContainer>

      {/* Tagline Animation - 5s start, 1.2s fade-in */}
      <TextContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 5 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 300,
            mt: 2,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
            letterSpacing: '0.2em',
          }}
        >
          EMPOWERING YOUR TRADING DECISIONS
        </Typography>
      </TextContainer>
    </Container>
  );
};

export default IntroAnimation;
