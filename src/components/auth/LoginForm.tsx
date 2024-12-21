import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Paper,
  InputAdornment,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useRootStore } from '../../hooks/useRootStore';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginForm: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStore } = useRootStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await authStore.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(13, 15, 35, 0.4), rgba(13, 15, 35, 0.7)), url('/assets/images/trading-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: 3,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(3px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          position: 'relative',
          p: 4,
          maxWidth: 450,
          width: '100%',
          backdropFilter: 'blur(20px)',
          background: 'rgba(13, 15, 35, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: `
            0 4px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 60px rgba(255, 255, 255, 0.05)
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
          '&:hover': {
            boxShadow: `
              0 4px 30px rgba(0, 0, 0, 0.15),
              inset 0 0 60px rgba(255, 255, 255, 0.07)
            `,
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{ 
              mb: 3,
              color: 'white',
              fontWeight: 600,
              textShadow: '0 2px 15px rgba(255,255,255,0.3)',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            Login to Algo360FX
          </Typography>

          {authStore.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authStore.error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={authStore.isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
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
            error={!!errors.password}
            helperText={errors.password}
            disabled={authStore.isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'action.active' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={authStore.isLoading}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Remember me
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={authStore.isLoading}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7e22ce 0%, #4338ca 100%)',
              },
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {authStore.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          <Box sx={{ position: 'relative', my: 2 }}>
            <Divider sx={{ 
              '&.MuiDivider-root': {
                borderColor: 'rgba(255, 255, 255, 0.08)',
                '&::before, &::after': {
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                },
              }
            }}>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                px: 1,
                textShadow: '0 2px 10px rgba(255,255,255,0.1)',
              }}>
                Or continue with
              </Typography>
            </Divider>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {[
              { icon: <GoogleIcon />, name: 'Google', color: '#DB4437', hoverColor: '#C23321' },
              { icon: <AppleIcon />, name: 'Apple', color: '#000000', hoverColor: '#333333' },
              { icon: <GitHubIcon />, name: 'GitHub', color: '#333333', hoverColor: '#24292E' },
              { icon: <LinkedInIcon />, name: 'LinkedIn', color: '#0077B5', hoverColor: '#005885' },
            ].map((provider) => (
              <IconButton
                key={provider.name}
                onClick={() => handleSocialLogin(provider.name)}
                sx={{
                  color: 'white',
                  backgroundColor: `${provider.color}15`,
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${provider.hoverColor}25`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 5px 15px ${provider.color}20`,
                  },
                }}
              >
                {provider.icon}
              </IconButton>
            ))}
          </Box>

          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            '& a': {
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 10px rgba(255,255,255,0.1)',
              '&:hover': {
                color: 'white',
                textShadow: '0 2px 15px rgba(255,255,255,0.2)',
              },
            }
          }}>
            <Link
              component={RouterLink}
              to="/auth/forgot-password"
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Forgot password?
            </Link>
            <Link
              component={RouterLink}
              to="/auth/register"
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
});

export default LoginForm;
