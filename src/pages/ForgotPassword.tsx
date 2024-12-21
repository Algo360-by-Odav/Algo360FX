import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '../stores/AuthStore';
import '../styles/auth.css';

const steps = ['Email Verification', 'Reset Code', 'New Password'];

const ForgotPassword: React.FC = observer(() => {
  const authStore = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        await authStore.sendPasswordResetCode(formData.email);
        setSuccess('Reset code sent to your email');
        setActiveStep(1);
      } else if (activeStep === 1) {
        await authStore.verifyResetCode(formData.email, formData.verificationCode);
        setActiveStep(2);
      } else {
        await handleSubmit();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      await authStore.resetPassword(
        formData.email,
        formData.verificationCode,
        formData.newPassword
      );
      setSuccess('Password reset successful. You can now log in with your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a code to reset your password.
            </Typography>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter the verification code sent to your email.
            </Typography>
            <Box className="verification-code">
              <TextField
                fullWidth
                label="Verification Code"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Box>
            <Button
              variant="text"
              onClick={() => authStore.sendPasswordResetCode(formData.email)}
              sx={{ mb: 2 }}
            >
              Resend Code
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your new password.
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Typography variant="h4" component="h1" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Follow the steps to reset your password
          </Typography>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form className="auth-form">
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Reset Password' : 'Next'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Log in
              </Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
});

export default ForgotPassword;
