import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/AuthStore';
import '../styles/auth.css';

const steps = ['Account Details', 'Verification', 'Preferences'];

const Signup: React.FC = observer(() => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verificationCode: '',
    tradingExperience: '',
    acceptTerms: false,
    receiveUpdates: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
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
    return true;
  };

  const validateStep2 = () => {
    if (!formData.verificationCode.trim()) {
      setError('Verification code is required');
      return false;
    }
    if (formData.verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    setSuccess('');

    try {
      if (activeStep === 0) {
        if (!validateStep1()) return;
        const success = await authStore.sendVerificationCode(formData.email);
        if (success) {
          setSuccess('Verification code sent successfully');
          setActiveStep(prev => prev + 1);
        } else {
          setError(authStore.error || 'Failed to send verification code');
        }
      } else if (activeStep === 1) {
        if (!validateStep2()) return;
        const success = await authStore.verifyCode(formData.email, formData.verificationCode);
        if (success) {
          setSuccess('Code verified successfully');
          setActiveStep(prev => prev + 1);
        } else {
          setError(authStore.error || 'Invalid verification code');
        }
      } else if (activeStep === 2) {
        if (!validateStep3()) return;
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
      const success = await authStore.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        verificationCode: formData.verificationCode
      });

      if (success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(authStore.error || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    try {
      await authStore.socialSignup(provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Box>
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
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
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
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please enter the verification code sent to your email
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
          </>
        );
      case 2:
        return (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
              }
              label="I accept the terms and conditions"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onChange={handleChange}
                />
              }
              label="I want to receive updates and newsletters"
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
          <Typography variant="h4" component="h1">
            Create Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Start your trading journey with Algo360FX
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
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
            </Button>
          </Box>
        </form>

        {activeStep === 0 && (
          <>
            <Divider sx={{ my: 3 }}>OR</Divider>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialSignup('google')}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => handleSocialSignup('github')}
              >
                GitHub
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
});

export default Signup;
