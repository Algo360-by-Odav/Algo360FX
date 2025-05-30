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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Edit,
  Save,
  PhotoCamera,
  Notifications,
  Security,
  Language,
  DarkMode,
  DeleteForever,
  CloudDownload,
  VpnKey,
  AddCircle,
  RemoveCircle,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
  AccountBalance,
  ExpandMore,
  TrendingUp,
  Autorenew,
  NotificationsActive,
  Block,
  Person,
  CheckCircle,
} from '@mui/icons-material';

// Tab Panel component for better organization
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: [] as string[] });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  
  // Form data with expanded sections
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    timezone: 'UTC+8',
    language: 'English',
    darkMode: true,
    twoFactorAuth: true,
    
    // Trading Preferences
    tradingPreferences: {
      defaultLeverage: 10,
      riskLevel: 'medium',
      defaultOrderSize: 0.1,
      stopLossPercentage: 5,
      takeProfitPercentage: 10,
      preferredMarkets: ['forex', 'crypto'],
      autoClosePositions: true,
      tradingHours: {
        start: '09:00',
        end: '17:00',
      },
    },
    
    // Notification Settings
    notifications: {
      email: true,
      push: true,
      sms: false,
      priceAlerts: true,
      newsAlerts: true,
      tradeExecutions: true,
      accountActivity: true,
      marketingCommunications: false,
    },
    
    // Security Settings
    security: {
      twoFactorAuth: true,
      loginNotifications: true,
      ipRestriction: false,
      allowedIPs: [],
      sessionTimeout: 30, // minutes
    },
    
    // API Keys
    apiKeys: [
      {
        id: '1',
        name: 'Trading Bot',
        key: 'ak_7f8d9e2c3b1a5f6g7h8i9j0k',
        secret: '••••••••••••••••••••••••',
        permissions: ['read', 'trade'],
        created: '2025-04-15T10:30:00Z',
        lastUsed: '2025-05-22T14:45:00Z',
      },
    ],
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

  // Handle input change for nested fields
  const handleNestedInputChange = (section: string, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: event.target.value,
      },
    }));
  };

  // Handle select change for nested fields
  const handleNestedSelectChange = (section: string, field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: event.target.value,
      },
    }));
  };

  // Handle slider change for nested fields
  const handleSliderChange = (section: string, field: string) => (event: Event, newValue: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: newValue,
      },
    }));
  };

  // Handle notification toggle
  const handleNotificationToggle = (type: keyof typeof formData.notifications) => () => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  // Handle security toggle
  const handleSecurityToggle = (type: keyof typeof formData.security) => () => {
    setFormData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [type]: !prev.security[type],
      },
    }));
  };

  // Handle trading preferences toggle
  const handleTradingPrefToggle = (type: keyof typeof formData.tradingPreferences) => () => {
    setFormData(prev => ({
      ...prev,
      tradingPreferences: {
        ...prev.tradingPreferences,
        [type]: !prev.tradingPreferences[type as keyof typeof prev.tradingPreferences],
      },
    }));
  };

  // Handle adding a new API key
  const handleAddApiKey = (name: string, permissions: string[]) => {
    const newKey = {
      id: Date.now().toString(),
      name,
      key: `ak_${Math.random().toString(36).substring(2, 15)}`,
      secret: '••••••••••••••••••••••••',
      permissions,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
    
    setFormData(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey],
    }));
    
    setShowApiKeyDialog(false);
    setNotification({
      type: 'success',
      message: `API Key "${name}" created successfully.`,
    });
  };

  // Handle deleting an API key
  const handleDeleteApiKey = (id: string) => {
    setFormData(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== id),
    }));
    
    setNotification({
      type: 'success',
      message: 'API Key deleted successfully.',
    });
  };

  // Handle preferred markets change
  const handlePreferredMarketsChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      tradingPreferences: {
        ...prev.tradingPreferences,
        preferredMarkets: event.target.value,
      },
    }));
  };

  // Handle exporting user data
  const handleExportData = () => {
    // In a real app, this would call an API to generate the export
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'user-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setNotification({
      type: 'success',
      message: 'Your data has been exported successfully.',
    });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    setShowDeleteDialog(false);
    setNotification({
      type: 'success',
      message: 'Your account has been scheduled for deletion. You will receive a confirmation email.',
    });
  };

  // Handle save
  const handleSave = () => {
    // In a real app, this would call an API to save the changes
    setEditMode(false);
    setNotification({
      type: 'success',
      message: 'Your profile has been updated successfully.',
    });
  };

  // Render API Key Dialog
  const renderApiKeyDialog = () => {
    return (
      <Dialog open={showApiKeyDialog} onClose={() => setShowApiKeyDialog(false)}>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            API keys allow external applications to access your account. Give your key a name and select the permissions you want to grant.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="API Key Name"
            fullWidth
            value={newApiKey.name}
            onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={newApiKey.permissions}
              onChange={(e) => setNewApiKey({ ...newApiKey, permissions: e.target.value as string[] })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="trade">Trade</MenuItem>
              <MenuItem value="withdraw">Withdraw</MenuItem>
              <MenuItem value="deposit">Deposit</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiKeyDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleAddApiKey(newApiKey.name, newApiKey.permissions)}
            disabled={!newApiKey.name || newApiKey.permissions.length === 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render Delete Account Dialog
  const renderDeleteDialog = () => {
    return (
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and will result in the permanent loss of all your data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {notification && (
          <Alert severity={notification.type} sx={{ mb: 2 }} onClose={() => setNotification(null)}>
            {notification.message}
          </Alert>
        )}

        {/* API Key Dialog */}
        {renderApiKeyDialog()}

        {/* Delete Account Dialog */}
        {renderDeleteDialog()}

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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfileSettings;
