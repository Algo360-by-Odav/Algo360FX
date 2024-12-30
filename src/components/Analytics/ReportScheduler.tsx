import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useStore } from '../../hooks/useStore';

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  recipients: string[];
  format: string;
  lastRun: Date | null;
  nextRun: Date;
  status: string;
}

const ReportScheduler: React.FC = () => {
  const { reportStore } = useStore();
  const [schedules, setSchedules] = React.useState<ScheduledReport[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<ScheduledReport | null>(
    null
  );

  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    frequency: '',
    recipients: '',
    format: 'PDF',
    includeCharts: true,
    includeTables: true,
    includeAnalysis: true,
  });

  React.useEffect(() => {
    const loadSchedules = async () => {
      const schedules = await reportStore.getScheduledReports();
      setSchedules(schedules);
    };
    loadSchedules();
  }, [reportStore]);

  const handleOpenDialog = (schedule?: ScheduledReport) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        name: schedule.name,
        type: schedule.type,
        frequency: schedule.frequency,
        recipients: schedule.recipients.join(', '),
        format: 'PDF',
        includeCharts: true,
        includeTables: true,
        includeAnalysis: true,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        name: '',
        type: '',
        frequency: '',
        recipients: '',
        format: 'PDF',
        includeCharts: true,
        includeTables: true,
        includeAnalysis: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleSaveSchedule = async () => {
    const recipients = formData.recipients
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email);

    const scheduleData = {
      ...formData,
      recipients,
      id: editingSchedule?.id || undefined,
    };

    if (editingSchedule) {
      await reportStore.updateScheduledReport(scheduleData);
    } else {
      await reportStore.createScheduledReport(scheduleData);
    }

    const updatedSchedules = await reportStore.getScheduledReports();
    setSchedules(updatedSchedules);
    handleCloseDialog();
  };

  const handleDeleteSchedule = async (id: string) => {
    await reportStore.deleteScheduledReport(id);
    const updatedSchedules = await reportStore.getScheduledReports();
    setSchedules(updatedSchedules);
  };

  const handleRunNow = async (id: string) => {
    await reportStore.runScheduledReport(id);
    const updatedSchedules = await reportStore.getScheduledReports();
    setSchedules(updatedSchedules);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Report Scheduler</Typography>
            <Button
              variant="contained"
              onClick={() => handleOpenDialog()}
            >
              Schedule New Report
            </Button>
          </Box>
        </Grid>

        {/* Scheduled Reports Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Recipients</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.name}</TableCell>
                      <TableCell>{schedule.type}</TableCell>
                      <TableCell>{schedule.frequency}</TableCell>
                      <TableCell>
                        {schedule.recipients.join(', ')}
                      </TableCell>
                      <TableCell>
                        {schedule.lastRun
                          ? new Date(schedule.lastRun).toLocaleString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {new Date(schedule.nextRun).toLocaleString()}
                      </TableCell>
                      <TableCell>{schedule.status}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenDialog(schedule)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          size="small"
                          onClick={() => handleRunNow(schedule.id)}
                        >
                          Run Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Schedule Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Report Schedule' : 'New Report Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Report Type"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <MenuItem value="Strategy">Strategy Report</MenuItem>
                  <MenuItem value="Risk">Risk Report</MenuItem>
                  <MenuItem value="Trade">Trade Analysis Report</MenuItem>
                  <MenuItem value="Performance">Performance Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipients (comma-separated emails)"
                value={formData.recipients}
                onChange={(e) =>
                  setFormData({ ...formData, recipients: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={formData.format}
                  label="Format"
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                >
                  <MenuItem value="PDF">PDF</MenuItem>
                  <MenuItem value="Excel">Excel</MenuItem>
                  <MenuItem value="HTML">HTML</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeCharts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includeCharts: e.target.checked,
                      })
                    }
                  />
                }
                label="Include Charts"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeTables}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includeTables: e.target.checked,
                      })
                    }
                  />
                }
                label="Include Tables"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeAnalysis}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includeAnalysis: e.target.checked,
                      })
                    }
                  />
                }
                label="Include Analysis"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained">
            {editingSchedule ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportScheduler;
