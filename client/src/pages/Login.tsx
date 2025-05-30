import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Google,
  GitHub,
  Twitter,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signIn(formData.email, formData.password);
      
      if (response.success) {
        // Navigate to dashboard on successful login
        navigate('/dashboard');
      } else if (response.nextStep === 'CONFIRM_SIGN_UP') {
        // If email not verified, navigate to verification page
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            username: formData.email
          } 
        });
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to continue to Algo360FX
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            margin="normal"
            required
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{ float: 'right' }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <IconButton color="primary" size="large" disabled={loading}>
            <Google />
          </IconButton>
          <IconButton color="primary" size="large" disabled={loading}>
            <GitHub />
          </IconButton>
          <IconButton color="primary" size="large" disabled={loading}>
            <Twitter />
          </IconButton>
        </Box>

        <Typography variant="body2" align="center">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
