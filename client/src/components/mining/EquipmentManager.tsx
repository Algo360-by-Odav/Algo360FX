import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  Stack
} from '@mui/material';
import {
  Computer,
  PowerSettingsNew,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  Warning,
  Error,
  CheckCircle,
  Settings,
  MoreVert,
  Bolt,
  Thermostat,
  Speed,
  AccessTime,
  CurrencyBitcoin
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import withMiningObserver from './withMiningObserver';

// Styled components
const StatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status'
})<{ status: 'active' | 'offline' | 'starting' | 'stopping' | 'restarting' }>(({ theme, status }) => {
  const colors = {
    active: theme.palette.success.main,
    offline: theme.palette.error.main,
    starting: theme.palette.info.main,
    stopping: theme.palette.warning.main,
    restarting: theme.palette.info.main
  };
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '16px',
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: `${colors[status]}20`,
    color: colors[status],
    '& .MuiSvgIcon-root': {
      fontSize: '0.875rem',
      marginRight: theme.spacing(0.5)
    }
  };
});

interface EquipmentDetailProps {
  equipment: any;
  onClose: () => void;
  onSave: (equipment: any) => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment, onClose, onSave }) => {
  const [editedEquipment, setEditedEquipment] = useState({ ...equipment });

  const handleChange = (field: string, value: any) => {
    setEditedEquipment({
      ...editedEquipment,
      [field]: value
    });
  };

  const handleSave = () => {
    onSave(editedEquipment);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Computer sx={{ mr: 1 }} />
          {equipment ? 'Edit Mining Equipment' : 'Add New Mining Equipment'}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Equipment Name"
              value={editedEquipment.name}
              onChange={(e) => handleChange('name', e.target.value)}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Equipment Type</InputLabel>
              <Select
                value={editedEquipment.type}
                onChange={(e) => handleChange('type', e.target.value)}
                label="Equipment Type"
              >
                <MenuItem value="GPU">GPU Miner</MenuItem>
                <MenuItem value="ASIC">ASIC Miner</MenuItem>
                <MenuItem value="CPU">CPU Miner</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Location"
              value={editedEquipment.location}
              onChange={(e) => handleChange('location', e.target.value)}
              margin="normal"
            />

            {editedEquipment.type === 'GPU' && (
              <TextField
                fullWidth
                label="GPU Model"
                value={editedEquipment.gpu}
                onChange={(e) => handleChange('gpu', e.target.value)}
                margin="normal"
              />
            )}

            {editedEquipment.type === 'ASIC' && (
              <TextField
                fullWidth
                label="ASIC Model"
                value={editedEquipment.model}
                onChange={(e) => handleChange('model', e.target.value)}
                margin="normal"
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hashrate (MH/s)"
              type="number"
              value={editedEquipment.hashrate}
              onChange={(e) => handleChange('hashrate', parseFloat(e.target.value))}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Power Usage (W)"
              type="number"
              value={editedEquipment.powerUsage}
              onChange={(e) => handleChange('powerUsage', parseFloat(e.target.value))}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={editedEquipment.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Supported Coins
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {['BTC', 'ETH', 'RVN', 'ERGO', 'ETC'].map((coin) => (
                <Chip
                  key={coin}
                  label={coin}
                  color={editedEquipment.coins.includes(coin) ? 'primary' : 'default'}
                  onClick={() => {
                    const coins = editedEquipment.coins.includes(coin)
                      ? editedEquipment.coins.filter((c: string) => c !== coin)
                      : [...editedEquipment.coins, coin];
                    handleChange('coins', coins);
                  }}
                />
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Maintenance Information
            </Typography>
            <TextField
              fullWidth
              label="Last Maintenance Date"
              type="date"
              value={editedEquipment.lastMaintenance}
              onChange={(e) => handleChange('lastMaintenance', e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface Props {
  store: any; // Using any for now, should be properly typed
}

const EquipmentManager: React.FC<Props> = ({ store }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleOpenDialog = (equipment: any = null) => {
    setSelectedEquipment(equipment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveEquipment = (equipment: any) => {
    if (equipment.id) {
      store.updateMiningEquipment(equipment.id, equipment);
      setNotification({
        open: true,
        message: 'Equipment updated successfully',
        severity: 'success'
      });
    } else {
      // Logic for adding new equipment would go here
      setNotification({
        open: true,
        message: 'New equipment added successfully',
        severity: 'success'
      });
    }
  };

  const handleStartMining = (equipmentId: string) => {
    store.startMining(equipmentId);
    setNotification({
      open: true,
      message: 'Mining started successfully',
      severity: 'success'
    });
  };

  const handleStopMining = (equipmentId: string) => {
    store.stopMining(equipmentId);
    setNotification({
      open: true,
      message: 'Mining stopped successfully',
      severity: 'success'
    });
  };

  const handleRestartMining = (equipmentId: string) => {
    store.restartMiningRig(equipmentId);
    setNotification({
      open: true,
      message: 'Restarting mining equipment...',
      severity: 'info'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle fontSize="small" />;
      case 'offline':
        return <PowerSettingsNew fontSize="small" />;
      case 'starting':
        return <Refresh fontSize="small" />;
      case 'stopping':
        return <Warning fontSize="small" />;
      case 'restarting':
        return <Refresh fontSize="small" />;
      default:
        return <CheckCircle fontSize="small" />;
    }
  };

  const getAlertCount = () => {
    return store.miningEquipment.reduce(
      (count: number, equipment: any) => count + equipment.alerts.length,
      0
    );
  };

  const filteredEquipment = store.miningEquipment.filter((equipment: any) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'alerts' && equipment.alerts.length > 0) return true;
    return equipment.status === filterStatus;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Equipment Manager
          {getAlertCount() > 0 && (
            <Chip
              color="warning"
              size="small"
              label={`${getAlertCount()} Alerts`}
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            sx={{ mr: 2 }}
            onClick={() => store.fetchMiningStats()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Equipment
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Filter Equipment
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label="All Equipment"
            color={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('all')}
          />
          <Chip
            label="Active"
            color={filterStatus === 'active' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('active')}
          />
          <Chip
            label="Offline"
            color={filterStatus === 'offline' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('offline')}
          />
          <Chip
            label="With Alerts"
            color={filterStatus === 'alerts' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('alerts')}
          />
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hashrate</TableCell>
              <TableCell>Power</TableCell>
              <TableCell>Temperature</TableCell>
              <TableCell>Coins</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEquipment.map((equipment: any) => (
              <TableRow
                key={equipment.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: equipment.alerts.length > 0 ? 'rgba(255, 152, 0, 0.05)' : 'inherit'
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {equipment.name}
                    </Typography>
                    {equipment.alerts.length > 0 && (
                      <Tooltip title={equipment.alerts[0].message}>
                        <Warning color="warning" sx={{ ml: 1 }} />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {equipment.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  {equipment.type}
                  <Typography variant="body2" color="text.secondary">
                    {equipment.type === 'GPU' ? equipment.gpu : equipment.model}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusIndicator status={equipment.status as any}>
                    {getStatusIcon(equipment.status)}
                    {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                  </StatusIndicator>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Speed fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {equipment.hashrate.toFixed(1)} MH/s
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bolt fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                    {equipment.powerUsage.toFixed(0)} W
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Thermostat fontSize="small" sx={{ mr: 1, color: equipment.temperature > 70 ? 'error.main' : 'success.main' }} />
                    {equipment.temperature}°C
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {equipment.coins.map((coin: string) => (
                      <Tooltip key={coin} title={coin}>
                        <Chip
                          size="small"
                          label={coin}
                          sx={{ minWidth: 'unset', height: 24 }}
                        />
                      </Tooltip>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {equipment.status === 'active' && (
                    <Tooltip title="Stop Mining">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleStopMining(equipment.id)}
                      >
                        <PowerSettingsNew />
                      </IconButton>
                    </Tooltip>
                  )}
                  {equipment.status === 'offline' && (
                    <Tooltip title="Start Mining">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleStartMining(equipment.id)}
                      >
                        <PowerSettingsNew />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Restart">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRestartMining(equipment.id)}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(equipment)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Equipment Detail Dialog */}
      {dialogOpen && (
        <EquipmentDetail
          equipment={selectedEquipment}
          onClose={handleCloseDialog}
          onSave={handleSaveEquipment}
        />
      )}

      {/* Notifications */}
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

export default withMiningObserver(EquipmentManager);
