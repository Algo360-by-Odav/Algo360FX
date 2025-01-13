import React from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { privateApi } from '@/config/api';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useApp();
  const token = searchParams.get('token');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showNotification('Invalid reset token', 'error');
      return;
    }

    try {
      await privateApi.post('/auth/reset-password', {
        token,
        password: data.password
      });

      showNotification('Password has been successfully reset', 'success');
      navigate('/login');
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to reset password',
        'error'
      );
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
          py: 12,
          px: 4
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid or expired reset token. Please request a new password reset.
          </Alert>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{ color: theme.palette.primary.main }}
            >
              Request New Reset Link
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        py: 12,
        px: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Set New Password
          </Typography>

          <Typography
            variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.secondary,
              textAlign: 'center'
            }}
          >
            Enter your new password below
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: '100%',
              mt: 1
            }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="New Password"
                  autoComplete="new-password"
                  autoFocus
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="confirmPassword"
                  label="Confirm New Password"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Reset Password'
              )}
            </Button>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ color: theme.palette.primary.main }}
              >
                Back to Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
