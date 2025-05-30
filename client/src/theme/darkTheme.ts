import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
      default: '#1a1f2e',
      paper: '#242937',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    divider: 'rgba(255,255,255,0.08)',
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
          backgroundColor: '#1a1f2e',
          color: '#f3f4f6',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: 3,
          backgroundColor: '#242937',
          border: '1px solid rgba(255,255,255,0.05)',
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
          color: '#9ca3af',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)',
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
            backgroundColor: 'rgba(255,255,255,0.04)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
            },
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.12)',
            },
            '& input': {
              color: '#f3f4f6',
              fontSize: '0.875rem',
              '&::placeholder': {
                color: '#9ca3af',
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
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '4px 8px',
          fontSize: '0.75rem',
          color: '#f3f4f6',
        },
        head: {
          color: '#9ca3af',
          fontWeight: 600,
          backgroundColor: '#2a303f',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.04) !important',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(255,255,255,0.02)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.08)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2a303f',
          marginTop: 4,
          minWidth: 180,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '& .MuiMenuItem-root': {
            fontSize: '0.875rem',
            color: '#f3f4f6',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a303f',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
  },
});

export default darkTheme;
