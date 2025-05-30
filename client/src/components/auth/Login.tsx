import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

/// <reference types="vite/client" />

declare module 'vite' {
  interface ImportMetaEnv {
    readonly VITE_COGNITO_CLIENT_ID: string;
    readonly VITE_ENV: 'development' | 'production';
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    const domain = 'us-east-1_dVdF18NRe.auth.us-east-1.amazoncognito.com';
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_ENV === 'production'
      ? encodeURIComponent('https://algo360fx.cloudfront.net/callback')
      : encodeURIComponent('http://localhost:5173/callback');
    const scopes = encodeURIComponent('email openid phone');
    window.location.href = `https://${domain}/login?client_id=${clientId}&response_type=code&scope=${scopes}&redirect_uri=${redirectUri}`;
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or continue with</span>
            </div>
          </div>
          <button
            onClick={handleOAuthLogin}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Hosted UI
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </Box>
    </Container>
  );
};

export default Login;
