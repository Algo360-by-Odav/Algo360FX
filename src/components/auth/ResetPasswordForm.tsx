import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useRootStore } from '../../hooks/useRootStore';

const ResetPasswordForm: React.FC = observer(() => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { authStore } = useRootStore();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    try {
      await authStore.resetPassword({
        token,
        newPassword: formData.password,
      });
      navigate('/login', {
        state: { message: 'Password has been reset successfully. Please login with your new password.' },
      });
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!token) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Invalid or expired reset link
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/forgot-password')}
          sx={{ mt: 2 }}
        >
          Request New Reset Link
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Reset Your Password
      </Typography>

      {authStore.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authStore.error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="New Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        disabled={authStore.isLoading}
      />

      <TextField
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        disabled={authStore.isLoading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={authStore.isLoading}
        sx={{ mt: 2 }}
      >
        {authStore.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Reset Password'
        )}
      </Button>
    </Box>
  );
});

export default ResetPasswordForm;
