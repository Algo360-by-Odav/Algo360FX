import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    trading: {
      profit: string;
      loss: string;
      neutral: string;
      buy: string;
      sell: string;
    };
    chart: {
      background: string;
      grid: string;
      text: string;
    };
    glass: {
      background: string;
      border: string;
      hover: string;
    };
  }

  interface PaletteOptions {
    trading?: {
      profit?: string;
      loss?: string;
      neutral?: string;
      buy?: string;
      sell?: string;
    };
    chart?: {
      background?: string;
      grid?: string;
      text?: string;
    };
    glass?: {
      background?: string;
      border?: string;
      hover?: string;
    };
  }
}

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6b46c1',
      light: '#805ad5',
      dark: '#553c9a',
    },
    secondary: {
      main: '#38b2ac',
      light: '#4fd1c5',
      dark: '#2c7a7b',
    },
    background: {
      default: '#0d1123',
      paper: 'rgba(17, 25, 40, 0.95)',
    },
    trading: {
      profit: '#48bb78',
      loss: '#f56565',
      neutral: '#a0aec0',
      buy: '#38b2ac',
      sell: '#f56565',
    },
    chart: {
      background: 'rgba(17, 25, 40, 0.7)',
      grid: 'rgba(255, 255, 255, 0.1)',
      text: 'rgba(255, 255, 255, 0.7)',
    },
    glass: {
      background: 'rgba(17, 25, 40, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(17, 25, 40, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.1)',
    '0 2px 4px rgba(0, 0, 0, 0.1)',
    '0 4px 8px rgba(0, 0, 0, 0.1)',
    '0 8px 16px rgba(0, 0, 0, 0.1)',
    '0 12px 24px rgba(0, 0, 0, 0.1)',
    '0 16px 32px rgba(0, 0, 0, 0.1)',
    '0 20px 40px rgba(0, 0, 0, 0.1)',
    // ... rest of the shadows array
  ],
});

const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(135deg, ${baseTheme.palette.background.default}, ${alpha(
            baseTheme.palette.primary.dark,
            0.1
          )})`,
          minHeight: '100vh',
          scrollBehavior: 'smooth',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
        contained: {
          background: `linear-gradient(135deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.primary.dark})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${baseTheme.palette.primary.dark}, ${baseTheme.palette.primary.main})`,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: baseTheme.palette.glass.background,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${baseTheme.palette.glass.border}`,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: baseTheme.palette.glass.background,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${baseTheme.palette.glass.border}`,
          '&:hover': {
            backgroundColor: baseTheme.palette.glass.hover,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${baseTheme.palette.glass.border}`,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
