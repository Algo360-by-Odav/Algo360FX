// resetPasswordPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
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

// Password validation
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  
  return '';
};

const ResetPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Validate token
    if (!token) {
      return;
    }
    
    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In development mode, just simulate success
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (error) {
      setPasswordError('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create the success message
  const createSuccessMessage = () => {
    return React.createElement(Alert, { severity: "success", sx: { mb: 3 } },
      "Your password has been reset successfully. You will be redirected to the login page."
    );
  };

  // Create the form
  const createForm = () => {
    return React.createElement("form", { onSubmit: handleSubmit },
      React.createElement(TextField, {
        fullWidth: true,
        label: "New Password",
        type: "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        error: !!passwordError,
        helperText: passwordError,
        disabled: isSubmitting || resetSuccess,
        margin: "normal",
        variant: "outlined"
      }),
      
      React.createElement(TextField, {
        fullWidth: true,
        label: "Confirm Password",
        type: "password",
        value: confirmPassword,
        onChange: (e) => setConfirmPassword(e.target.value),
        error: !!confirmPasswordError,
        helperText: confirmPasswordError,
        disabled: isSubmitting || resetSuccess,
        margin: "normal",
        variant: "outlined"
      }),
      
      React.createElement(Button, {
        type: "submit",
        fullWidth: true,
        variant: "contained",
        color: "primary",
        disabled: isSubmitting || resetSuccess,
        sx: { mt: 3, mb: 2 }
      }, isSubmitting ? 
        React.createElement(CircularProgress, { size: 24, color: "inherit" }) : 
        "Reset Password"
      ),
      
      React.createElement(Box, { textAlign: "center" },
        React.createElement(Link, {
          component: RouterLink,
          to: "/auth/signin",
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
          }, "Reset Password"),
          
          React.createElement(Typography, {
            variant: "body2",
            color: "text.secondary",
            textAlign: "center",
            mb: 3,
            key: "subtitle"
          }, "Enter your new password below."),
          
          resetSuccess && createSuccessMessage(),
          
          !token ? 
            React.createElement(Alert, { severity: "error", sx: { mb: 3 }, key: "error-alert" },
              "Invalid or missing reset token. Please request a new password reset link."
            ) : 
            createForm()
        ])
      )
    )
  );
};

export default ResetPasswordPage;
