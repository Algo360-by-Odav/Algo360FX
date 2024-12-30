import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useAuthStore } from '../../../stores/AuthStore';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose,
}) => {
  const authStore = useAuthStore();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    try {
      // Implement account deletion logic
      console.log('Deleting account...');
      onClose();
    } catch (error) {
      setError('Failed to delete account. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Please type <strong>DELETE</strong> to confirm that you want to permanently delete your account:
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={confirmation !== 'DELETE'}
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
