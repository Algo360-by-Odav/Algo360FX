import React from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import useThemeMode from '../../hooks/useThemeMode';

const ThemeSwitch: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderRadius: 1,
        p: 0.5,
      }}
    >
      <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
        <IconButton
          onClick={toggleMode}
          color="inherit"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeSwitch;
