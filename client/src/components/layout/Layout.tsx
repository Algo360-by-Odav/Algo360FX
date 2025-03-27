import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Toolbar,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import TopBar from './TopBar';
import SideMenu from './SideMenu';
import { useStores } from '../../stores/StoreProvider';
import FloatingChatButton from '../chat/FloatingChatButton';

const Layout = observer(() => {
  const { themeStore } = useStores();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeStore.isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          background: {
            default: themeStore.isDarkMode ? '#0A192F' : '#f5f5f5',
            paper: themeStore.isDarkMode ? '#1A2B45' : '#ffffff',
          },
        },
      }),
    [themeStore.isDarkMode]
  );

  const handleMenuToggle = () => {
    themeStore.toggleMenu();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <TopBar onMenuClick={handleMenuToggle} />
        <SideMenu open={themeStore.isMenuOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${themeStore.isMenuOpen ? 240 : 0}px)` },
            ml: { sm: themeStore.isMenuOpen ? '240px' : 0 },
            transition: (theme) => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
        <FloatingChatButton />
      </Box>
    </ThemeProvider>
  );
});

export default Layout;
