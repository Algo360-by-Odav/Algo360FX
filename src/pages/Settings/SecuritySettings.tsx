import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import {
  Security,
  VpnKey,
  Phonelink,
  History,
  Lock,
  DevicesOther,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/AuthStore';
import QRCode from './components/QRCode';
import DevicesList from './components/DevicesList';
import ActivityLog from './components/ActivityLog';
import './Settings.css';

interface SecurityState {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  deviceTrust: boolean;
}

const SecuritySettings: React.FC = observer(() => {
  const authStore = useAuthStore();
  const [securityState, setSecurityState] = useState<SecurityState>({
    twoFactorEnabled: false,
    biometricEnabled: false,
    loginNotifications: true,
    deviceTrust: true,
  });

  const [open2FADialog, setOpen2FADialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState('');

  const handleSecurityChange = (setting: keyof SecurityState) => {
    setSecurityState(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handle2FASetup = async () => {
    try {
      // Implement 2FA setup logic
      setShowQRCode(true);
    } catch (error) {
      setError('Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      // Implement 2FA verification logic
      setOpen2FADialog(false);
      setSecurityState(prev => ({
        ...prev,
        twoFactorEnabled: true,
      }));
    } catch (error) {
      setError('Invalid verification code');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Security Overview */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
              borderRadius: '16px',
            }}
          >
            <Security sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h5" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Manage your account security and authentication methods
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Two-Factor Authentication */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>
                <ListItemText
                  primary="Authenticator App"
                  secondary={
                    securityState.twoFactorEnabled
                      ? 'Enabled and active'
                      : 'Not configured'
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    onClick={() => setOpen2FADialog(true)}
                  >
                    {securityState.twoFactorEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phonelink />
                </ListItemIcon>
                <ListItemText
                  primary="Biometric Authentication"
                  secondary="Use fingerprint or face recognition"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={securityState.biometricEnabled}
                    onChange={() => handleSecurityChange('biometricEnabled')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Login Security */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Login Security
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText
                  primary="Login Notifications"
                  secondary="Get notified of new login attempts"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={securityState.loginNotifications}
                    onChange={() => handleSecurityChange('loginNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DevicesOther />
                </ListItemIcon>
                <ListItemText
                  primary="Trusted Devices"
                  secondary="Remember devices for 30 days"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={securityState.deviceTrust}
                    onChange={() => handleSecurityChange('deviceTrust')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Active Devices */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Active Devices
            </Typography>
            <DevicesList />
          </Paper>
        </Grid>

        {/* Security Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Recent Security Activity
            </Typography>
            <ActivityLog />
          </Paper>
        </Grid>
      </Grid>

      {/* 2FA Setup Dialog */}
      <Dialog
        open={open2FADialog}
        onClose={() => setOpen2FADialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {securityState.twoFactorEnabled
            ? 'Manage Two-Factor Authentication'
            : 'Setup Two-Factor Authentication'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!securityState.twoFactorEnabled && !showQRCode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Two-factor authentication adds an extra layer of security to your
                account. You'll need to enter a code from your authenticator app
                when signing in.
              </Typography>
              <Button
                variant="contained"
                onClick={handle2FASetup}
                sx={{ mt: 2 }}
              >
                Begin Setup
              </Button>
            </Box>
          )}

          {showQRCode && (
            <>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <QRCode value="otpauth://totp/Algo360FX:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Algo360FX" />
              </Box>
              <Typography variant="body2" gutterBottom>
                Scan this QR code with your authenticator app, then enter the
                verification code below.
              </Typography>
              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen2FADialog(false)}>Cancel</Button>
          {showQRCode && (
            <Button variant="contained" onClick={handleVerify2FA}>
              Verify
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default SecuritySettings;
