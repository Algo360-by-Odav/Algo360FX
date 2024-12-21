import React from 'react';
import { Stack, StackProps } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';

interface ResponsiveStackProps extends Omit<StackProps, 'direction'> {
  mobileDirection?: StackProps['direction'];
  desktopDirection?: StackProps['direction'];
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  mobileDirection = 'column',
  desktopDirection = 'row',
  breakpoint = 'md',
  children,
  ...other
}) => {
  const isDesktop = useResponsive('up', breakpoint);

  return (
    <Stack
      direction={isDesktop ? desktopDirection : mobileDirection}
      {...other}
    >
      {children}
    </Stack>
  );
};

export default ResponsiveStack;
