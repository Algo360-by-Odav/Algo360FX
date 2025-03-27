import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import ThemeToggle from '../theme/ThemeToggle';

const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
          }}
        >
          Algo360FX
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
