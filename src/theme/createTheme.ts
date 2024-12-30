import { createTheme as createMuiTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      z1: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
    };
  }
  interface ThemeOptions {
    customShadows?: Theme['customShadows'];
  }
}

interface ThemeConfig {
  mode: 'light' | 'dark';
}

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  customShadows: {
    z1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    z8: '0 8px 16px -8px rgba(0, 0, 0, 0.24)',
    z12: '0 12px 24px -12px rgba(0, 0, 0, 0.24)',
    z16: '0 16px 32px -16px rgba(0, 0, 0, 0.24)',
    z20: '0 20px 40px -20px rgba(0, 0, 0, 0.24)',
    z24: '0 24px 48px -24px rgba(0, 0, 0, 0.24)',
    primary: '0 8px 16px 0 rgba(24, 144, 255, 0.24)',
    secondary: '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
    info: '0 8px 16px 0 rgba(0, 123, 255, 0.24)',
    success: '0 8px 16px 0 rgba(40, 199, 111, 0.24)',
    warning: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
    error: '0 8px 16px 0 rgba(255, 77, 79, 0.24)',
  },
};

const getDesignTokens = (mode: ThemeConfig['mode']) => ({
  palette: {
    mode,
    primary: {
      main: '#3366FF',
      light: '#84A9FF',
      dark: '#1939B7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#22C55E',
      light: '#7CD992',
      dark: '#118D57',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF5630',
      light: '#FFAC82',
      dark: '#B71D18',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFAB00',
      light: '#FFD666',
      dark: '#B76E00',
      contrastText: '#212B36',
    },
    info: {
      main: '#00B8D9',
      light: '#61F3F3',
      dark: '#006C9C',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#36B37E',
      light: '#86E8AB',
      dark: '#1B806A',
      contrastText: '#FFFFFF',
    },
    grey: {
      100: '#F9FAFB',
      200: '#F4F6F8',
      300: '#DFE3E8',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#212B36',
      900: '#161C24',
    },
    text: {
      primary: '#212B36',
      secondary: '#637381',
      disabled: '#919EAB',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F9FAFB',
    },
    action: {
      active: '#637381',
      hover: 'rgba(145, 158, 171, 0.08)',
      selected: 'rgba(145, 158, 171, 0.16)',
      disabled: 'rgba(145, 158, 171, 0.8)',
      disabledBackground: 'rgba(145, 158, 171, 0.24)',
      focus: 'rgba(145, 158, 171, 0.24)',
    },
    divider: '#DFE3E8',
  },
});

export const createTheme = (options: ThemeConfig, ...args: object[]) => {
  const mergedOptions = deepmerge(baseOptions, getDesignTokens(options.mode));
  let theme = createMuiTheme(mergedOptions, ...args);

  theme = deepmerge(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            width: '100%',
            height: '100%',
            WebkitOverflowScrolling: 'touch',
          },
          body: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.default,
          },
          '#root': {
            width: '100%',
            height: '100%',
          },
          input: {
            '&[type=number]': {
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
              '&::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
            },
          },
          img: {
            display: 'block',
            maxWidth: '100%',
          },
        },
      },
    },
  });

  return theme;
};
