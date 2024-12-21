import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  VpnKey as VpnKeyIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { userStore } from '../../stores/UserStore';

interface CreateKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, permissions: string[]) => Promise<void>;
}

interface NewKeyDialogProps {
  open: boolean;
  onClose: () => void;
  keyData: {
    key: string;
    secret: string;
  } | null;
}

const AVAILABLE_PERMISSIONS = [
  'read:trading',
  'write:trading',
  'read:account',
  'write:account',
  'read:market',
  'write:market',
];

const CreateKeyDialog: React.FC<CreateKeyDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name) {
      setError('Name is required');
      return;
    }
    if (permissions.length === 0) {
      setError('At least one permission is required');
      return;
    }
    try {
      await onCreate(name, permissions);
      onClose();
    } catch (error) {
      setError('Failed to create API key');
    }
  };

  const handlePermissionChange = (permission: string) => {
    setPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New API Key</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Key Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Permissions
        </Typography>
        <FormGroup>
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <FormControlLabel
              key={permission}
              control={
                <Checkbox
                  checked={permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
              }
              label={permission}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NewKeyDialog: React.FC<NewKeyDialogProps> = ({
  open,
  onClose,
  keyData,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>API Key Created</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Make sure to copy your API key and secret now. You won't be able to see
          them again!
        </Alert>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">API Key:</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, fontFamily: 'monospace' }}
            >
              {keyData?.key}
            </Typography>
            <IconButton
              size="small"
              onClick={() => keyData?.key && handleCopy(keyData.key)}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1">API Secret:</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, fontFamily: 'monospace' }}
            >
              {keyData?.secret}
            </Typography>
            <IconButton
              size="small"
              onClick={() => keyData?.secret && handleCopy(keyData.secret)}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          I've Saved My Keys
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ApiKeysSettings: React.FC = observer(() => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{
    key: string;
    secret: string;
  } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    userStore.fetchApiKeys();
  }, []);

  const handleCreateKey = async (name: string, permissions: string[]) => {
    try {
      const newKey = await userStore.createApiKey(name, permissions);
      setNewKeyData(newKey);
      setCreateDialogOpen(false);
      setNewKeyDialogOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to create API key');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      await userStore.deleteApiKey(keyId);
      setSnackbarMessage('API key deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete API key');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
          borderRadius: '16px',
          mb: 3,
        }}
      >
        <VpnKeyIcon sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            API Keys
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your API keys for programmatic access to the platform
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Your API Keys</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Key
          </Button>
        </Box>

        {userStore.loading.apiKeys ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userStore.apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      {new Date(key.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(key.lastUsed).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {key.permissions.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <CreateKeyDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateKey}
      />

      <NewKeyDialog
        open={newKeyDialogOpen}
        onClose={() => setNewKeyDialogOpen(false)}
        keyData={newKeyData}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
});

export default ApiKeysSettings;
