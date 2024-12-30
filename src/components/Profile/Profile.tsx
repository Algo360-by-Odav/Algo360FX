import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Edit,
  Save,
  Notifications,
  Security,
  Language,
  AccountBalance,
  Delete,
} from '@mui/icons-material';
import './Profile.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    timezone: 'UTC+8',
    language: 'English',
    tradingExperience: '5+ years',
    preferredMarkets: ['Forex', 'Stocks', 'Crypto'],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="profile">
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card className="profile-card">
            <CardContent>
              <Box className="profile-header">
                <Avatar
                  src="/path-to-avatar.jpg"
                  className="profile-avatar"
                />
                <Typography variant="h5">{profileData.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {profileData.email}
                </Typography>
                <Box className="profile-tags">
                  {profileData.preferredMarkets.map((market) => (
                    <Chip key={market} label={market} size="small" />
                  ))}
                </Box>
              </Box>
              <Divider className="profile-divider" />
              <List>
                <ListItem>
                  <ListItemText
                    primary="Trading Experience"
                    secondary={profileData.tradingExperience}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Timezone"
                    secondary={profileData.timezone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Language"
                    secondary={profileData.language}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Tabs */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab icon={<Edit />} label="Personal Info" />
                <Tab icon={<Security />} label="Security" />
                <Tab icon={<Notifications />} label="Notifications" />
                <Tab icon={<AccountBalance />} label="Trading" />
              </Tabs>

              {/* Personal Info Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box className="form-section">
                  <Box className="section-header">
                    <Typography variant="h6">Personal Information</Typography>
                    <Button
                      startIcon={editMode ? <Save /> : <Edit />}
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? 'Save' : 'Edit'}
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.name}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileData.email}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Timezone"
                        value={profileData.timezone}
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box className="form-section">
                  <Typography variant="h6" gutterBottom>
                    Security Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Two-Factor Authentication"
                        secondary="Secure your account with 2FA"
                      />
                      <ListItemSecondaryAction>
                        <Switch />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Trading Password"
                        secondary="Separate password for trading operations"
                      />
                      <ListItemSecondaryAction>
                        <Button color="primary">Change</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="API Keys"
                        secondary="Manage your API keys"
                      />
                      <ListItemSecondaryAction>
                        <Button color="primary">Manage</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>

              {/* Notifications Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box className="form-section">
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Trade Notifications"
                        secondary="Get notified about your trade executions"
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Price Alerts"
                        secondary="Receive alerts for price movements"
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Bot Updates"
                        secondary="Get notifications about your trading bots"
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Market News"
                        secondary="Stay updated with market news"
                      />
                      <ListItemSecondaryAction>
                        <Switch />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>

              {/* Trading Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box className="form-section">
                  <Typography variant="h6" gutterBottom>
                    Trading Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Default Order Size"
                        secondary="Set your default trading size"
                      />
                      <ListItemSecondaryAction>
                        <TextField
                          size="small"
                          type="number"
                          defaultValue="0.01"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Risk Management"
                        secondary="Maximum risk per trade"
                      />
                      <ListItemSecondaryAction>
                        <TextField
                          size="small"
                          type="number"
                          defaultValue="1"
                          InputProps={{
                            endAdornment: <Typography>%</Typography>,
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Preferred Markets"
                        secondary="Set your default markets"
                      />
                      <ListItemSecondaryAction>
                        <Button color="primary">Configure</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
