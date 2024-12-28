import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/stores/AuthStore';
import { UserRole } from '@/types/user';
import { api } from '@/services/api';

const Register: React.FC = observer(() => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Registration
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    verificationCode: '',
    role: UserRole.USER,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/verify/send', {
        email: formData.email
      });

      if (response.data.success) {
        setStep(2);
        setError('');
      } else {
        setError(response.data.error || 'Failed to send verification code');
      }
    } catch (err: any) {
      console.error('Error sending verification code:', err);
      setError(err.response?.data?.error || err.message || 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setError('Verification code is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/verify/code', {
        email: formData.email,
        code: formData.verificationCode
      });

      if (response.data.success) {
        setStep(3);
        setError('');
      } else {
        setError(response.data.error || 'Invalid verification code');
      }
    } catch (err: any) {
      console.error('Error verifying code:', err);
      setError(err.response?.data?.error || err.message || 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.firstName) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName) {
      setError('Last name is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.verificationCode) {
      setError('Verification code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        verificationCode: formData.verificationCode,
      });
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Create your Algo360FX Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {step === 1 && (
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
                value={formData.email}
                onChange={handleChange}
                error={!!error}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendCode}
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="verificationCode"
                label="Verification Code"
                name="verificationCode"
                autoFocus
                value={formData.verificationCode}
                onChange={handleChange}
                error={!!error}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyCode}
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Verify Code'
                )}
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!error}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!error}
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
                value={formData.password}
                onChange={handleChange}
                error={!!error}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!error}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Register'
                )}
              </Button>
            </>
          )}

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/auth/login')}
            sx={{ mt: 1 }}
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

export default Register;
