// signUpPageJs.js - JavaScript version without JSX
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

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      await signUp(formData.email, formData.password, formData.email);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper function to create the password visibility toggle button
  const createVisibilityToggle = (showState, setShowState) => {
    return React.createElement(InputAdornment, { position: "end" },
      React.createElement(IconButton, {
        onClick: () => setShowState(!showState),
        edge: "end",
        "aria-label": "toggle password visibility"
      }, showState ? 
        React.createElement(VisibilityOffIcon) : 
        React.createElement(VisibilityIcon)
      )
    );
  };

  // Create the form elements
  const createForm = () => {
    return React.createElement("form", { onSubmit: handleSubmit },
      React.createElement(Stack, { spacing: 3 },
        // First Name field
        React.createElement(TextField, {
          fullWidth: true,
          label: "First Name",
          name: "firstName",
          value: formData.firstName,
          onChange: handleChange,
          required: true,
          variant: "outlined"
        }),
        
        // Last Name field
        React.createElement(TextField, {
          fullWidth: true,
          label: "Last Name",
          name: "lastName",
          value: formData.lastName,
          onChange: handleChange,
          required: true,
          variant: "outlined"
        }),
        
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
            endAdornment: createVisibilityToggle(showPassword, setShowPassword)
          }
        }),
        
        // Confirm Password field
        React.createElement(TextField, {
          fullWidth: true,
          label: "Confirm Password",
          name: "confirmPassword",
          type: showConfirmPassword ? "text" : "password",
          value: formData.confirmPassword,
          onChange: handleChange,
          required: true,
          variant: "outlined",
          InputProps: {
            endAdornment: createVisibilityToggle(showConfirmPassword, setShowConfirmPassword)
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
        }, "Sign Up"),
        
        // Sign in link
        React.createElement(Box, { textAlign: "center", mt: 2 },
          React.createElement(Typography, { variant: "body2" },
            "Already have an account? ",
            React.createElement(Link, {
              component: RouterLink,
              to: "/auth/sign-in",
              variant: "body2",
              color: "primary"
            }, "Sign in")
          )
        )
      )
    );
  };

  // Create the main page structure
  return React.createElement(
    StandaloneTopBarWrapper, 
    { pageType: 'signup' },
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
                "Create an Account"
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
                "Fill in the form below to create your account"
              ),
              
              createForm()
            ]
          )
        ]
      )
    )
  );
};

export default SignUpPage;
