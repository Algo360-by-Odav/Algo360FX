import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, TextField, Typography, Container, Alert, Link } from '@mui/material';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

interface SignUpStep {
  signUpStep: string;
}

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setIsAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await authService.signUp(email, password, email);
      if (response.success) {
        setIsVerifying(true);
        enqueueSnackbar('Please check your email for verification code', { variant: 'info' });
      } else {
        enqueueSnackbar(response.message || 'Sign up failed', { variant: 'error' });
      }
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authService.confirmSignUp(email, verificationCode);
      if (response.success) {
        enqueueSnackbar('Email verified successfully', { variant: 'success' });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed');
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
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
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
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isVerifying ? 'Verify' : 'Sign Up'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
