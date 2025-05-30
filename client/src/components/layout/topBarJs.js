// topBarJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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
  Button,
  Chip,
  useMediaQuery,
  useTheme,
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
  Help as HelpIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  SignalCellularAlt as SignalIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';
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

const TopBar = observer(({ 
  onMenuClick, 
  pageTitle, 
  pageIcon, 
  actions, 
  showSearch = false, 
  showLanguageSelector = false, 
  showNotifications = false, 
  showMessages = false, 
  showProfileMenu = false, 
  showThemeToggle = false 
}) => {
  const { authStore, themeStore } = useStores();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const [notificationsMenu, setNotificationsMenu] = React.useState(null);
  const [messagesMenu, setMessagesMenu] = React.useState(null);
  const [profileMenu, setProfileMenu] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Market status indicator - this would typically come from a real API
  const marketStatus = {
    status: 'open',  // 'open', 'closed', 'pre-market', 'after-hours'
    nextEvent: 'Market closes in 3h 24m',
  };

  const handleLanguageClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = (language) => {
    if (language) {
      setSelectedLanguage(language);
      // Here you would typically update the language in your store/context
    }
    setLanguageMenu(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  const handleMessagesClick = (event) => {
    setMessagesMenu(event.currentTarget);
  };

  const handleMessagesClose = () => {
    setMessagesMenu(null);
  };

  const handleProfileClick = (event) => {
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
      message: 'How can we help with your trading needs?',
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      console.log('Search for:', searchQuery);
      // Here you would typically trigger a search action
    }
  };
  
  // Default page icon if none provided
  const defaultPageIcon = React.createElement(DashboardIcon);
  
  // Create the AppBar component
  return React.createElement(
    AppBar,
    {
      position: 'fixed',
      sx: {
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: themeStore.isDarkMode ? '#1A2B45' : '#ffffff',
        color: themeStore.isDarkMode ? '#ffffff' : '#333333',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    },
    React.createElement(
      Toolbar,
      null,
      [
        // Menu Button
        React.createElement(
          IconButton,
          {
            key: 'menu-button',
            color: 'inherit',
            'aria-label': 'open drawer',
            onClick: onMenuClick,
            edge: 'start',
            sx: { mr: 2 }
          },
          React.createElement(MenuIcon)
        ),

        // Logo
        React.createElement(
          Box,
          {
            key: 'logo-container',
            sx: { 
              display: 'flex', 
              alignItems: 'center',
              mr: 2
            }
          },
          [
            React.createElement(
              Typography,
              {
                key: 'logo',
                variant: 'h6',
                noWrap: true,
                component: 'div',
                sx: { 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }
              },
              'Algo360FX'
            )
          ]
        ),
        
        // Page Title with Icon
        React.createElement(
          Box,
          {
            key: 'page-title-container',
            sx: { 
              display: 'flex', 
              alignItems: 'center',
              borderLeft: '1px solid',
              borderColor: 'divider',
              pl: 2,
              mr: 2
            }
          },
          [
            React.createElement(
              Box,
              {
                key: 'page-icon',
                sx: { mr: 1, color: 'primary.main' }
              },
              pageIcon || defaultPageIcon
            ),
            React.createElement(
              Typography,
              {
                key: 'page-title',
                variant: 'h6',
                noWrap: true,
                component: 'div',
                sx: { 
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }
              },
              pageTitle || 'Dashboard'
            )
          ]
        ),
        
        // Market Status Indicator
        !isMobile && React.createElement(
          Chip,
          {
            key: 'market-status',
            label: marketStatus.status === 'open' ? 'Markets Open' : 'Markets Closed',
            color: marketStatus.status === 'open' ? 'success' : 'error',
            size: 'small',
            icon: React.createElement(SignalIcon),
            sx: { mr: 2 }
          }
        ),
        
        // Custom Action Buttons (if provided)
        actions && React.createElement(
          Box,
          {
            key: 'custom-actions',
            sx: { 
              display: { xs: 'none', md: 'flex' },
              mr: 2,
              gap: 1
            }
          },
          actions
        ),

        // Search Box (only on desktop)
        !isMobile && React.createElement(
          Search,
          { key: 'search-box' },
          [
            React.createElement(
              SearchIconWrapper,
              { key: 'search-icon-wrapper' },
              React.createElement(SearchIcon)
            ),
            React.createElement(
              StyledInputBase,
              {
                key: 'search-input',
                placeholder: 'Search…',
                inputProps: { 'aria-label': 'search' },
                value: searchQuery,
                onChange: handleSearchChange,
                onKeyDown: handleSearchSubmit
              }
            )
          ]
        ),
        
        // Help Button
        !isMobile && React.createElement(
          Tooltip,
          {
            key: 'help-tooltip',
            title: 'Help & Resources'
          },
          React.createElement(
            IconButton,
            {
              color: 'inherit',
              size: 'large',
              sx: { ml: 1 }
            },
            React.createElement(HelpIcon)
          )
        ),
        
        // Refresh Button
        !isMobile && React.createElement(
          Tooltip,
          {
            key: 'refresh-tooltip',
            title: 'Refresh Data'
          },
          React.createElement(
            IconButton,
            {
              color: 'inherit',
              size: 'large',
              sx: { ml: 1 }
            },
            React.createElement(RefreshIcon)
          )
        ),

        // Spacer
        React.createElement(
          Box,
          { key: 'spacer', sx: { flexGrow: 1 } }
        ),

        // Theme Toggle
        React.createElement(
          Tooltip,
          {
            key: 'theme-toggle',
            title: themeStore.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          },
          React.createElement(
            IconButton,
            {
              color: 'inherit',
              onClick: themeStore.toggleTheme,
              sx: { ml: 1 }
            },
            themeStore.isDarkMode
              ? React.createElement(LightModeIcon)
              : React.createElement(DarkModeIcon)
          )
        ),

        // Language Selector
        !isMobile && React.createElement(
          Box,
          { key: 'language-selector', sx: { display: 'flex' } },
          React.createElement(
            Tooltip,
            { title: 'Change language' },
            React.createElement(
              IconButton,
              {
                key: 'language-button',
                color: 'inherit',
                'aria-label': 'language',
                'aria-controls': 'language-menu',
                'aria-haspopup': 'true',
                onClick: handleLanguageClick,
                size: 'large',
                sx: { ml: 1 }
              },
              React.createElement(
                Box,
                { sx: { display: 'flex', alignItems: 'center' } },
                [
                  React.createElement(
                    Typography,
                    { key: 'language-flag', variant: 'body2', sx: { mr: 0.5 } },
                    selectedLanguage.flag
                  ),
                  React.createElement(LanguageIcon, { key: 'language-icon' })
                ]
              )
            )
          )
        ),

        // Notifications
        React.createElement(
          Tooltip,
          {
            key: 'notifications',
            title: 'Notifications'
          },
          React.createElement(
            IconButton,
            {
              color: 'inherit',
              onClick: handleNotificationsClick,
              sx: { ml: 1 }
            },
            React.createElement(
              Badge,
              {
                badgeContent: notifications.length,
                color: 'error'
              },
              React.createElement(NotificationsIcon)
            )
          )
        ),

        // Messages
        !isMobile && React.createElement(
          Box,
          { key: 'messages', sx: { display: 'flex' } },
          React.createElement(
            Tooltip,
            { title: 'Messages' },
            React.createElement(
              IconButton,
              {
                key: 'messages-button',
                color: 'inherit',
                'aria-label': 'messages',
                'aria-controls': 'messages-menu',
                'aria-haspopup': 'true',
                onClick: handleMessagesClick,
                size: 'large',
                sx: { ml: 1 }
              },
              React.createElement(
                Badge,
                { badgeContent: messages.length, color: 'error' },
                React.createElement(EmailIcon)
              )
            )
          )
        ),

        // Profile
        React.createElement(
          Tooltip,
          {
            key: 'profile',
            title: 'Account'
          },
          React.createElement(
            IconButton,
            {
              color: 'inherit',
              onClick: handleProfileClick,
              sx: { ml: 1 }
            },
            React.createElement(AccountCircle)
          )
        ),

        // Language Menu
        React.createElement(
          Menu,
          {
            key: 'language-menu',
            anchorEl: languageMenu,
            open: Boolean(languageMenu),
            onClose: () => handleLanguageClose()
          },
          languages.map((language) =>
            React.createElement(
              MenuItem,
              {
                key: language.code,
                onClick: () => handleLanguageClose(language),
                selected: language.code === selectedLanguage.code
              },
              [
                React.createElement(
                  Typography,
                  {
                    key: `${language.code}-flag`,
                    component: 'span',
                    sx: { mr: 1 }
                  },
                  language.flag
                ),
                language.name
              ]
            )
          )
        ),

        // Notifications Menu
        React.createElement(
          Menu,
          {
            key: 'notifications-menu',
            anchorEl: notificationsMenu,
            open: Boolean(notificationsMenu),
            onClose: handleNotificationsClose,
            PaperProps: {
              sx: { width: 360, maxHeight: 400 }
            }
          },
          [
            React.createElement(
              Typography,
              {
                key: 'notifications-title',
                component: 'div',
                sx: { p: 2 },
                variant: 'h6'
              },
              'Notifications'
            ),
            React.createElement(Divider, { key: 'notifications-divider' }),
            React.createElement(
              List,
              {
                key: 'notifications-list',
                sx: { p: 0 }
              },
              notifications.map((notification) =>
                React.createElement(
                  ListItem,
                  {
                    key: notification.id,
                    sx: { px: 2, py: 1 }
                  },
                  [
                    React.createElement(
                      ListItemAvatar,
                      { key: `notification-avatar-${notification.id}` },
                      React.createElement(
                        Avatar,
                        { sx: { bgcolor: 'primary.light' } },
                        notification.avatar
                      )
                    ),
                    React.createElement(
                      ListItemText,
                      {
                        key: `notification-text-${notification.id}`,
                        primary: notification.title,
                        secondary: React.createElement(
                          Box,
                          { component: 'div' },
                          [
                            React.createElement(
                              Typography,
                              {
                                key: `notification-message-${notification.id}`,
                                variant: 'body2',
                                color: 'text.secondary',
                                component: 'div'
                              },
                              notification.message
                            ),
                            React.createElement(
                              Typography,
                              {
                                key: `notification-time-${notification.id}`,
                                variant: 'caption',
                                color: 'text.secondary',
                                component: 'div'
                              },
                              notification.time
                            )
                          ]
                        )
                      }
                    )
                  ]
                )
              )
            )
          ]
        ),

        // Messages Menu
        React.createElement(
          Menu,
          {
            key: 'messages-menu',
            anchorEl: messagesMenu,
            open: Boolean(messagesMenu),
            onClose: handleMessagesClose,
            PaperProps: {
              sx: { width: 360, maxHeight: 400 }
            }
          },
          [
            React.createElement(
              Typography,
              {
                key: 'messages-title',
                component: 'div',
                sx: { p: 2 },
                variant: 'h6'
              },
              'Messages'
            ),
            React.createElement(Divider, { key: 'messages-divider' }),
            React.createElement(
              List,
              {
                key: 'messages-list',
                sx: { p: 0 }
              },
              messages.map((message) =>
                React.createElement(
                  ListItem,
                  {
                    key: message.id,
                    sx: { px: 2, py: 1 }
                  },
                  [
                    React.createElement(
                      ListItemAvatar,
                      { key: `message-avatar-${message.id}` },
                      React.createElement(
                        Avatar,
                        { src: message.avatar }
                      )
                    ),
                    React.createElement(
                      ListItemText,
                      {
                        key: `message-text-${message.id}`,
                        primary: message.from,
                        secondary: React.createElement(
                          Box,
                          { component: 'div' },
                          [
                            React.createElement(
                              Typography,
                              {
                                key: `message-content-${message.id}`,
                                variant: 'body2',
                                color: 'text.secondary',
                                component: 'div'
                              },
                              message.message
                            ),
                            React.createElement(
                              Typography,
                              {
                                key: `message-time-${message.id}`,
                                variant: 'caption',
                                color: 'text.secondary',
                                component: 'div'
                              },
                              message.time
                            )
                          ]
                        )
                      }
                    )
                  ]
                )
              )
            )
          ]
        ),

        // Profile Menu
        React.createElement(
          Menu,
          {
            key: 'profile-menu',
            anchorEl: profileMenu,
            open: Boolean(profileMenu),
            onClose: handleProfileClose,
            PaperProps: {
              sx: { width: 220 }
            }
          },
          [
            React.createElement(
              Box,
              {
                key: 'profile-info',
                sx: { p: 2 }
              },
              [
                React.createElement(
                  Typography,
                  {
                    key: 'profile-username',
                    variant: 'subtitle1',
                    component: 'div',
                    noWrap: true
                  },
                  authStore.user?.username
                ),
                React.createElement(
                  Typography,
                  {
                    key: 'profile-email',
                    variant: 'body2',
                    component: 'div',
                    color: 'text.secondary',
                    noWrap: true
                  },
                  authStore.user?.email
                )
              ]
            ),
            React.createElement(Divider, { key: 'profile-divider' }),
            React.createElement(
              MenuItem,
              {
                key: 'profile-menu-item',
                onClick: handleProfileClose
              },
              'Profile'
            ),
            React.createElement(
              MenuItem,
              {
                key: 'settings-menu-item',
                onClick: handleProfileClose
              },
              'Settings'
            ),
            React.createElement(
              MenuItem,
              {
                key: 'logout-menu-item',
                onClick: handleLogout
              },
              'Logout'
            )
          ]
        )
      ]
    )
  );
});

export default TopBar;
