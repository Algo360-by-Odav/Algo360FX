import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  InputBase,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  MoreVert,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';
import { styled } from '@mui/material/styles';

// Define the props interface
export interface TopBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
  pageTitle?: string;
  pageIcon?: React.ReactNode;
  actions?: React.ReactNode[];
}

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const TopBarEnhanced: React.FC<TopBarProps> = observer(({ 
  open, 
  handleDrawerToggle, 
  pageTitle = 'Dashboard', 
  pageIcon = <DashboardIcon />, 
  actions = [] 
}) => {
  // Use type assertion for themeStore
  const { themeStore } = useStores() as unknown as {
    themeStore: {
      isDarkMode: boolean;
      isMenuOpen: boolean;
      toggleMenu: () => void;
      toggleTheme: () => void;
      theme: any;
    };
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = React.useState('');
  const [languageMenu, setLanguageMenu] = React.useState<null | HTMLElement>(null);
  const [notificationsMenu, setNotificationsMenu] = React.useState<null | HTMLElement>(null);
  const [profileMenu, setProfileMenu] = React.useState<null | HTMLElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = (language?: typeof languages[0]) => {
    if (language) {
      setSelectedLanguage(language);
    }
    setLanguageMenu(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Handle search submit
      console.log('Search for:', searchText);
    }
  };

  const notifications = [
    { id: 1, text: 'New signal available for EUR/USD', time: '2 min ago' },
    { id: 2, text: 'Your portfolio has been updated', time: '1 hour ago' },
    { id: 3, text: 'New educational content available', time: '5 hours ago' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${open ? 240 : 0}px)` },
        ml: { sm: `${open ? 240 : 0}px` },
        transition: (theme) =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Consistent color scheme for all pages
        backgroundColor: '#1E88E5', // Blue color for all pages
        color: '#ffffff',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Icon and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {pageIcon}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#ffffff', // Always white to match blue background
              letterSpacing: '0.5px',
            }}
          >
            {pageTitle}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Action Buttons - only show on desktop */}
        {actions.length > 0 && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 2 }}>
            {actions}
          </Box>
        )}
        
        {/* Simple action button for mobile */}
        {actions.length > 0 && (
          <Box sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}>
            <IconButton color="inherit" aria-label="actions">
              <MoreVert />
            </IconButton>
          </Box>
        )}

        {/* Search Bar */}
        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchText}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </Search>
        )}

        {/* Language Selector */}
        <Tooltip title="Change Language">
          <IconButton
            size="large"
            aria-label="language"
            color="inherit"
            onClick={handleLanguageClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 0.5 }}>
                {selectedLanguage.flag}
              </Typography>
              {!isMobile && (
                <Typography variant="body2">
                  {selectedLanguage.code.toUpperCase()}
                </Typography>
              )}
            </Box>
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="large"
            aria-label="notifications"
            color="inherit"
            onClick={handleNotificationsClick}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip
          title={themeStore.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <IconButton
            size="large"
            aria-label="toggle theme"
            color="inherit"
            onClick={() => themeStore.toggleTheme()}
            sx={{ ml: 1 }}
          >
            {themeStore.isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
        <Tooltip title="Account settings">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Language Menu */}
      <Menu
        anchorEl={languageMenu}
        open={Boolean(languageMenu)}
        onClose={() => handleLanguageClose()}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageClose(language)}
            selected={language.code === selectedLanguage.code}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {language.flag}
            </Typography>
            <Typography variant="body1">{language.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenu}
        open={Boolean(notificationsMenu)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: '100%',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {notifications.length > 0 ? (
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemText
                      primary={notification.text}
                      secondary={notification.time}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Box>
        {notifications.length > 0 && (
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button size="small" color="primary">
              View All Notifications
            </Button>
          </Box>
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenu}
        open={Boolean(profileMenu)}
        onClose={handleProfileClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@example.com
          </Typography>
        </Box>
        <Divider />
        <List>
          <MenuItem>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </MenuItem>
        </List>
        <Divider />
        <MenuItem>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
});

export default TopBarEnhanced;
