import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    neutral: string;
  }

  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }

  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
}

export interface CustomThemeOptions {
  neutral: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  chart: {
    background: string;
    gridLines: string;
    text: string;
    upColor: string;
    downColor: string;
  };
  trading: {
    profit: string;
    loss: string;
    pending: string;
  };
}

export interface Theme extends MuiTheme {
  palette: MuiTheme['palette'] & {
    neutral: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  };
  custom: CustomThemeOptions;
}

export interface ThemeOptions extends MuiThemeOptions {
  palette?: MuiThemeOptions['palette'] & {
    neutral?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  };
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'comfortable';
  borderRadius: number;
}
