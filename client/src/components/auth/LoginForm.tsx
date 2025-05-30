import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Paper
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores/StoreProvider';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { authStore } = useStores();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authStore.login(data.email);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mt: 8
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Sign In
      </Typography>

      {authStore.error && (
        <Typography variant="body2" component="p" gutterBottom align="center" sx={{ color: 'error.main' }}>
          {authStore.error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={authStore.isLoading}
        >
          {authStore.isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/register" variant="body2">
            Don't have an account? Sign up
          </Link>
          <Link href="/forgot-password" variant="body2" sx={{ ml: 1 }}>
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

