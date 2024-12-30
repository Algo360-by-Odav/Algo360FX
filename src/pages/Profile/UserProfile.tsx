import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  TrendingUp,
  AccessTime,
  Assessment,
  Security,
} from '@mui/icons-material';
import { useAuth } from '../../stores/AuthStore';
import EditProfileDialog from './components/EditProfileDialog';
import ActivityTimeline from './components/ActivityTimeline';
import TradingStats from './components/TradingStats';
import './Profile.css';

const UserProfile: React.FC = observer(() => {
  const auth = useAuth();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [uploadAnchorEl, setUploadAnchorEl] = useState<null | HTMLElement>(null);

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement photo upload
      console.log('Photo upload:', file);
    }
  };

  const tradingStats = {
    totalTrades: 156,
    winRate: 68.5,
    profitFactor: 2.3,
    averageWin: 250,
    averageLoss: -120,
    largestWin: 1200,
    largestLoss: -450,
    sharpeRatio: 1.8,
    drawdown: -15.2,
  };

  if (!auth.currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view your profile</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handlePhotoUpload}
                    />
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={auth.currentUser.photoUrl}
                >
                  {auth.currentUser.firstName[0]}
                  {auth.currentUser.lastName[0]}
                </Avatar>
              </Badge>
              <Box sx={{ ml: 3, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" component="div">
                    {auth.currentUser.firstName} {auth.currentUser.lastName}
                  </Typography>
                  <Tooltip title="Edit Profile">
                    <IconButton onClick={handleEditClick} sx={{ ml: 1 }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {auth.currentUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {auth.currentUser.role}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Trading Stats */}
        <Grid item xs={12} md={8}>
          <TradingStats stats={tradingStats} />
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={4}>
          <ActivityTimeline />
        </Grid>
      </Grid>

      <EditProfileDialog
        open={openEditDialog}
        onClose={handleEditClose}
        user={auth.currentUser}
      />
    </Box>
  );
});

export default UserProfile;
