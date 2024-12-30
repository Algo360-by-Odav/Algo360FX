import { useCallback } from 'react';
import { alpha, Theme } from '@mui/material/styles';
import { useRootStore } from './useRootStore';

type ColorPreset = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red';

interface PresetColor {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
}

const presets: Record<ColorPreset, PresetColor> = {
  default: {
    name: 'Default',
    lighter: '#C8FACD',
    light: '#5BE584',
    main: '#00AB55',
    dark: '#007B55',
    darker: '#005249',
    contrastText: '#FFFFFF',
  },
  purple: {
    name: 'Purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635DC',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#FFFFFF',
  },
  cyan: {
    name: 'Cyan',
    lighter: '#D1FFFC',
    light: '#76F2FF',
    main: '#1CCAFF',
    dark: '#0E77B7',
    darker: '#053D7A',
    contrastText: '#FFFFFF',
  },
  blue: {
    name: 'Blue',
    lighter: '#D1E9FC',
    light: '#76B0F1',
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64',
    contrastText: '#FFFFFF',
  },
  orange: {
    name: 'Orange',
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#FDA92E',
    dark: '#B66816',
    darker: '#793908',
    contrastText: '#FFFFFF',
  },
  red: {
    name: 'Red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#FFFFFF',
  },
};

export const useColorPreset = () => {
  const { settingsStore } = useRootStore();

  const setColorPreset = useCallback(
    (preset: ColorPreset) => {
      settingsStore.updateAppearanceSettings({
        colorPreset: preset,
      });
    },
    [settingsStore]
  );

  const getPresetColor = useCallback(
    (preset: ColorPreset = 'default') => presets[preset],
    []
  );

  return {
    presets,
    currentPreset: settingsStore.appearance.colorPreset,
    setColorPreset,
    getPresetColor,
  };
};

// Helper function to get alpha colors
export const getAlphaColors = (theme: Theme) => ({
  primary: {
    lighter: alpha(theme.palette.primary.main, 0.08),
    light: alpha(theme.palette.primary.main, 0.16),
    main: alpha(theme.palette.primary.main, 0.24),
    dark: alpha(theme.palette.primary.main, 0.32),
    darker: alpha(theme.palette.primary.main, 0.48),
  },
  secondary: {
    lighter: alpha(theme.palette.secondary.main, 0.08),
    light: alpha(theme.palette.secondary.main, 0.16),
    main: alpha(theme.palette.secondary.main, 0.24),
    dark: alpha(theme.palette.secondary.main, 0.32),
    darker: alpha(theme.palette.secondary.main, 0.48),
  },
  info: {
    lighter: alpha(theme.palette.info.main, 0.08),
    light: alpha(theme.palette.info.main, 0.16),
    main: alpha(theme.palette.info.main, 0.24),
    dark: alpha(theme.palette.info.main, 0.32),
    darker: alpha(theme.palette.info.main, 0.48),
  },
  success: {
    lighter: alpha(theme.palette.success.main, 0.08),
    light: alpha(theme.palette.success.main, 0.16),
    main: alpha(theme.palette.success.main, 0.24),
    dark: alpha(theme.palette.success.main, 0.32),
    darker: alpha(theme.palette.success.main, 0.48),
  },
  warning: {
    lighter: alpha(theme.palette.warning.main, 0.08),
    light: alpha(theme.palette.warning.main, 0.16),
    main: alpha(theme.palette.warning.main, 0.24),
    dark: alpha(theme.palette.warning.main, 0.32),
    darker: alpha(theme.palette.warning.main, 0.48),
  },
  error: {
    lighter: alpha(theme.palette.error.main, 0.08),
    light: alpha(theme.palette.error.main, 0.16),
    main: alpha(theme.palette.error.main, 0.24),
    dark: alpha(theme.palette.error.main, 0.32),
    darker: alpha(theme.palette.error.main, 0.48),
  },
});
