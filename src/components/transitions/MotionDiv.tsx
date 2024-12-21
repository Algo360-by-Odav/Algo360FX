import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';
import { transitions } from '../../theme/animations';

interface MotionDivProps extends BoxProps {
  animate?: 'fadeIn' | 'slideUp' | 'slideRight' | 'scale' | 'bounce';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export function MotionDiv({
  animate = 'fadeIn',
  delay = 0,
  duration,
  children,
  sx,
  ...props
}: MotionDivProps) {
  const { isPrefersReducedMotion, getAnimationDuration } = useResponsive(
    'up',
    'xs'
  );

  const getAnimation = () => {
    if (isPrefersReducedMotion) return '';

    const actualDuration = duration || getAnimationDuration();
    const timing = transitions.spring;

    switch (animate) {
      case 'fadeIn':
        return keyframes`
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        `;
      case 'slideUp':
        return keyframes`
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        `;
      case 'slideRight':
        return keyframes`
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        `;
      case 'scale':
        return keyframes`
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        `;
      case 'bounce':
        return keyframes`
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          70% {
            opacity: 0.9;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        `;
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        animation: isPrefersReducedMotion
          ? undefined
          : `${getAnimation()} ${duration || getAnimationDuration()}ms ${
              transitions.spring
            } ${delay}ms both`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
