import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  Language,
  LinkedIn,
  Twitter,
  GitHub,
  Upload,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

const Profile: React.FC = observer(() => {
  const [editMode, setEditMode] = useState(false);

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    bio: 'Professional trader with 5+ years of experience in forex and cryptocurrency markets.',
    website: 'www.johndoe.com',
    social: {
      linkedin: 'linkedin.com/in/johndoe',
      twitter: '@johndoe',
      github: 'github.com/johndoe',
    },
    skills: [
      'Technical Analysis',
      'Algorithmic Trading',
      'Risk Management',
      'Portfolio Optimization',
      'Python',
      'MQL5',
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                src="/avatar.jpg"
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Button
                variant="outlined"
                startIcon={<Upload />}
                size="small"
              >
                Change Photo
              </Button>
            </Box>
            <Typography variant="h5" align="center" gutterBottom>
              {userProfile.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 2 }}
            >
              {userProfile.bio}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Email fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={userProfile.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={userProfile.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={userProfile.location} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={userProfile.website} />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Social Links
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton color="primary">
                <LinkedIn />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
              <IconButton color="primary">
                <GitHub />
              </IconButton>
            </Box>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Skills */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Skills & Expertise</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    size="small"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Save' : 'Edit'}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userProfile.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={editMode ? () => {} : undefined}
                    />
                  ))}
                  {editMode && (
                    <Chip
                      label="+ Add Skill"
                      variant="outlined"
                      onClick={() => {}}
                    />
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Trading Preferences */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Trading Preferences
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Default Currency Pair"
                      defaultValue="EUR/USD"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Default Lot Size"
                      defaultValue="0.1"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Risk per Trade (%)"
                      defaultValue="1"
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Default Stop Loss (pips)"
                      defaultValue="50"
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* API Keys */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  API Keys
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="MetaTrader 5"
                      secondary="Connected"
                    />
                    <Button size="small" color="error">
                      Revoke
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="TradingView"
                      secondary="Not connected"
                    />
                    <Button size="small" color="primary">
                      Connect
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Profile;
