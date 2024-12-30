import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import AutoGraphRounded from '@mui/icons-material/AutoGraphRounded';

const AnimatedLogo: React.FC = () => {
  const theme = useTheme();

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 }
  };

  const dotTransition = {
    duration: 0.5,
    ease: "easeOut"
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AutoGraphRounded
            sx={{
              fontSize: '3rem',
              color: theme.palette.primary.main,
            }}
          />
          <Box
            component="span"
            sx={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
              letterSpacing: '0.05em',
            }}
          >
            Algo360FX
          </Box>
        </Box>
      </motion.div>

      {/* Animated Dots */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
        }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            transition={{
              ...dotTransition,
              delay: index * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.5
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default AnimatedLogo;
