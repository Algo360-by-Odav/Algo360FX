import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email, CheckCircle } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resendSignUpCode } from '@aws-amplify/auth';

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const username = location.state?.username || '';

  useEffect(() => {
    if (!email || !username) {
      navigate('/signup');
    }
  }, [email, username, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.confirmSignUp(username, verificationCode);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      await resendSignUpCode({ username });
      setCountdown(30);
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <CheckCircle
            color="success"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Email Verified!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Your email has been successfully verified. You can now access all features of Algo360FX.
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="large"
          >
            Continue to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Email color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography color="text.secondary">
            We've sent a verification code to{' '}
            <Typography component="span" fontWeight="bold">
              {email}
            </Typography>
            . Please enter the code below to verify your email address.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleVerification}>
          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setError(null);
            }}
            margin="normal"
            required
            inputProps={{ maxLength: 6 }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || verificationCode.length !== 6}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Email'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Didn't receive the code?
          </Typography>
          <Button
            onClick={handleResendCode}
            disabled={countdown > 0 || loading}
            sx={{ textTransform: 'none' }}
          >
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : 'Resend verification code'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Wrong email?{' '}
            <Link component={RouterLink} to="/signup">
              Change email address
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
