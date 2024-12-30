import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Logo from '../../components/Common/Logo';

const AuthLayout: React.FC = observer(() => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme => theme.palette.background.default,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Logo size={64} sx={{ mb: 2 }} />
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Welcome to Algo360FX
          </Typography>
          <Outlet />
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {new Date().getFullYear()} Algo360FX. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link href="#" variant="body2" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
            <Link href="#" variant="body2" sx={{ mx: 1 }}>
              Contact Support
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});

export default AuthLayout;
