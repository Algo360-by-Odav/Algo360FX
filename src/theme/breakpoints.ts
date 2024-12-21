const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

export default breakpoints;

// Breakpoint types for TypeScript
export type Breakpoint = keyof typeof breakpoints.values;
export type BreakpointValues = typeof breakpoints.values;

// Helper functions
export const up = (breakpoint: Breakpoint) => `@media (min-width:${breakpoints.values[breakpoint]}px)`;
export const down = (breakpoint: Breakpoint) => `@media (max-width:${breakpoints.values[breakpoint] - 0.05}px)`;
export const between = (start: Breakpoint, end: Breakpoint) =>
  `@media (min-width:${breakpoints.values[start]}px) and (max-width:${breakpoints.values[end] - 0.05}px)`;

// Responsive helpers
export const isWidthUp = (breakpoint: Breakpoint, width: number) => width >= breakpoints.values[breakpoint];
export const isWidthDown = (breakpoint: Breakpoint, width: number) => width < breakpoints.values[breakpoint];

// Hooks usage example:
/*
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Component = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    // Responsive layout based on breakpoints
  );
};
*/
