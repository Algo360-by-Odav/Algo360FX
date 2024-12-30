import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Logo from '../../components/Common/Logo';
import PageSearch from '../../components/Common/PageSearch';

interface HeaderProps {
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const Header: React.FC<HeaderProps> = observer(({ onDrawerToggle, drawerWidth }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Logo size={32} sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ mr: 4 }}>
            Algo360FX
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' }, width: '300px' }}>
            <PageSearch />
          </Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/settings')}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Person />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
            Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
