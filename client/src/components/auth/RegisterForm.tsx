import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: FC = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStores();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authStore.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        mt: 8
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>

      {authStore.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authStore.error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                required
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                required
              />
            )}
          />
        </Box>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  color={errors.acceptTerms ? 'error' : 'primary'}
                />
              }
              label={
                <Box component="span" sx={{ color: errors.acceptTerms ? 'error.main' : 'inherit' }}>
                  I accept the{' '}
                  <Link href="/terms" target="_blank">
                    terms and conditions
                  </Link>
                </Box>
              }
            />
          )}
        />
        {errors.acceptTerms && (
          <Typography variant="caption" color="error">
            {errors.acceptTerms.message}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={authStore.isLoading}
        >
          {authStore.isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link href="/login" variant="body2">
            Login here
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
});

