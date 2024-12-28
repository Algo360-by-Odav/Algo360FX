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
      const response = await fetch('https://algo360fx-server.onrender.com/api/auth/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(2);
        setError('');
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
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
      // Move to registration step after verification
      setStep(3);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
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
    if (!formData.firstName) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName) {
      setError('Last name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

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
      setError(err.message || 'Registration failed. Please try again.');
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
        <Typography component="h1" variant="h5" gutterBottom>
          Create your Algo360FX Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                disabled={isSubmitting}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendCode}
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Send Verification Code'}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please enter the verification code sent to {formData.email}
              </Typography>
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
                disabled={isSubmitting}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyCode}
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Verify Code'}
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
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
});

export default Register;
