// signInPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StandaloneTopBarWrapper from '../../components/layout/StandaloneTopBarWrapper';

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper function to create the password visibility toggle button
  const createVisibilityToggle = () => {
    return React.createElement(InputAdornment, { position: "end" },
      React.createElement(IconButton, {
        onClick: () => setShowPassword(!showPassword),
        edge: "end",
        "aria-label": "toggle password visibility"
      }, showPassword ? 
        React.createElement(VisibilityOffIcon) : 
        React.createElement(VisibilityIcon)
      )
    );
  };

  // Create the form elements
  const createForm = () => {
    return React.createElement("form", { onSubmit: handleSubmit },
      React.createElement(Stack, { spacing: 3 },
        // Email field
        React.createElement(TextField, {
          fullWidth: true,
          label: "Email Address",
          name: "email",
          type: "email",
          value: formData.email,
          onChange: handleChange,
          required: true,
          variant: "outlined"
        }),
        
        // Password field
        React.createElement(TextField, {
          fullWidth: true,
          label: "Password",
          name: "password",
          type: showPassword ? "text" : "password",
          value: formData.password,
          onChange: handleChange,
          required: true,
          variant: "outlined",
          InputProps: {
            endAdornment: createVisibilityToggle()
          }
        }),
        
        // Submit button
        React.createElement(Button, {
          fullWidth: true,
          type: "submit",
          variant: "contained",
          color: "primary",
          size: "large",
          sx: { mt: 2 }
        }, "Sign In"),
        
        // Forgot password link
        React.createElement(Box, { textAlign: "center", mt: 2 },
          React.createElement(Link, {
            component: RouterLink,
            to: "/auth/forgot-password",
            variant: "body2",
            color: "primary"
          }, "Forgot password?")
        ),
        
        // Sign up link
        React.createElement(Box, { textAlign: "center", mt: 1 },
          React.createElement(Typography, { variant: "body2" },
            "Don't have an account? ",
            React.createElement(Link, {
              component: RouterLink,
              to: "/auth/sign-up",
              variant: "body2",
              color: "primary"
            }, "Sign up")
          )
        )
      )
    );
  };

  // Create the main page structure
  return React.createElement(
    StandaloneTopBarWrapper, 
    { pageType: 'signin' },
    React.createElement(
      Box, 
      {
        sx: {
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }
      }, 
      React.createElement(
        Container, 
        { maxWidth: "sm" },
        [
          // Logo
          React.createElement(
            Box, 
            { key: 'logo-container', sx: { mb: 4, textAlign: 'center' } },
            React.createElement(
              Box, 
              {
                component: "img",
                src: "/images/algo360fx-logo.svg",
                alt: "ALGO360FX",
                sx: {
                  height: 50,
                  width: 'auto',
                  mb: 2,
                }
              }
            )
          ),
          
          // Form container
          React.createElement(
            Paper, 
            {
              key: 'form-container',
              elevation: 3,
              sx: { 
                p: 4, 
                borderRadius: 2,
                bgcolor: 'background.paper'
              }
            },
            [
              React.createElement(
                Typography, 
                {
                  key: 'title',
                  variant: "h5",
                  component: "h1",
                  gutterBottom: true,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "primary"
                }, 
                "Sign In"
              ),
              
              React.createElement(
                Typography, 
                {
                  key: 'subtitle',
                  variant: "body2",
                  color: "text.secondary",
                  textAlign: "center",
                  mb: 3
                }, 
                "Enter your credentials to access your account"
              ),
              
              createForm()
            ]
          )
        ]
      )
    )
  );
};

export default SignInPage;
