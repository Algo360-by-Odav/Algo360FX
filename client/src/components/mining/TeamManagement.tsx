import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  LinearProgress,
  Stack,
  Tooltip,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  People,
  PersonAdd,
  Edit,
  Delete,
  Share,
  ContentCopy,
  CheckCircle,
  BarChart,
  Speed,
  MoreVert,
  EmailOutlined,
  EmojiEvents,
  Group,
  CompareArrows,
  Settings,
  Message
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import withMiningObserver from './withMiningObserver';

// Styled components
const TeamCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const LeaderboardAvatar = styled(Avatar)<{ position: number }>(({ theme, position }) => {
  const colors = [
    theme.palette.warning.main, // Gold for 1st
    theme.palette.grey[400],    // Silver for 2nd
    theme.palette.common.brown || '#cd7f32', // Bronze for 3rd
    theme.palette.primary.main  // Primary for others
  ];
  
  return {
    backgroundColor: position <= 3 ? colors[position - 1] : colors[3],
    border: position <= 3 ? `2px solid ${colors[position - 1]}` : 'none',
    boxShadow: position <= 3 ? theme.shadows[2] : 'none',
    width: position <= 3 ? 40 : 32,
    height: position <= 3 ? 40 : 32,
    fontSize: position <= 3 ? 18 : 16
  };
});

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (member: any) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, onClose, onAdd }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');

  const handleAdd = () => {
    onAdd({
      id: `user-${Date.now()}`,
      name,
      role,
      email,
      contribution: 0,
      share: 0,
      earnings: 0
    });
    setEmail('');
    setName('');
    setRole('member');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Team Member</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          select
          margin="dense"
          label="Role"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
          SelectProps={{
            native: true,
          }}
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleAdd} 
          color="primary" 
          variant="contained"
          disabled={!name || !email}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ open, onClose, teamName }) => {
  const [copied, setCopied] = useState(false);
  const inviteLink = `https://algo360fx.com/invite/mining-team/${teamName.toLowerCase().replace(/\s/g, '-')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite Team Members</DialogTitle>
      <DialogContent>
        <Typography variant="body2" paragraph>
          Share this link with others to invite them to your mining team. They will need to create an account if they don't already have one.
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          value={inviteLink}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={handleCopy} edge="end">
                {copied ? <CheckCircle color="success" /> : <ContentCopy />}
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Or invite via email
        </Typography>
        
        <TextField
          fullWidth
          label="Email Addresses"
          placeholder="Enter email addresses separated by commas"
          variant="outlined"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Custom Message (Optional)"
          placeholder="Add a personal message to your invitation"
          variant="outlined"
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button startIcon={<EmailOutlined />} color="primary" variant="outlined">
          Send Email Invites
        </Button>
        <Button startIcon={<Share />} color="primary" variant="contained">
          Share Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface Props {
  store: any;
}

const TeamManagement: React.FC<Props> = ({ store }) => {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleAddMember = (member: any) => {
    // In a real app, this would call an API
    console.log('Adding member:', member);
    setNotification({
      open: true,
      message: `Invitation sent to ${member.name} (${member.email})`,
      severity: 'success'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Team Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => setInviteDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            Invite Members
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setAddMemberDialogOpen(true)}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Team Overview */}
        <Grid item xs={12} md={4}>
          <TeamCard>
            <CardHeader title="Team Overview" />
            <Divider />
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    margin: '0 auto',
                    mb: 2,
                    fontSize: 32
                  }}
                >
                  {store.teamStats.teamName.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {store.teamStats.teamName}
                </Typography>
                <Chip 
                  icon={<EmojiEvents />} 
                  label={`Rank #${store.teamStats.teamRank}`} 
                  color="primary" 
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Team Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Members
                      </Typography>
                      <Typography variant="h6">
                        {store.teamStats.members.length}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Hashrate
                      </Typography>
                      <Typography variant="h6">
                        {store.teamStats.totalHashrate} MH/s
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Team Settings
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding sx={{ pt: 1, pb: 1 }}>
                    <ListItemText
                      primary="Public Team Profile"
                      secondary="Allow others to view team stats"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                  <ListItem disablePadding sx={{ pt: 1, pb: 1 }}>
                    <ListItemText
                      primary="Automatic Payouts"
                      secondary="Distribute earnings automatically"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                  <ListItem disablePadding sx={{ pt: 1, pb: 1 }}>
                    <ListItemText
                      primary="Notifications"
                      secondary="Team updates and alerts"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </TeamCard>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Team Members" 
              action={
                <IconButton>
                  <MoreVert />
                </IconButton>
              }
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Contribution</TableCell>
                    <TableCell>Profit Share</TableCell>
                    <TableCell>Earnings</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {store.teamStats.members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 1 }}>
                            {member.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {member.name}
                            {member.id === 'user-001' && (
                              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                (You)
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          color={member.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Speed fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                          {member.contribution} MH/s
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {member.share}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={member.share}
                          sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                        />
                      </TableCell>
                      <TableCell>${member.earnings.toFixed(2)}/day</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Member">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {member.id !== 'user-001' && (
                          <Tooltip title="Remove Member">
                            <IconButton size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Team Performance" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Daily Mining Performance
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Hashrate</TableCell>
                          <TableCell align="right">{store.teamStats.totalHashrate} MH/s</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Daily Earnings</TableCell>
                          <TableCell align="right">${store.teamStats.members.reduce((sum: number, m: any) => sum + m.earnings, 0).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Uptime</TableCell>
                          <TableCell align="right">99.2%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Efficiency</TableCell>
                          <TableCell align="right">0.031 $/W</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    Leaderboard Ranking
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Your team is ranked #345 out of 5,782 mining teams. You need 230 more MH/s to reach the top 300.
                  </Alert>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Rank</TableCell>
                          <TableCell>Team Name</TableCell>
                          <TableCell>Hashrate</TableCell>
                          <TableCell>Members</TableCell>
                          <TableCell>Efficiency</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {store.teamStats.leaderboard.top10.map((team: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LeaderboardAvatar position={team.rank}>
                                  {team.rank}
                                </LeaderboardAvatar>
                              </Box>
                            </TableCell>
                            <TableCell>{team.name}</TableCell>
                            <TableCell>{team.hashrate} MH/s</TableCell>
                            <TableCell>12+</TableCell>
                            <TableCell>High</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell>
                            <LeaderboardAvatar position={4}>
                              {store.teamStats.teamRank}
                            </LeaderboardAvatar>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {store.teamStats.teamName}
                            </Typography>
                          </TableCell>
                          <TableCell>{store.teamStats.totalHashrate} MH/s</TableCell>
                          <TableCell>{store.teamStats.members.length}</TableCell>
                          <TableCell>Medium</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Communication */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Team Chat" 
              action={
                <Button
                  startIcon={<Message />}
                  size="small"
                >
                  New Message
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Message sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Team Chat
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Communicate with your team members in real-time
                </Typography>
                <Button variant="outlined">
                  Open Chat
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Resources */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Team Resources" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <List>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BarChart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Team Performance Dashboard"
                    secondary="View detailed analytics for your team"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <CompareArrows />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Profit Distribution Settings"
                    secondary="Configure how mining rewards are distributed"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Group />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Team Profile Settings"
                    secondary="Customize your team's public profile"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Settings />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Advanced Team Configuration"
                    secondary="Configure advanced settings for your team"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <AddMemberDialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
        onAdd={handleAddMember}
      />

      <InviteDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        teamName={store.teamStats.teamName}
      />

      {/* Notification */}
      <Alert
        severity={notification.severity as any}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: notification.open ? 'flex' : 'none',
          boxShadow: 3
        }}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default withMiningObserver(TeamManagement);
