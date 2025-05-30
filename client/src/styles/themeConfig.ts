/**
 * Centralized theme configuration for Algo360FX application
 * Provides consistent styling and responsive design for all screen sizes
 */

import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

/**
 * Create a responsive theme that automatically adjusts to screen size
 * @param mode 'light' or 'dark' theme variant
 * @returns Responsive Material-UI theme
 */
export const createResponsiveTheme = (mode: 'light' | 'dark'): Theme => {
  // Create base theme with customizations
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      background: {
        default: mode === 'dark' ? '#0A192F' : '#f5f5f5',
        paper: mode === 'dark' ? '#1A2B45' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none', // Avoid ALL CAPS buttons
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          sizeSmall: {
            height: '32px',
          }
        },
        defaultProps: {
          disableElevation: true,
        }
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: 'hidden',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minWidth: {
              xs: '72px',
              sm: '90px',
            },
          },
        },
      },
      // Special mobile adjustments
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '16px',
            '@media (min-width:600px)': {
              padding: '20px 24px',
            },
          },
        },
      },
      // Adjust list items for touch targets on mobile
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: '8px',
            paddingBottom: '8px',
            '@media (max-width:600px)': {
              paddingTop: '10px',
              paddingBottom: '10px',
            },
          },
        },
      },
      // Adjust table cells for mobile
      MuiTableCell: {
        styleOverrides: {
          root: {
            '@media (max-width:600px)': {
              padding: '8px',
            },
          },
        },
      },
    },
    // Add breakpoints for consistent responsive design
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  // Apply responsive font sizes
  theme = responsiveFontSizes(theme);

  return theme;
};
