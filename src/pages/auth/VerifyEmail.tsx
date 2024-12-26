import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Link,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/stores/AuthStore';

const VerifyEmail: React.FC = observer(() => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerification = async () => {
    if (!token) return;
    setVerifying(true);
    try {
      await verifyEmail(token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError('Email verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail();
      setResendCooldown(60);
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    }
  };

  if (verifying) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Email Verified Successfully
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Your email has been verified. You will be redirected to the login page
            shortly.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/auth/login" variant="body2">
              Go to Sign In
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Verify Your Email
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Please check your email for a verification link. If you haven't received
          it, you can request a new one.
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleResendEmail}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0
            ? `Resend Email (${resendCooldown}s)`
            : 'Resend Verification Email'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/auth/login" variant="body2">
            Back to Sign In
          </Link>
        </Box>
      </Paper>
    </Container>
  );
});

export default VerifyEmail;
