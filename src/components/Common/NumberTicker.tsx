import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

interface NumberTickerProps {
  value?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  size?: 'small' | 'medium' | 'large';
  isPrice?: boolean;
}

const NumberTicker: React.FC<NumberTickerProps> = ({
  value = 0,
  precision = 2,
  prefix = '',
  suffix = '',
  size = 'medium',
  isPrice = false,
}) => {
  const spring = useSpring({
    number: value || 0,
    from: { number: 0 },
    config: { tension: 300, friction: 30 },
  });

  const formatNumber = (num: number) => {
    if (isPrice) {
      return num.toFixed(precision);
    }

    const absNum = Math.abs(num);
    if (absNum >= 1e9) {
      return (num / 1e9).toFixed(precision) + 'B';
    } else if (absNum >= 1e6) {
      return (num / 1e6).toFixed(precision) + 'M';
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(precision) + 'K';
    }
    return num.toFixed(precision);
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.5rem';
      default:
        return '1rem';
    }
  };

  const getColor = () => {
    if (value === undefined || value === 0) return 'text.primary';
    return value > 0 ? 'success.main' : 'error.main';
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Typography
        component="div"
        sx={{
          fontSize: getFontSize(),
          fontFamily: 'monospace',
          color: getColor(),
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {prefix}
        <animated.span>
          {spring.number.to((num: number) => formatNumber(num))}
        </animated.span>
        {suffix}
      </Typography>
    </Box>
  );
};

export default NumberTicker;
