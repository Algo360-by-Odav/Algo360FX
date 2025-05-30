/**
 * Responsive Utility Functions for Algo360FX
 * These utilities help ensure consistent mobile responsiveness across the application
 */

import { Theme } from '@mui/material/styles';

/**
 * Common responsive card styles that adapt to different screen sizes
 */
export const responsiveCardStyles = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  borderRadius: { xs: 1, sm: 2 },
  boxShadow: (theme: Theme) => 
    theme.palette.mode === 'dark' 
      ? '0 4px 20px 0 rgba(0,0,0,0.7)' 
      : '0 4px 20px 0 rgba(0,0,0,0.1)',
};

/**
 * Responsive padding that reduces on smaller screens
 */
export const responsivePadding = {
  p: { xs: 1.5, sm: 2, md: 3 },
};

/**
 * Responsive container styles for main content sections
 */
export const responsiveContainerStyles = {
  width: '100%',
  maxWidth: '100%',
  px: { xs: 1, sm: 2, md: 3 },
  py: { xs: 1.5, sm: 2, md: 3 },
  overflowX: 'hidden',
};

/**
 * Responsive grid container for card layouts
 */
export const responsiveGridContainer = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: { xs: 1.5, sm: 2, md: 3 },
  width: '100%',
};

/**
 * Responsive table styles for better mobile display
 */
export const responsiveTableStyles = {
  '& .MuiTableCell-root': {
    px: { xs: 1, sm: 2 },
    py: { xs: 1, sm: 1.5 },
    '&:first-of-type': {
      pl: { xs: 1, sm: 2 },
    },
    '&:last-of-type': {
      pr: { xs: 1, sm: 2 },
    },
  },
};

/**
 * Generate media query for mobile devices
 */
export const isMobileDevice = () => window.innerWidth < 600;

/**
 * Dynamic font sizes that adjust based on screen size
 */
export const responsiveTypography = {
  h1: { fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' } },
  h2: { fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem' } },
  h3: { fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' } },
  h4: { fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } },
  h5: { fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } },
  h6: { fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' } },
  body1: { fontSize: { xs: '0.875rem', sm: '1rem' } },
  body2: { fontSize: { xs: '0.75rem', sm: '0.875rem' } },
};

/**
 * Responsive button styles 
 */
export const responsiveButtonStyles = {
  px: { xs: 1.5, sm: 2, md: 3 },
  py: { xs: 0.5, sm: 0.75, md: 1 },
  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
};
