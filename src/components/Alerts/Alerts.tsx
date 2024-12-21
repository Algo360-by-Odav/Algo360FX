import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { alertsService, Alert, AlertType, AlertCondition, AlertPriority, AlertStatus } from '../../services/alerts/AlertsService';
import './Alerts.css';

const Alerts: React.FC = observer(() => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newAlert, setNewAlert] = useState({
    type: AlertType.PRICE,
    symbol: '',
    condition: AlertCondition.GREATER_THAN,
    value: 0,
    message: '',
    priority: AlertPriority.MEDIUM,
  });

  useEffect(() => {
    const unsubscribe = alertsService.subscribe((notification) => {
      setSnackbarMessage(notification.message);
      setShowSnackbar(true);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateAlert = () => {
    alertsService.createAlert(
      newAlert.type,
      newAlert.symbol,
      newAlert.condition,
      newAlert.value,
      newAlert.message,
      newAlert.priority
    );
    setOpenCreateDialog(false);
    setSnackbarMessage('Alert created successfully');
    setShowSnackbar(true);
  };

  const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => (
    <Card className={`alert-card ${alert.status.toLowerCase()} ${alert.priority.toLowerCase()}`}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{alert.symbol}</Typography>
          <Typography variant="caption" color="textSecondary">
            {alert.type}
          </Typography>
        </Box>
        <Typography variant="body2" className="alert-condition">
          {alert.condition} {alert.value}
        </Typography>
        <Typography variant="body1" className="alert-message">
          {alert.message}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="caption" color="textSecondary">
            {alert.createdAt.toLocaleString()}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => alertsService.dismissAlert(alert.id)}
            disabled={alert.status !== AlertStatus.ACTIVE}
          >
            Dismiss
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="alerts-container">
      <Box className="alerts-header">
        <Typography variant="h5">Alerts</Typography>
        <Box>
          <IconButton
            color={alertsService.getNotifications(true).length > 0 ? 'primary' : 'default'}
            onClick={() => setOpenNotifications(true)}
          >
            {alertsService.getNotifications(true).length > 0 ? (
              <NotificationsActiveIcon />
            ) : (
              <NotificationsIcon />
            )}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Alert
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} className="alerts-grid">
        {alertsService.getAlerts().map((alert) => (
          <Grid item xs={12} sm={6} md={4} key={alert.id}>
            <AlertCard alert={alert} />
          </Grid>
        ))}
      </Grid>

      {/* Create Alert Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Alert</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Alert Type</InputLabel>
            <Select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as AlertType })}
            >
              {Object.values(AlertType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Symbol"
            value={newAlert.symbol}
            onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as AlertCondition })}
            >
              {Object.values(AlertCondition).map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Value"
            type="number"
            value={newAlert.value}
            onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Message"
            multiline
            rows={2}
            value={newAlert.message}
            onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newAlert.priority}
              onChange={(e) => setNewAlert({ ...newAlert, priority: e.target.value as AlertPriority })}
            >
              {Object.values(AlertPriority).map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAlert} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          {alertsService.getNotifications().map((notification) => (
            <Card key={notification.id} className={`notification-card ${notification.priority.toLowerCase()}`}>
              <CardContent>
                <Typography variant="body1">{notification.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {notification.timestamp.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => alertsService.clearAllNotifications()}>Clear All</Button>
          <Button onClick={() => setOpenNotifications(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setShowSnackbar(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
});

export default Alerts;
