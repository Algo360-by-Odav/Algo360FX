import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType } from 'lightweight-charts';

interface ReportConfig {
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  format: string;
  metrics: string[];
  schedule: {
    frequency: string;
    time: string;
    recipients: string[];
  };
}

interface TradeMetrics {
  strategy: string;
  trades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  netProfit: number;
}

const AdvancedReportingWidget: React.FC = observer(() => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'performance',
    startDate: null,
    endDate: null,
    format: 'pdf',
    metrics: ['winRate', 'profitFactor', 'sharpeRatio'],
    schedule: {
      frequency: 'weekly',
      time: '09:00',
      recipients: ['user@example.com'],
    },
  });

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');

  const tradeMetrics: TradeMetrics[] = [
    {
      strategy: 'Trend Follower',
      trades: 156,
      winRate: 65.4,
      profitFactor: 1.8,
      sharpeRatio: 1.5,
      maxDrawdown: 12.3,
      netProfit: 2500,
    },
    {
      strategy: 'Scalping Bot',
      trades: 452,
      winRate: 58.2,
      profitFactor: 1.5,
      sharpeRatio: 1.2,
      maxDrawdown: 8.7,
      netProfit: 1800,
    },
    {
      strategy: 'Mean Reversion',
      trades: 89,
      winRate: 72.1,
      profitFactor: 2.1,
      sharpeRatio: 1.8,
      maxDrawdown: 15.4,
      netProfit: 3200,
    },
  ];

  const handleConfigChange = (field: string, value: any) => {
    setReportConfig({ ...reportConfig, [field]: value });
  };

  const handleScheduleChange = (field: string, value: any) => {
    setReportConfig({
      ...reportConfig,
      schedule: { ...reportConfig.schedule, [field]: value },
    });
  };

  const handleAddRecipient = () => {
    if (newRecipient && !reportConfig.schedule.recipients.includes(newRecipient)) {
      handleScheduleChange('recipients', [...reportConfig.schedule.recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    handleScheduleChange(
      'recipients',
      reportConfig.schedule.recipients.filter((r) => r !== email)
    );
  };

  const handleGenerateReport = () => {
    // Implement report generation logic
    console.log('Generating report with config:', reportConfig);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Advanced Reporting</Typography>
          <Box>
            <Button
              startIcon={<ScheduleIcon />}
              onClick={() => setScheduleDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Schedule Reports
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Report Configuration */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Report Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={reportConfig.type}
                      label="Report Type"
                      onChange={(e) => handleConfigChange('type', e.target.value)}
                    >
                      <MenuItem value="performance">Performance Report</MenuItem>
                      <MenuItem value="risk">Risk Analysis</MenuItem>
                      <MenuItem value="tax">Tax Documentation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="Start Date"
                    value={reportConfig.startDate}
                    onChange={(date) => handleConfigChange('startDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="End Date"
                    value={reportConfig.endDate}
                    onChange={(date) => handleConfigChange('endDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={reportConfig.format}
                      label="Format"
                      onChange={(e) => handleConfigChange('format', e.target.value)}
                    >
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="excel">Excel</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Performance Summary */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Performance Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Strategy</TableCell>
                      <TableCell align="right">Trades</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                      <TableCell align="right">Profit Factor</TableCell>
                      <TableCell align="right">Sharpe Ratio</TableCell>
                      <TableCell align="right">Max Drawdown</TableCell>
                      <TableCell align="right">Net Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tradeMetrics.map((metric) => (
                      <TableRow key={metric.strategy}>
                        <TableCell>{metric.strategy}</TableCell>
                        <TableCell align="right">{metric.trades}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${metric.winRate}%`}
                            color={metric.winRate > 60 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={metric.profitFactor.toFixed(2)}
                            color={metric.profitFactor > 1.5 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={metric.sharpeRatio.toFixed(2)}
                            color={metric.sharpeRatio > 1.5 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${metric.maxDrawdown}%`}
                            color={metric.maxDrawdown < 15 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`$${metric.netProfit}`}
                            color={metric.netProfit > 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Schedule Reports Dialog */}
        <Dialog
          open={scheduleDialogOpen}
          onClose={() => setScheduleDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule Reports</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={reportConfig.schedule.frequency}
                    label="Frequency"
                    onChange={(e) => handleScheduleChange('frequency', e.target.value)}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={reportConfig.schedule.time}
                  onChange={(e) => handleScheduleChange('time', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    label="Add Recipient"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddRecipient}
                    disabled={!newRecipient}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {reportConfig.schedule.recipients.map((email) => (
                    <Chip
                      key={email}
                      label={email}
                      onDelete={() => handleRemoveRecipient(email)}
                      icon={<EmailIcon />}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => setScheduleDialogOpen(false)}
            >
              Save Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default AdvancedReportingWidget;
