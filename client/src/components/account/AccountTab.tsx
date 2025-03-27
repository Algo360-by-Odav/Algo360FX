import React from 'react';
import { Box, Paper, Typography, Grid, Divider, Button, TextField } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';

const AccountTab: React.FC = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>Account</Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Profile Information</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue="John Doe"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="john.doe@example.com"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  defaultValue="+1 234 567 8900"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Account Details</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                <Typography variant="body1">Pro Trader</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Account ID</Typography>
                <Typography variant="body1">#123456789</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Leverage</Typography>
                <Typography variant="body1">1:100</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Account Currency</Typography>
                <Typography variant="body1">USD</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
                  Change Password
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
                  Enable 2FA
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" color="primary" fullWidth>
                  API Keys Management
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountTab;
