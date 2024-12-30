import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { RiskAlert } from '../../risk/types';

interface RiskAlertsProps {
  // alerts: RiskAlert[];
  // onDismiss: (index: number) => void;
}

const RiskAlerts: React.FC<RiskAlertsProps> = observer(() => {
  const rootStore = useRootStore();
  const { riskStore } = rootStore;
  const alerts = riskStore.getAlerts();

  const getAlertIcon = (severity: RiskAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <WarningIcon color="warning" sx={{ opacity: 0.7 }} />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getAlertColor = (severity: RiskAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatAlertMessage = (alert: RiskAlert) => {
    const percentChange = ((alert.currentValue - alert.threshold) / alert.threshold * 100).toFixed(2);
    const direction = alert.currentValue > alert.threshold ? 'above' : 'below';
    
    return `${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} is ${direction} threshold by ${percentChange}%`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Risk Alerts</Typography>
        <Chip
          label={`${alerts.length} Active`}
          color={alerts.length > 0 ? 'warning' : 'success'}
          size="small"
        />
      </Box>
      <List>
        {alerts.map((alert, index) => (
          <ListItem
            key={`${alert.type}-${alert.timestamp}`}
            secondaryAction={
              <IconButton edge="end" onClick={() => riskStore.dismissAlert(index)}>
                <ClearIcon />
              </IconButton>
            }
            sx={{
              bgcolor: `${getAlertColor(alert.severity)}.lighter`,
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              {getAlertIcon(alert.severity)}
            </ListItemIcon>
            <ListItemText
              primary={formatAlertMessage(alert)}
              secondary={formatTime(alert.timestamp)}
            />
          </ListItem>
        ))}
        {alerts.length === 0 && (
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="No active risk alerts" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
});

export default RiskAlerts;
