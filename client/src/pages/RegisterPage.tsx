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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          message: 'Creating your account...' 
        } 
      });

      // Proceed with registration
      const registerResponse = await fetch('https://algo360fx-server.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registration failed');
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoFocus
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
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              helperText="Choose a unique username for your account"
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
              CREATE ACCOUNT
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/auth/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
