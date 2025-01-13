import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  LinearProgress,
  Tooltip,
  Divider
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Info as InfoIcon,
  Microsoft as MicrosoftIcon,
  Apple as AppleIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { privateApi } from '@/config/api';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.match(/[A-Z]/)) strength += 20;
  if (password.match(/[a-z]/)) strength += 20;
  if (password.match(/[0-9]/)) strength += 20;
  if (password.match(/[^A-Za-z0-9]/)) strength += 20;
  return strength;
};

const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 20) return '#f44336';
  if (strength <= 40) return '#ff9800';
  if (strength <= 60) return '#ffeb3b';
  if (strength <= 80) return '#4caf50';
  return '#2e7d32';
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password || ''));
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await privateApi.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });

      showNotification('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Registration failed',
        'error'
      );
    }
  };

  const handleSocialSignUp = (provider: string) => async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
    } catch (error: any) {
      showNotification(`${provider} sign up failed`, 'error');
    }
  };

  const socialProviders = [
    {
      name: 'Google',
      icon: <GoogleIcon />,
      color: '#DB4437',
      handler: handleSocialSignUp('google')
    },
    {
      name: 'GitHub',
      icon: <GitHubIcon />,
      color: '#333',
      handler: handleSocialSignUp('github')
    },
    {
      name: 'Microsoft',
      icon: <MicrosoftIcon />,
      color: '#00A4EF',
      handler: handleSocialSignUp('microsoft')
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0077B5',
      handler: handleSocialSignUp('linkedin')
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1DA1F2',
      handler: handleSocialSignUp('twitter')
    },
    {
      name: 'Apple',
      icon: <AppleIcon />,
      color: '#000000',
      handler: handleSocialSignUp('apple')
    }
  ];

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getPasswordStrengthColor(passwordStrength)
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Password Strength: {passwordStrength}%
                  </Typography>
                  <Tooltip title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>
          </Box>

          <Grid container spacing={2}>
            {socialProviders.map((provider) => (
              <Grid item xs={12} sm={6} key={provider.name}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={provider.icon}
                  onClick={provider.handler}
                  sx={{
                    borderColor: provider.color,
                    color: provider.color,
                    '&:hover': {
                      borderColor: provider.color,
                      backgroundColor: `${provider.color}10`
                    }
                  }}
                >
                  {provider.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By signing up, you agree to our{' '}
          <Link component={RouterLink} to="/terms" color="primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link component={RouterLink} to="/privacy" color="primary">
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
