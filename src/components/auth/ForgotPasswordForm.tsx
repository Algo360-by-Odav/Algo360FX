import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Link as RouterLink } from 'react-router-dom';
import { useRootStore } from '../../hooks/useRootStore';

const ForgotPasswordForm: React.FC = observer(() => {
  const { authStore } = useRootStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      await authStore.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  if (isSubmitted) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          mx: 'auto',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Check Your Email
        </Typography>
        <Typography>
          We've sent password reset instructions to {email}. Please check your email
          and follow the instructions to reset your password.
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Reset Password
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

      {authStore.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authStore.error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        disabled={authStore.isLoading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={authStore.isLoading}
        sx={{ mt: 2 }}
      >
        {authStore.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Send Reset Instructions'
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          underline="hover"
        >
          Remember your password? Sign in
        </Link>
      </Box>
    </Box>
  );
});

export default ForgotPasswordForm;
