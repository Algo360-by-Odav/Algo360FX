import { createTheme, Theme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export type ThemeMode = 'light' | 'dark';

export const getThemedComponents = (mode: ThemeMode): Theme => {
  const baseTheme = mode === 'light' ? lightTheme : darkTheme;

  return createTheme(
    deepmerge(
      {
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === 'dark' ? '#6b6b6b transparent' : '#959595 transparent',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  width: 8,
                  height: 8,
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: mode === 'dark' ? '#6b6b6b' : '#959595',
                  border: '2px solid transparent',
                  backgroundClip: 'content-box',
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                  backgroundColor: mode === 'dark' ? '#848484' : '#757575',
                },
                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                  backgroundColor: mode === 'dark' ? '#848484' : '#757575',
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: mode === 'dark' ? '#848484' : '#757575',
                },
                '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                  backgroundColor: 'transparent',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 12,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
        shape: {
          borderRadius: 8,
        },
      },
      baseTheme
    )
  );
};
