import { createTheme } from '@mui/material/styles';

// Light theme with trust-inspiring colors
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Trustworthy blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#3f51b5', // Complementary indigo
      light: '#7986cb',
      dark: '#303f9f',
    },
    background: {
      default: '#f5f7fa', // Light blue-grey
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // Dark blue-grey for text
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h2: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h3: {
      fontWeight: 600,
      color: '#1976d2',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
          boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: '#ffffff',
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&.MuiButton-contained': {
            background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
            boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#90caf9 #bbdefb",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#bbdefb",
            width: '8px',
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#90caf9",
            minHeight: 24,
            border: "2px solid #bbdefb",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#64b5f6",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#64b5f6",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#64b5f6",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Dark theme with trust-inspiring colors
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue for dark mode
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#7986cb', // Light indigo for dark mode
      light: '#c5cae9',
      dark: '#3f51b5',
    },
    background: {
      default: '#0a1929', // Dark blue-grey
      paper: '#102a43',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      color: '#90caf9',
    },
    h2: {
      fontWeight: 600,
      color: '#90caf9',
    },
    h3: {
      fontWeight: 600,
      color: '#90caf9',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #102a43 30%, #0a1929 90%)',
          boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #102a43 0%, #0a1929 100%)',
          color: '#ffffff',
          '& .MuiListItemIcon-root': {
            color: '#90caf9',
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(144, 202, 249, 0.1)',
          backgroundColor: '#102a43',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&.MuiButton-contained': {
            background: 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)',
            boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .2)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#42a5f5 #0a1929",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#0a1929",
            width: '8px',
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#42a5f5",
            minHeight: 24,
            border: "2px solid #0a1929",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#90caf9",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#90caf9",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#90caf9",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});
