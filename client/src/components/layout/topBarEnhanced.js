// topBarEnhanced.js - JavaScript version without JSX
// Enhanced version with improved styling and functionality

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

// Styled Search component
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
    },
  },
}));

// Enhanced TopBar component
const TopBarEnhanced = observer(({ open, handleDrawerToggle, pageTitle, pageIcon, actions }) => {
  const { themeStore, authStore } = useStores();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for menus
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const [notificationsMenu, setNotificationsMenu] = React.useState(null);
  const [messagesMenu, setMessagesMenu] = React.useState(null);
  const [profileMenu, setProfileMenu] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  
  // Selected language
  const [selectedLanguage, setSelectedLanguage] = React.useState({ code: 'en', name: 'English', flag: '🇺🇸' });
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];
  
  // Menu handlers
  const handleLanguageClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };
  
  const handleLanguageClose = (language) => {
    if (language) {
      setSelectedLanguage(language);
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
    handleProfileClose();
    authStore.logout();
  };
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New Trade Alert',
      description: 'EUR/USD has reached your target price of 1.0950',
      time: '5 min ago',
      avatar: '📈',
      read: false,
    },
    {
      id: 2,
      title: 'Account Update',
      description: 'Your deposit of $1,000 has been processed',
      time: '1 hour ago',
      avatar: '💰',
      read: false,
    },
    {
      id: 3,
      title: 'Market News',
      description: 'Fed announces interest rate decision',
      time: '3 hours ago',
      avatar: '📰',
      read: true,
    },
  ];
  
  // Sample messages
  const messages = [
    {
      id: 1,
      sender: 'Trading Bot',
      content: 'New trading signal generated for AAPL',
      time: '10 min ago',
      avatar: '🤖',
      read: false,
    },
    {
      id: 2,
      sender: 'Support Team',
      content: 'Your ticket #45678 has been resolved',
      time: '2 hours ago',
      avatar: '👨‍💼',
      read: false,
    },
    {
      id: 3,
      sender: 'System',
      content: 'Scheduled maintenance tonight at 2 AM UTC',
      time: '5 hours ago',
      avatar: '⚙️',
      read: true,
    },
  ];
  
  // Search handlers
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      console.log('Searching for:', searchText);
      // Implement search functionality
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
        width: { sm: `calc(100% - ${open ? 240 : 0}px)` },
        ml: { sm: `${open ? 240 : 0}px` },
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme => theme.zIndex.drawer + 1,
        // Dark navy blue theme as shown in the image
        backgroundColor: '#1A2B45', // Dark navy blue color
        color: '#ffffff',
        boxShadow: '0 1px 5px rgba(0,0,0,0.15)'
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
            edge: 'start',
            onClick: handleDrawerToggle,
            sx: { mr: 2, display: { sm: 'none' } }
          },
          React.createElement(MenuIcon)
        ),
        
        // Page Title with icon
        React.createElement(
          Box,
          { 
            key: 'page-title-container',
            sx: { 
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1 
            } 
          },
          [
            // Page Icon
            React.createElement(
              React.Fragment,
              { key: 'page-icon' },
              pageIcon ? pageIcon : defaultPageIcon
            ),
            
            // Page Title
            React.createElement(
              Typography,
              {
                variant: 'h6',
                noWrap: true,
                component: 'div',
                sx: { 
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#ffffff', // Always white to match blue background
                  letterSpacing: '0.5px'
                }
              },
              pageTitle || 'Algo360FX'
            )
          ]
        ),
        
        // Search Bar
        !isMobile && React.createElement(
          Search,
          null,
          [
            React.createElement(
              SearchIconWrapper,
              null,
              React.createElement(SearchIcon)
            ),
            React.createElement(
              StyledInputBase,
              {
                placeholder: 'Search…',
                inputProps: { 'aria-label': 'search' },
                value: searchText,
                onChange: handleSearchChange,
                onKeyPress: handleSearchSubmit
              }
            )
          ]
        ),
        
        // Spacer
        React.createElement(
          Box,
          { sx: { flexGrow: 1 } }
        ),
        
        // Action Buttons (from props)
        actions && actions.length > 0 && React.createElement(
          Box,
          { 
            sx: { 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mr: 2 
            } 
          },
          actions
        ),
        
        // Right side buttons
        React.createElement(
          Box,
          { sx: { display: 'flex', alignItems: 'center' } },
          [
            // Market Status Chip
            !isMobile && React.createElement(
              Chip,
              {
                key: 'market-status',
                label: 'Markets Open',
                color: 'success',
                size: 'small',
                sx: { mr: 2 }
              }
            ),
            
            // Language Button
            React.createElement(
              Tooltip,
              {
                key: 'language-tooltip',
                title: 'Change Language'
              },
              React.createElement(
                IconButton,
                {
                  size: 'large',
                  'aria-label': 'language',
                  color: 'inherit',
                  onClick: handleLanguageClick
                },
                React.createElement(
                  Box,
                  { sx: { display: 'flex', alignItems: 'center' } },
                  [
                    React.createElement(
                      Typography,
                      { variant: 'body2', sx: { mr: 0.5 } },
                      selectedLanguage.flag
                    ),
                    !isMobile && React.createElement(
                      Typography,
                      { variant: 'body2' },
                      selectedLanguage.code.toUpperCase()
                    )
                  ]
                )
              )
            ),
            
            // Notifications Button
            React.createElement(
              Tooltip,
              {
                key: 'notifications-tooltip',
                title: 'Notifications'
              },
              React.createElement(
                IconButton,
                {
                  size: 'large',
                  'aria-label': 'notifications',
                  color: 'inherit',
                  onClick: handleNotificationsClick
                },
                React.createElement(
                  Badge,
                  {
                    badgeContent: notifications.filter(n => !n.read).length,
                    color: 'error'
                  },
                  React.createElement(NotificationsIcon)
                )
              )
            ),
            
            // Messages Button
            React.createElement(
              Tooltip,
              {
                key: 'messages-tooltip',
                title: 'Messages'
              },
              React.createElement(
                IconButton,
                {
                  size: 'large',
                  'aria-label': 'messages',
                  color: 'inherit',
                  onClick: handleMessagesClick
                },
                React.createElement(
                  Badge,
                  {
                    badgeContent: messages.filter(m => !m.read).length,
                    color: 'error'
                  },
                  React.createElement(EmailIcon)
                )
              )
            ),
            
            // Theme Toggle Button
            React.createElement(
              Tooltip,
              {
                key: 'theme-toggle',
                title: themeStore.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              },
              React.createElement(
                IconButton,
                {
                  size: 'large',
                  'aria-label': 'theme',
                  color: 'inherit',
                  onClick: () => themeStore.toggleTheme()
                },
                themeStore.isDarkMode 
                  ? React.createElement(LightModeIcon)
                  : React.createElement(DarkModeIcon)
              )
            ),
            
            // Profile Button
            React.createElement(
              Tooltip,
              {
                key: 'profile-tooltip',
                title: 'Account'
              },
              React.createElement(
                IconButton,
                {
                  size: 'large',
                  edge: 'end',
                  'aria-label': 'account',
                  'aria-haspopup': 'true',
                  color: 'inherit',
                  onClick: handleProfileClick
                },
                React.createElement(AccountCircle)
              )
            )
          ]
        ),
        
        // Language Menu
        React.createElement(
          Menu,
          {
            key: 'language-menu',
            anchorEl: languageMenu,
            open: Boolean(languageMenu),
            onClose: () => handleLanguageClose(),
            PaperProps: {
              sx: {
                mt: 1.5,
                width: 200,
              }
            }
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
                  { variant: 'body2', sx: { mr: 1 } },
                  language.flag
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2' },
                  language.name
                )
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
              sx: {
                mt: 1.5,
                width: 360,
                maxHeight: 400,
                overflow: 'auto'
              }
            }
          },
          [
            React.createElement(
              Box,
              { 
                sx: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                } 
              },
              [
                React.createElement(
                  Typography,
                  { variant: 'h6' },
                  'Notifications'
                ),
                React.createElement(
                  Button,
                  { 
                    size: 'small',
                    startIcon: React.createElement(RefreshIcon)
                  },
                  'Refresh'
                )
              ]
            ),
            notifications.length > 0
              ? notifications.map((notification) =>
                  React.createElement(
                    React.Fragment,
                    { key: notification.id },
                    [
                      React.createElement(
                        ListItem,
                        { 
                          alignItems: 'flex-start',
                          sx: { 
                            backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.light, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.light, 0.2)
                            }
                          }
                        },
                        [
                          React.createElement(
                            ListItemAvatar,
                            null,
                            React.createElement(
                              Avatar,
                              { 
                                sx: { 
                                  bgcolor: notification.read ? 'grey.300' : 'primary.light',
                                  fontSize: '1.25rem'
                                } 
                              },
                              notification.avatar
                            )
                          ),
                          React.createElement(
                            ListItemText,
                            {
                              primary: notification.title,
                              secondary: React.createElement(
                                React.Fragment,
                                null,
                                [
                                  React.createElement(
                                    Typography,
                                    {
                                      component: 'span',
                                      variant: 'body2',
                                      color: 'text.primary'
                                    },
                                    notification.description
                                  ),
                                  React.createElement(
                                    Typography,
                                    {
                                      component: 'span',
                                      variant: 'caption',
                                      sx: { display: 'block', mt: 0.5 }
                                    },
                                    notification.time
                                  )
                                ]
                              )
                            }
                          )
                        ]
                      ),
                      notification.id !== notifications.length && React.createElement(Divider, { variant: 'inset', component: 'li' })
                    ]
                  )
                )
              : React.createElement(
                  Box,
                  { sx: { p: 2, textAlign: 'center' } },
                  React.createElement(
                    Typography,
                    { color: 'text.secondary' },
                    'No notifications'
                  )
                ),
            React.createElement(
              Box,
              { sx: { p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' } },
              React.createElement(
                Button,
                { size: 'small', fullWidth: true },
                'View All Notifications'
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
              sx: {
                mt: 1.5,
                width: 360,
                maxHeight: 400,
                overflow: 'auto'
              }
            }
          },
          [
            React.createElement(
              Box,
              { 
                sx: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                } 
              },
              [
                React.createElement(
                  Typography,
                  { variant: 'h6' },
                  'Messages'
                ),
                React.createElement(
                  Button,
                  { 
                    size: 'small',
                    startIcon: React.createElement(RefreshIcon)
                  },
                  'Refresh'
                )
              ]
            ),
            messages.length > 0
              ? messages.map((message) =>
                  React.createElement(
                    React.Fragment,
                    { key: message.id },
                    [
                      React.createElement(
                        ListItem,
                        { 
                          alignItems: 'flex-start',
                          sx: { 
                            backgroundColor: message.read ? 'transparent' : alpha(theme.palette.primary.light, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.light, 0.2)
                            }
                          }
                        },
                        [
                          React.createElement(
                            ListItemAvatar,
                            null,
                            React.createElement(
                              Avatar,
                              { 
                                sx: { 
                                  bgcolor: message.read ? 'grey.300' : 'primary.light',
                                  fontSize: '1.25rem'
                                } 
                              },
                              message.avatar
                            )
                          ),
                          React.createElement(
                            ListItemText,
                            {
                              primary: message.sender,
                              secondary: React.createElement(
                                React.Fragment,
                                null,
                                [
                                  React.createElement(
                                    Typography,
                                    {
                                      component: 'span',
                                      variant: 'body2',
                                      color: 'text.primary'
                                    },
                                    message.content
                                  ),
                                  React.createElement(
                                    Typography,
                                    {
                                      component: 'span',
                                      variant: 'caption',
                                      sx: { display: 'block', mt: 0.5 }
                                    },
                                    message.time
                                  )
                                ]
                              )
                            }
                          )
                        ]
                      ),
                      message.id !== messages.length && React.createElement(Divider, { variant: 'inset', component: 'li' })
                    ]
                  )
                )
              : React.createElement(
                  Box,
                  { sx: { p: 2, textAlign: 'center' } },
                  React.createElement(
                    Typography,
                    { color: 'text.secondary' },
                    'No messages'
                  )
                ),
            React.createElement(
              Box,
              { sx: { p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' } },
              React.createElement(
                Button,
                { size: 'small', fullWidth: true },
                'View All Messages'
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
              sx: {
                mt: 1.5,
                width: 200,
              }
            }
          },
          [
            React.createElement(
              Box,
              { 
                sx: { 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                } 
              },
              [
                React.createElement(
                  Avatar,
                  { 
                    sx: { 
                      width: 60, 
                      height: 60, 
                      mb: 1,
                      bgcolor: 'primary.main'
                    } 
                  },
                  'A'
                ),
                React.createElement(
                  Typography,
                  { variant: 'subtitle1', fontWeight: 'bold' },
                  'Admin User'
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'text.secondary' },
                  'admin@algo360fx.com'
                )
              ]
            ),
            React.createElement(
              MenuItem,
              { onClick: handleProfileClose },
              'Profile'
            ),
            React.createElement(
              MenuItem,
              { onClick: handleProfileClose },
              'Settings'
            ),
            React.createElement(Divider),
            React.createElement(
              MenuItem,
              { onClick: handleLogout },
              'Logout'
            )
          ]
        )
      ]
    )
  );
});

export default TopBarEnhanced;
