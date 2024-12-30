import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Container,
} from '@mui/material';
import { useAuth } from '@/stores/AuthStore';

const ForgotPassword: React.FC = observer(() => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  if (sent) {
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
            Check Your Email
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            We've sent password reset instructions to {email}. Please check your
            inbox.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/auth/login" variant="body2">
              Return to Sign In
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
          Reset Your Password
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Instructions
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/auth/login" variant="body2">
              Remember your password? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
});

export default ForgotPassword;
