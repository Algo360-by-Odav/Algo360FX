import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import { UI_CONFIG } from './constants';

// Declare module augmentation for custom colors and variants
declare module '@mui/material/styles' {
  interface Palette {
    trading: {
      profit: string;
      loss: string;
      neutral: string;
      chart: {
        background: string;
        grid: string;
        tooltip: string;
      };
    };
    custom: {
      divider: string;
      background: string;
      cardHeader: string;
      menuSelected: string;
      tooltipBackground: string;
    };
  }

  interface PaletteOptions {
    trading?: {
      profit: string;
      loss: string;
      neutral: string;
      chart: {
        background: string;
        grid: string;
        tooltip: string;
      };
    };
    custom?: {
      divider: string;
      background: string;
      cardHeader: string;
      menuSelected: string;
      tooltipBackground: string;
    };
  }
}

// Declare module augmentation for custom variants
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    trading: true;
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    gradient: true;
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
  },
};

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: UI_CONFIG.THEME.LIGHT.PRIMARY,
      light: UI_CONFIG.THEME.LIGHT.PRIMARY_LIGHT,
      dark: UI_CONFIG.THEME.LIGHT.PRIMARY_DARK,
    },
    secondary: {
      main: UI_CONFIG.THEME.LIGHT.SECONDARY,
      light: UI_CONFIG.THEME.LIGHT.SECONDARY_LIGHT,
      dark: UI_CONFIG.THEME.LIGHT.SECONDARY_DARK,
    },
    background: {
      default: UI_CONFIG.THEME.LIGHT.BACKGROUND,
      paper: UI_CONFIG.THEME.LIGHT.PAPER,
    },
    text: {
      primary: UI_CONFIG.THEME.LIGHT.TEXT_PRIMARY,
      secondary: UI_CONFIG.THEME.LIGHT.TEXT_SECONDARY,
    },
    divider: UI_CONFIG.THEME.LIGHT.DIVIDER,
    trading: {
      profit: '#4CAF50',
      loss: '#F44336',
      neutral: '#9E9E9E',
      chart: {
        background: '#FFFFFF',
        grid: '#E0E0E0',
        tooltip: '#F5F5F5',
      },
    },
    custom: {
      divider: '#E0E0E0',
      background: '#F5F5F5',
      cardHeader: '#FAFAFA',
      menuSelected: '#E3F2FD',
      tooltipBackground: '#616161',
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: UI_CONFIG.THEME.DARK.PRIMARY,
      light: UI_CONFIG.THEME.DARK.PRIMARY_LIGHT,
      dark: UI_CONFIG.THEME.DARK.PRIMARY_DARK,
    },
    secondary: {
      main: UI_CONFIG.THEME.DARK.SECONDARY,
      light: UI_CONFIG.THEME.DARK.SECONDARY_LIGHT,
      dark: UI_CONFIG.THEME.DARK.SECONDARY_DARK,
    },
    background: {
      default: UI_CONFIG.THEME.DARK.BACKGROUND,
      paper: UI_CONFIG.THEME.DARK.PAPER,
    },
    text: {
      primary: UI_CONFIG.THEME.DARK.TEXT_PRIMARY,
      secondary: UI_CONFIG.THEME.DARK.TEXT_SECONDARY,
    },
    divider: UI_CONFIG.THEME.DARK.DIVIDER,
    trading: {
      profit: '#4CAF50',
      loss: '#F44336',
      neutral: '#9E9E9E',
      chart: {
        background: '#1E1E1E',
        grid: '#424242',
        tooltip: '#424242',
      },
    },
    custom: {
      divider: '#424242',
      background: '#121212',
      cardHeader: '#272727',
      menuSelected: '#1E88E5',
      tooltipBackground: '#424242',
    },
  },
});

export const theme = lightTheme; // Default theme
export const getTheme = (mode: 'light' | 'dark'): Theme => mode === 'light' ? lightTheme : darkTheme;
