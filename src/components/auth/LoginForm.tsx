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
  Paper,
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
  TrendingUp,
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        backgroundColor: isDarkMode ? '#0a0a0a' : '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)'
            : 'radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          pointerEvents: 'none',
        }}
      />

      {/* Theme Toggle */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          color: isDarkMode ? '#fff' : '#000',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          zIndex: 2,
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>

      {/* Left Section - Login Form */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 6,
          }}
        >
          <TrendingUp 
            sx={{ 
              fontSize: 40,
              color: isDarkMode ? '#60a5fa' : '#2563eb',
            }} 
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: isDarkMode 
                ? 'linear-gradient(45deg, #60a5fa, #3b82f6)' 
                : 'linear-gradient(45deg, #2563eb, #1d4ed8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Algo360FX
          </Typography>
        </Box>

        <Paper
          elevation={isDarkMode ? 0 : 2}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#1a1a1a',
                }}
              >
                Welcome back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                }}
              >
                Enter your credentials to access your account
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
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
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? '#94a3b8' : '#64748b',
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
                          sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}>
                  <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                    sx={{
                      color: isDarkMode ? '#60a5fa' : '#2563eb',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                  <Link
                    component={RouterLink}
                    to="/auth/register"
                    sx={{
                      color: isDarkMode ? '#60a5fa' : '#2563eb',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create an account
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#2563eb',
                    background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                    textTransform: 'none',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Divider sx={{ 
                  my: 1,
                  '&::before, &::after': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      px: 1,
                    }}
                  >
                    or continue with
                  </Typography>
                </Divider>

                <Stack 
                  direction="row" 
                  spacing={2}
                  sx={{
                    '& .MuiButton-root': {
                      flex: 1,
                      py: 1.5,
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleSocialLogin('google')}
                    startIcon={<Google />}
                    disabled={loading}
                  >
                    Google
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleSocialLogin('github')}
                    startIcon={<GitHub />}
                    disabled={loading}
                  >
                    GitHub
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>

      {/* Right Section - Feature Highlights (Hidden on Mobile) */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(29, 78, 216, 0.1))'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(29, 78, 216, 0.05))',
            borderLeft: isDarkMode
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.1)',
            position: 'relative',
          }}
        >
          <Stack spacing={4} maxWidth="400px">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#fff' : '#1a1a1a',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Advanced Trading Platform
            </Typography>
            {[
              {
                title: 'Real-time Analytics',
                description: 'Get instant insights with our advanced analytics tools',
              },
              {
                title: 'AI-Powered Trading',
                description: 'Let our AI assist you in making informed trading decisions',
              },
              {
                title: 'Secure Platform',
                description: 'Your security is our top priority with enterprise-grade protection',
              },
            ].map((feature, index) => (
              <Box key={index} textAlign="center">
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: isDarkMode ? '#60a5fa' : '#2563eb',
                    fontWeight: 600,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
});

export default LoginForm;
