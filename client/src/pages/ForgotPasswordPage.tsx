import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const { showNotification } = useApp();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await privateApi.post('/auth/forgot-password', data);
      setEmailSent(true);
      showNotification(
        'Password reset instructions have been sent to your email',
        'success'
      );
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to process request',
        'error'
      );
    }
  };

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
            Reset Your Password
          </Typography>

          <Typography
            variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.secondary,
              textAlign: 'center'
            }}
          >
            Enter your email address and we'll send you instructions to reset your password
          </Typography>

          {emailSent && (
            <Alert 
              severity="success" 
              sx={{ width: '100%', mb: 3 }}
            >
              Check your email for password reset instructions. The link will expire in 1 hour.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: '100%',
              mt: 1
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting || emailSent}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || emailSent}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Instructions'
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

export default ForgotPasswordPage;
