import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  animation: 'fadeIn 2s ease-out forwards',
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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 8 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 8000);

    // Navigate after exit animation (2 seconds later)
    const navigationTimer = setTimeout(() => {
      navigate('/auth/login', { replace: true });
    }, 10000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  // Expanding circles with 6-8s duration
  const circles = Array.from({ length: 3 }, (_, i) => ({
    size: (i + 1) * 300,
    delay: i * 1.5,
    duration: 6 + i * 1,
  }));

  // Rotating lines with 3s duration
  const lines = Array.from({ length: 12 }, (_, i) => ({
    rotation: (i * 30) % 360,
    delay: i * 0.15,
    length: 200 + Math.random() * 300,
  }));

  // Data points with 3s duration and 1-4s delay range
  const dataPoints = Array.from({ length: 20 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: 1 + Math.random() * 3,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Container>
          <GridBackground />

          {circles.map((circle, i) => (
            <Circle
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isExiting ? 0 : 1, 
                opacity: isExiting ? 0 : 0.3 
              }}
              transition={{
                scale: { delay: circle.delay, duration: circle.duration, ease: 'easeOut' },
                opacity: { delay: circle.delay, duration: circle.duration * 0.5, ease: 'easeOut' }
              }}
              style={{
                width: circle.size,
                height: circle.size,
              }}
            />
          ))}

          {lines.map((line, i) => (
            <Line
              key={i}
              initial={{ scaleX: 0, opacity: 0, rotate: line.rotation }}
              animate={{ 
                scaleX: isExiting ? 0 : 1, 
                opacity: isExiting ? 0 : 0.6 
              }}
              transition={{
                scaleX: { delay: line.delay, duration: 3, ease: 'easeOut' },
                opacity: { delay: line.delay, duration: 2, ease: 'easeOut' }
              }}
              style={{
                width: line.length,
                transform: `rotate(${line.rotation}deg)`,
              }}
            />
          ))}

          {dataPoints.map((point, i) => (
            <DataPoint
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isExiting ? 0 : 1, 
                opacity: isExiting ? 0 : 1 
              }}
              transition={{
                scale: { delay: point.delay, duration: 1, ease: 'easeOut' },
                opacity: { delay: point.delay, duration: 0.5, ease: 'easeOut' }
              }}
              style={{
                left: point.x,
                top: point.y,
              }}
            />
          ))}

          <TextContainer
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: isExiting ? 20 : 0, 
              opacity: isExiting ? 0 : 1 
            }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: '#fff',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(66, 153, 225, 0.5)',
                mb: 2,
              }}
            >
              Algo360FX
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textShadow: '0 0 10px rgba(66, 153, 225, 0.3)',
              }}
            >
              Your Advanced Trading Platform
            </Typography>
          </TextContainer>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroAnimation;
