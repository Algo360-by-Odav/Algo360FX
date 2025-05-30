import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signUp(email, password, email);
      if (response.success) {
        setIsVerifying(true);
        enqueueSnackbar('Please check your email for verification code', { variant: 'info' });
      } else {
        enqueueSnackbar(response.message || 'Sign up failed', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Sign up failed', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First, try to sign out any existing session
      await authService.signOut();
      
      const response = await authService.confirmSignUp(email, verificationCode);
      if (response.success) {
        enqueueSnackbar('Email verified successfully', { variant: 'success' });
        
        // Sign in the user after successful verification
        try {
          const signInResponse = await authService.signIn(email, password);
          if (signInResponse.success) {
            await login(); // Wait for login to complete
            navigate('/dashboard', { replace: true }); // Use replace to prevent going back to signup
          } else {
            // If sign in fails, redirect to login page
            enqueueSnackbar('Please sign in with your credentials', { variant: 'info' });
            navigate('/login', { replace: true });
          }
        } catch (signInError: any) {
          console.error('Sign in error:', signInError);
          enqueueSnackbar('Please sign in with your credentials', { variant: 'info' });
          navigate('/login', { replace: true });
        }
      } else {
        enqueueSnackbar(response.message || 'Verification failed', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Verification failed', { variant: 'error' });
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
          {isVerifying ? 'Verify Email' : 'Sign Up'}
        </Typography>
        <Box component="form" onSubmit={isVerifying ? handleVerification : handleSignUp} sx={{ mt: 1 }}>
          {!isVerifying ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              name="verificationCode"
              label="Verification Code"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isLoading}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isVerifying ? 'Verify' : 'Sign Up'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
