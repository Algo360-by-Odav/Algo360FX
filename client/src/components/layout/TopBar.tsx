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
  ListItemAvatar,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  AccountCircle,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { styled } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
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
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const TopBar = observer(({ onMenuClick }: { onMenuClick: () => void }) => {
  const { authStore, themeStore } = useStores();
  const [languageMenu, setLanguageMenu] = React.useState<null | HTMLElement>(null);
  const [notificationsMenu, setNotificationsMenu] = React.useState<null | HTMLElement>(null);
  const [messagesMenu, setMessagesMenu] = React.useState<null | HTMLElement>(null);
  const [profileMenu, setProfileMenu] = React.useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = (language?: typeof languages[0]) => {
    if (language) {
      setSelectedLanguage(language);
      // Here you would typically update the language in your store/context
    }
    setLanguageMenu(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  const handleMessagesClick = (event: React.MouseEvent<HTMLElement>) => {
    setMessagesMenu(event.currentTarget);
  };

  const handleMessagesClose = () => {
    setMessagesMenu(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleLogout = () => {
    authStore.logout();
    handleProfileClose();
  };

  const notifications = [
    {
      id: 1,
      title: 'New Trade Alert',
      message: 'Your EUR/USD position has reached target profit',
      time: '5 min ago',
      avatar: '📈',
    },
    {
      id: 2,
      title: 'Account Update',
      message: 'Your account verification is complete',
      time: '1 hour ago',
      avatar: '✅',
    },
  ];

  const messages = [
    {
      id: 1,
      from: 'Trading Support',
      message: 'Your ticket #1234 has been resolved',
      time: '10 min ago',
      avatar: '/images/support.png',
    },
    {
      id: 2,
      from: 'System Admin',
      message: 'Important: Platform maintenance scheduled',
      time: '2 hours ago',
      avatar: '/images/admin.png',
    },
  ];

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
          ALGO360 FX
        </Typography>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search markets, news, guides..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={themeStore.isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            color="inherit"
            onClick={themeStore.toggleTheme}
            sx={{ ml: 1 }}
          >
            {themeStore.isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Language Selector */}
        <Tooltip title="Select Language">
          <IconButton
            color="inherit"
            onClick={handleLanguageClick}
            sx={{ ml: 1 }}
          >
            <Typography variant="body2" component="span" sx={{ mr: 0.5 }}>
              {selectedLanguage.flag}
            </Typography>
            <LanguageIcon />
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            onClick={handleNotificationsClick}
            sx={{ ml: 1 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Messages */}
        <Tooltip title="Messages">
          <IconButton
            color="inherit"
            onClick={handleMessagesClick}
            sx={{ ml: 1 }}
          >
            <Badge badgeContent={messages.length} color="error">
              <EmailIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Account">
          <IconButton
            color="inherit"
            onClick={handleProfileClick}
            sx={{ ml: 1 }}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>

        {/* Language Menu */}
        <Menu
          anchorEl={languageMenu}
          open={Boolean(languageMenu)}
          onClose={() => handleLanguageClose()}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageClose(language)}
              selected={language.code === selectedLanguage.code}
            >
              <Typography component="span" sx={{ mr: 1 }}>{language.flag}</Typography>
              {language.name}
            </MenuItem>
          ))}
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsMenu}
          open={Boolean(notificationsMenu)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: { width: 360, maxHeight: 400 },
          }}
        >
          <Typography component="div" sx={{ p: 2 }} variant="h6">
            Notifications
          </Typography>
          <Divider />
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem key={notification.id} sx={{ px: 2, py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    {notification.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <Box component="div">
                      <Typography variant="body2" color="text.secondary" component="div">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Menu>

        {/* Messages Menu */}
        <Menu
          anchorEl={messagesMenu}
          open={Boolean(messagesMenu)}
          onClose={handleMessagesClose}
          PaperProps={{
            sx: { width: 360, maxHeight: 400 },
          }}
        >
          <Typography component="div" sx={{ p: 2 }} variant="h6">
            Messages
          </Typography>
          <Divider />
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ px: 2, py: 1 }}>
                <ListItemAvatar>
                  <Avatar src={message.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={message.from}
                  secondary={
                    <Box component="div">
                      <Typography variant="body2" color="text.secondary" component="div">
                        {message.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        {message.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenu}
          open={Boolean(profileMenu)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: { width: 220 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" component="div" noWrap>
              {authStore.user?.username}
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary" noWrap>
              {authStore.user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

export default TopBar;
