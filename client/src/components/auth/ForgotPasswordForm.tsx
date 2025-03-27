import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useStores } from '../../stores/StoreProvider';
import { useSnackbar } from 'notistack';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { authStore } = useStores();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authStore.forgotPassword(data.email);
      enqueueSnackbar('Password reset instructions sent to your email', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to send reset instructions', {
        variant: 'error',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={authStore.isLoading}
      >
        {authStore.isLoading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/login" variant="body2">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

