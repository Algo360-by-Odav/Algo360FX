// verifyEmailJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email, CheckCircle, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resendSignUpCode } from '@aws-amplify/auth';
import StandaloneTopBarWrapper from '../components/layout/StandaloneTopBarWrapper';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const username = location.state?.username || '';

  useEffect(() => {
    if (!email || !username) {
      navigate('/signup');
    }
  }, [email, username, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerification = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In development mode, just simulate success
      // await authService.confirmSignUp(username, verificationCode);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      // In development mode, just simulate success
      // await resendSignUpCode({ username });
      setCountdown(30);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Create the success message
  const createSuccessMessage = () => {
    return React.createElement(Box, { textAlign: "center", my: 3 },
      React.createElement(CheckCircle, { 
        color: "success", 
        sx: { fontSize: 60, mb: 2 } 
      }),
      React.createElement(Typography, { variant: "h5", gutterBottom: true },
        "Email Verified Successfully!"
      ),
      React.createElement(Typography, { variant: "body1", mb: 2 },
        "You will be redirected to the login page shortly."
      )
    );
  };

  // Create the verification form
  const createVerificationForm = () => {
    return React.createElement("form", { onSubmit: handleVerification },
      React.createElement(Box, { textAlign: "center", mb: 3 },
        React.createElement(Email, { 
          color: "primary", 
          sx: { fontSize: 60, mb: 2 } 
        }),
        React.createElement(Typography, { variant: "h5", gutterBottom: true },
          "Verify Your Email"
        ),
        React.createElement(Typography, { variant: "body1" },
          "We've sent a verification code to ",
          React.createElement("strong", null, email),
          ". Please enter it below to verify your email address."
        )
      ),
      
      error && React.createElement(Alert, { 
        severity: "error", 
        sx: { mb: 3 } 
      }, error),
      
      React.createElement(TextField, {
        fullWidth: true,
        label: "Verification Code",
        value: verificationCode,
        onChange: (e) => setVerificationCode(e.target.value),
        margin: "normal",
        required: true,
        disabled: loading || success
      }),
      
      React.createElement(Button, {
        type: "submit",
        fullWidth: true,
        variant: "contained",
        color: "primary",
        disabled: loading || success || !verificationCode,
        sx: { mt: 3, mb: 2 }
      }, loading ? 
        React.createElement(CircularProgress, { size: 24, color: "inherit" }) : 
        "Verify Email"
      ),
      
      React.createElement(Box, { textAlign: "center" },
        React.createElement(Button, {
          variant: "text",
          disabled: countdown > 0 || loading || success,
          onClick: handleResendCode,
          sx: { mb: 2 }
        }, countdown > 0 ? 
          `Resend code in ${countdown}s` : 
          "Resend verification code"
        ),
        
        React.createElement(Typography, { variant: "body2" },
          "Already verified? ",
          React.createElement(Link, {
            component: RouterLink,
            to: "/auth/signin",
            variant: "body2",
            color: "primary"
          }, "Sign in")
        )
      )
    );
  };

  // Create the main page structure
  return React.createElement(StandaloneTopBarWrapper, { pageType: 'auth' },
    React.createElement(Container, { 
      maxWidth: "sm", 
      sx: { py: 8 } 
    },
      React.createElement(Paper, {
        elevation: 3,
        sx: { p: 4, borderRadius: 2 }
      }, success ? createSuccessMessage() : createVerificationForm())
    )
  );
};

export default VerifyEmail;
