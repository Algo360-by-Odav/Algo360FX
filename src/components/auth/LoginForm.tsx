import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
  Stack,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useRootStore } from '../../hooks/useRootStore';
import {
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import '../../styles/auth.css';

const LoginForm = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useRootStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authStore.login(formData.email, formData.password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      await authStore.socialLogin(provider);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during social login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      className={`auth-container ${isDarkMode ? 'dark' : 'light'}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          color: isDarkMode ? '#fff' : '#000',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box
          sx={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: 2,
            p: { xs: 3, sm: 4 },
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                gutterBottom
                sx={{
                  color: isDarkMode ? '#fff' : '#1a1a1a',
                  fontWeight: 600,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#a0aec0' : '#4a5568',
                  mb: 3,
                }}
              >
                Log in to access your trading dashboard
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1,
                  '& .MuiAlert-message': {
                    width: '100%',
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? '#a0aec0' : '#4a5568',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size={isMobile ? "small" : "medium"}
                          sx={{ color: isDarkMode ? '#a0aec0' : '#4a5568' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? '#a0aec0' : '#4a5568',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                    sx={{
                      color: isDarkMode ? '#63b3ed' : '#2b6cb0',
                      textDecoration: 'none',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    component={RouterLink}
                    to="/auth/register"
                    sx={{
                      color: isDarkMode ? '#63b3ed' : '#2b6cb0',
                      textDecoration: 'none',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create Account
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    mt: 1,
                    py: isMobile ? 1 : 1.5,
                    backgroundColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                    textTransform: 'none',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Divider sx={{ 
                  my: 2, 
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '&::before, &::after': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#a0aec0' : '#4a5568',
                      px: 1,
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }}
                  >
                    OR
                  </Typography>
                </Divider>

                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  spacing={2}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('google')}
                    startIcon={<Google />}
                    disabled={loading}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      },
                      textTransform: 'none',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('github')}
                    startIcon={<GitHub />}
                    disabled={loading}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      },
                      textTransform: 'none',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    GitHub
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Container>
    </Container>
  );
});

export default LoginForm;
