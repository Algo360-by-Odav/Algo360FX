import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Edit,
  Save,
  PhotoCamera,
  Notifications,
  Security,
  Language,
  DarkMode,
} from '@mui/icons-material';

const ProfileSettings: React.FC = () => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    timezone: 'UTC+8',
    language: 'English',
    darkMode: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    twoFactorAuth: true,
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNotificationToggle = (type: keyof typeof formData.notifications) => () => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    setNotification({
      type: 'success',
      message: 'Profile settings updated successfully!',
    });
    setEditMode(false);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {notification && (
        <Alert
          severity={notification.type}
          sx={{ mb: 2 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile Settings
          </Typography>
          <Button
            variant={editMode ? 'contained' : 'outlined'}
            startIcon={editMode ? <Save /> : <Edit />}
            onClick={() => editMode ? handleSave() : setEditMode(true)}
          >
            {editMode ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: `4px solid ${theme.palette.primary.main}`,
                }}
                src="/path-to-profile-image.jpg"
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                disabled={!editMode}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  disabled={!editMode}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={!editMode}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1 }} />
                  <TextField
                    fullWidth
                    label="Language"
                    value={formData.language}
                    onChange={handleInputChange('language')}
                    disabled={!editMode}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DarkMode sx={{ mr: 1 }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.darkMode}
                        onChange={() =>
                          setFormData(prev => ({
                            ...prev,
                            darkMode: !prev.darkMode,
                          }))
                        }
                        disabled={!editMode}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Notifications sx={{ mr: 1 }} />
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.email}
                      onChange={handleNotificationToggle('email')}
                      disabled={!editMode}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.push}
                      onChange={handleNotificationToggle('push')}
                      disabled={!editMode}
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.sms}
                      onChange={handleNotificationToggle('sms')}
                      disabled={!editMode}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1 }} />
              Security
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.twoFactorAuth}
                      onChange={() =>
                        setFormData(prev => ({
                          ...prev,
                          twoFactorAuth: !prev.twoFactorAuth,
                        }))
                      }
                      disabled={!editMode}
                    />
                  }
                  label="Two-Factor Authentication"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!editMode}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileSettings;
