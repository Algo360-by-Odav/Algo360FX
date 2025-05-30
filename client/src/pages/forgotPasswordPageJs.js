// forgotPasswordPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Alert
} from '@mui/material';
import StandaloneTopBarWrapper from '../components/layout/StandaloneTopBarWrapper';

// Simple email validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // In development mode, just simulate success
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create the success message
  const createSuccessMessage = () => {
    return React.createElement(Alert, { severity: "success", sx: { mb: 3 } },
      "Password reset instructions have been sent to your email."
    );
  };

  // Create the form
  const createForm = () => {
    return React.createElement("form", { onSubmit: handleSubmit },
      React.createElement(TextField, {
        fullWidth: true,
        label: "Email Address",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        error: !!error,
        helperText: error,
        disabled: isSubmitting || emailSent,
        margin: "normal",
        variant: "outlined"
      }),
      
      React.createElement(Button, {
        type: "submit",
        fullWidth: true,
        variant: "contained",
        color: "primary",
        disabled: isSubmitting || emailSent,
        sx: { mt: 3, mb: 2 }
      }, isSubmitting ? 
        React.createElement(CircularProgress, { size: 24, color: "inherit" }) : 
        "Send Reset Instructions"
      ),
      
      React.createElement(Box, { textAlign: "center" },
        React.createElement(Link, {
          component: RouterLink,
          to: "/auth/sign-in",
          variant: "body2",
          color: "primary"
        }, "Back to Sign In")
      )
    );
  };

  // Create the main page structure
  return React.createElement(StandaloneTopBarWrapper, { pageType: 'auth' },
    React.createElement(Box, {
      sx: {
        minHeight: 'calc(100vh - 64px)', // Account for topbar height
        display: 'flex',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
        py: 8
      }
    }, 
      React.createElement(Container, { maxWidth: "sm" },
        React.createElement(Paper, {
          elevation: 3,
          sx: { p: 4, borderRadius: 2 }
        }, [
          React.createElement(Typography, {
            variant: "h5",
            component: "h1",
            gutterBottom: true,
            textAlign: "center",
            fontWeight: "bold",
            color: "primary",
            key: "title"
          }, "Forgot Password"),
          
          React.createElement(Typography, {
            variant: "body2",
            color: "text.secondary",
            textAlign: "center",
            mb: 3,
            key: "subtitle"
          }, "Enter your email address and we'll send you instructions to reset your password."),
          
          emailSent && createSuccessMessage(),
          
          createForm()
        ])
      )
    )
  );
};

export default ForgotPasswordPage;
