import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      dark: '#2563eb',
    },
    secondary: {
      main: '#8b5cf6',
    },
    success: {
      main: '#10b981',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: 0.2,
    },
    body1: {
      fontSize: '0.875rem',
      letterSpacing: 0.1,
    },
    body2: {
      fontSize: '0.75rem',
      letterSpacing: 0.1,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: 3,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 3,
        },
        containedSuccess: {
          backgroundColor: '#10b981',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
        containedError: {
          backgroundColor: '#ef4444',
          '&:hover': {
            backgroundColor: '#dc2626',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#64748b',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.12)',
            },
            '& input': {
              color: '#1e293b',
              fontSize: '0.875rem',
              '&::placeholder': {
                color: '#64748b',
                opacity: 1,
              },
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          padding: '4px 8px',
          fontSize: '0.75rem',
          color: '#1e293b',
        },
        head: {
          color: '#64748b',
          fontWeight: 600,
          backgroundColor: '#f1f5f9',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02) !important',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(0,0,0,0.01)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.08)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          marginTop: 4,
          minWidth: 180,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '& .MuiMenuItem-root': {
            fontSize: '0.875rem',
            color: '#1e293b',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default lightTheme;
