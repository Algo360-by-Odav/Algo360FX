import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Divider,
  Alert,
  Paper,
  Container,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/AuthStore';
import { useTheme } from '@/contexts/ThemeContext';
import '../styles/auth.css';

const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await authStore.login(formData.email, formData.password);
      if (success && authStore.currentUser) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await authStore.socialLogin(provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth={false} disableGutters className={`auth-container ${isDarkMode ? 'dark' : 'light'}`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: isDarkMode ? '#fff' : '#000',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          },
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
      
      <Paper
        elevation={24}
        className="auth-card"
        sx={{
          backgroundColor: isDarkMode ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        <Box className="auth-header">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: isDarkMode ? '#fff' : '#1a1f2c' }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: isDarkMode ? '#a0aec0' : '#4a5568' }}
          >
            Log in to access your trading dashboard
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: isDarkMode ? '#a0aec0' : '#4a5568' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: '#3182ce',
              '&:hover': {
                backgroundColor: '#2c5282',
              },
            }}
          >
            Sign In
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Link
              to="/forgot-password"
              style={{
                color: isDarkMode ? '#63b3ed' : '#2b6cb0',
                textDecoration: 'none',
              }}
            >
              Forgot Password?
            </Link>
            <Link
              to="/signup"
              style={{
                color: isDarkMode ? '#63b3ed' : '#2b6cb0',
                textDecoration: 'none',
              }}
            >
              Create Account
            </Link>
          </Box>

          <Divider sx={{ my: 2, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : '#4a5568', px: 1 }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin('google')}
              startIcon={<Google />}
              sx={{
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin('github')}
              startIcon={<GitHub />}
              sx={{
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
              }}
            >
              GitHub
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
});

export default Login;
