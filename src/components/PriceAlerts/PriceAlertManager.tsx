import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { offlineStorage } from '../../services/OfflineStorage';
import { useOfflineCapability } from '../../hooks/useOfflineCapability';

export function PriceAlertManager() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'above',
    price: '',
  });
  const { isOnline } = useOfflineCapability();
  const theme = useTheme();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const savedAlerts = await offlineStorage.getPriceAlerts();
    setAlerts(savedAlerts);
  };

  const handleCreateAlert = async () => {
    await offlineStorage.createPriceAlert({
      symbol: newAlert.symbol,
      condition: newAlert.condition as 'above' | 'below',
      price: Number(newAlert.price),
    });
    setOpenDialog(false);
    setNewAlert({ symbol: '', condition: 'above', price: '' });
    loadAlerts();
  };

  const handleDeleteAlert = async (id: string) => {
    await offlineStorage.updatePriceAlert(id, { status: 'deleted' });
    loadAlerts();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Price Alerts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Alert
        </Button>
      </Box>

      {!isOnline && (
        <Chip
          label="Offline Mode - Alerts will be synced when online"
          color="warning"
          size="small"
          sx={{ mb: 2 }}
        />
      )}

      <List>
        {alerts
          .filter((alert) => alert.status === 'active')
          .map((alert) => (
            <ListItem
              key={alert.id}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    {alert.symbol} {alert.condition} {alert.price}
                  </Typography>
                }
                secondary={new Date(alert.createdAt).toLocaleString()}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Price Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Symbol"
              value={newAlert.symbol}
              onChange={(e) =>
                setNewAlert({ ...newAlert, symbol: e.target.value })
              }
            />
            <FormControl>
              <InputLabel>Condition</InputLabel>
              <Select
                value={newAlert.condition}
                label="Condition"
                onChange={(e) =>
                  setNewAlert({ ...newAlert, condition: e.target.value })
                }
              >
                <MenuItem value="above">Above</MenuItem>
                <MenuItem value="below">Below</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Price"
              type="number"
              value={newAlert.price}
              onChange={(e) =>
                setNewAlert({ ...newAlert, price: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAlert}
            variant="contained"
            disabled={!newAlert.symbol || !newAlert.price}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
