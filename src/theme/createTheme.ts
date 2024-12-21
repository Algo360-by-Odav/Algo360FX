import { Theme, createTheme as createMuiTheme } from '@mui/material/styles';
import { CSSProperties } from '@mui/material/styles/createMixins';
import { deepmerge } from '@mui/utils';

import { darkPalette, lightPalette } from './palette';
import typography from './typography';
import { createShadow, createCustomShadow } from './shadows';
import getOverrides from './overrides';

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
      card: string;
      dialog: string;
      dropdown: string;
    };
  }
  interface ThemeOptions {
    customShadows?: Theme['customShadows'];
  }
}

interface ThemeConfig {
  mode: 'light' | 'dark';
  direction?: 'ltr' | 'rtl';
}

export const createTheme = (config: ThemeConfig) => {
  const { mode = 'light', direction = 'ltr' } = config;

  const palette = mode === 'light' ? lightPalette : darkPalette;
  const shadows = createShadow(mode === 'light' ? '#919EAB' : '#000000');
  const customShadows = createCustomShadow(palette);

  const baseTheme = createMuiTheme({
    palette,
    typography,
    shape: { borderRadius: 8 },
    direction,
    shadows: shadows as Theme['shadows'],
    customShadows,
    mixins: {
      toolbar: {
        minHeight: 64,
        paddingTop: 8,
        paddingBottom: 8,
      } as CSSProperties,
    },
  });

  return deepmerge(baseTheme, {
    components: getOverrides(baseTheme),
  });
};
