import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { authService } from '@/services/authService';

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const email = location.state?.email || '';

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      enqueueSnackbar('Email not found. Please try signing up again.', { variant: 'error' });
      navigate('/signup');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.confirmSignUp(email, verificationCode);
      if (response.success) {
        enqueueSnackbar('Email verified successfully!', { variant: 'success' });
        navigate('/login');
      } else {
        enqueueSnackbar(response.message || 'Verification failed', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to verify email', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Verify Your Email
        </Typography>
        <Box component="form" onSubmit={handleVerification} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="verificationCode"
            label="Verification Code"
            name="verificationCode"
            autoFocus
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Verify Email
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/signup')}
            disabled={isLoading}
          >
            Back to Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
