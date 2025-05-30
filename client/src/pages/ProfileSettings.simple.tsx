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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit,
  Save,
  PhotoCamera,
  Person,
  TrendingUp,
  Notifications,
  Security,
  VpnKey,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Simple tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfileSettings: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Basic form data
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    timezone: 'UTC+8',
    language: 'English',
    darkMode: true,
  });

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle input change for simple fields
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Handle save
  const handleSave = () => {
    setEditMode(false);
    setNotification({
      type: 'success',
      message: 'Your profile has been updated successfully.',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {notification && (
          <Alert severity={notification.type} sx={{ mb: 2 }} onClose={() => setNotification(null)}>
            {notification.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile Settings
          </Typography>
          <Box>
            {!editMode ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
            <Tab label="Trading Preferences" icon={<TrendingUp />} iconPosition="start" />
            <Tab label="Notifications" icon={<Notifications />} iconPosition="start" />
            <Tab label="Security" icon={<Security />} iconPosition="start" />
            <Tab label="API Keys" icon={<VpnKey />} iconPosition="start" />
            <Tab label="Account Management" icon={<SettingsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={activeTab} index={0}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timezone"
                    value={formData.timezone}
                    onChange={handleInputChange('timezone')}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Language"
                    value={formData.language}
                    onChange={handleInputChange('language')}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Other tabs will be implemented later */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6">Trading Preferences</Typography>
          <Typography variant="body1">Trading preferences settings will be implemented soon.</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6">Notifications</Typography>
          <Typography variant="body1">Notification settings will be implemented soon.</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6">Security</Typography>
          <Typography variant="body1">Security settings will be implemented soon.</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6">API Keys</Typography>
          <Typography variant="body1">API key management will be implemented soon.</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Typography variant="h6">Account Management</Typography>
          <Typography variant="body1">Account management options will be implemented soon.</Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfileSettings;
