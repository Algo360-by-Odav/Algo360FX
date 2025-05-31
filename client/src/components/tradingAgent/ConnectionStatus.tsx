import React from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as ConnectedIcon,
  Error as DisconnectedIcon,
  Sync as ConnectingIcon
} from '@mui/icons-material';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const [open, setOpen] = React.useState(false);
  const [connectionType, setConnectionType] = React.useState('metaapi');
  
  const getStatusDetails = () => {
    switch (status) {
      case 'connected':
        return {
          label: 'Connected to MT5',
          icon: <ConnectedIcon />,
          color: 'success' as const
        };
      case 'connecting':
        return {
          label: 'Connecting to MT5...',
          icon: <ConnectingIcon />,
          color: 'warning' as const
        };
      default:
        return {
          label: 'Disconnected',
          icon: <DisconnectedIcon />,
          color: 'error' as const
        };
    }
  };

  const statusDetails = getStatusDetails();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Chip
          icon={status === 'connecting' ? 
            <CircularProgress size={16} color="inherit" /> : 
            statusDetails.icon
          }
          label={statusDetails.label}
          color={statusDetails.color}
          variant="outlined"
          size="medium"
        />
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleOpen}
          disabled={status === 'connecting'}
        >
          {status === 'connected' ? 'Reconnect' : 'Connect'}
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Connect to MT5</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Connection Type</InputLabel>
              <Select
                value={connectionType}
                label="Connection Type"
                onChange={(e) => setConnectionType(e.target.value)}
              >
                <MenuItem value="metaapi">MetaAPI</MenuItem>
                <MenuItem value="bridge">MT5 Bridge</MenuItem>
                <MenuItem value="direct">Direct Connection</MenuItem>
              </Select>
            </FormControl>

            {connectionType === 'metaapi' && (
              <>
                <TextField
                  margin="normal"
                  label="MetaAPI Token"
                  type="password"
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Account ID"
                  fullWidth
                />
              </>
            )}

            {connectionType === 'bridge' && (
              <>
                <TextField
                  margin="normal"
                  label="Bridge API URL"
                  fullWidth
                  defaultValue="http://localhost:5000"
                />
                <TextField
                  margin="normal"
                  label="API Key"
                  type="password"
                  fullWidth
                />
              </>
            )}

            {connectionType === 'direct' && (
              <>
                <TextField
                  margin="normal"
                  label="MT5 Server"
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Login"
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Password"
                  type="password"
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleClose}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectionStatus;
