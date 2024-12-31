import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
} from '@mui/material';
import { useApp } from '../context/AppContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      await requestVerificationCode();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Passwords do not match',
          type: 'error'
        }
      });
      return;
    }

    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Verifying code...' 
        } 
      });

      // First verify the code
      const verifyResponse = await fetch('https://algo360fx-server.onrender.com/api/auth/verify/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Invalid verification code');
      }

      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Creating your account...' 
        } 
      });

      // Then proceed with registration
      const registerResponse = await fetch('https://algo360fx-server.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        throw new Error(registerData.error || registerData.message || 'Registration failed');
      }

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Registration successful! Please login with your credentials.',
          type: 'success'
        }
      });
      
      navigate('/auth/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: err.message || 'Failed to register',
          type: 'error'
        }
      });
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { isLoading: false } 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const requestVerificationCode = async () => {
    if (!formData.email) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Please enter your email first',
          type: 'error'
        }
      });
      return;
    }

    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Sending verification code...' 
        } 
      });

      const response = await fetch('https://algo360fx-server.onrender.com/api/auth/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Verification code sent! Please check your email.',
          type: 'success'
        }
      });
      setStep(2);
    } catch (err: any) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: err.message || 'Failed to send verification code',
          type: 'error'
        }
      });
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { isLoading: false } 
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Create your Algo360FX Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {step === 1 ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send Verification Code
                </Button>
              </>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="verificationCode"
                  label="Verification Code"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
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
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
              </>
            )}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/auth/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
