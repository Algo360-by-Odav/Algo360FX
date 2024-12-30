import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface RegulatoryReport {
  id: string;
  type: string;
  period: string;
  status: string;
  submissionDate: Date | null;
  data: any;
}

const RegulatoryReport: React.FC = () => {
  const { reportStore } = useStore();
  const [reports, setReports] = React.useState<RegulatoryReport[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<RegulatoryReport | null>(
    null
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    type: '',
    period: '',
    jurisdiction: '',
    includeDetails: true,
  });

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const loadedReports = await reportStore.getRegulatoryReports();
    setReports(loadedReports);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await reportStore.generateRegulatoryReport(formData);
      await loadReports();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitReport = async (report: RegulatoryReport) => {
    try {
      await reportStore.submitRegulatoryReport(report.id);
      await loadReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExportReport = async (report: RegulatoryReport) => {
    try {
      await reportStore.exportRegulatoryReport(report.id);
    } catch (err) {
      setError(err.message);
    }
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
            <Typography variant="h6">Regulatory Reports</Typography>
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
            >
              Generate New Report
            </Button>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Reports List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>
                        {report.submissionDate
                          ? new Date(report.submissionDate).toLocaleDateString()
                          : 'Not Submitted'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => setSelectedReport(report)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleExportReport(report)}
                        >
                          Export
                        </Button>
                        {report.status === 'Generated' && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleSubmitReport(report)}
                          >
                            Submit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Report Details */}
        {selectedReport && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Report Details
              </Typography>
              <Grid container spacing={2}>
                {/* Capital Requirements */}
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Capital Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                          <TableCell align="right">Requirement</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReport.data.capitalMetrics.map((metric: any) => (
                          <TableRow key={metric.name}>
                            <TableCell>{metric.name}</TableCell>
                            <TableCell align="right">
                              {formatPercentage(metric.value)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(metric.requirement)}
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={
                                  metric.value >= metric.requirement
                                    ? 'success.main'
                                    : 'error.main'
                                }
                              >
                                {metric.value >= metric.requirement
                                  ? 'Compliant'
                                  : 'Non-Compliant'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Risk Exposures */}
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Risk Type</TableCell>
                          <TableCell align="right">Exposure</TableCell>
                          <TableCell align="right">Limit</TableCell>
                          <TableCell align="right">Usage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReport.data.riskExposures.map((exposure: any) => (
                          <TableRow key={exposure.type}>
                            <TableCell>{exposure.type}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(exposure.value)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(exposure.limit)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(exposure.usage)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Compliance Notes */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Compliance Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedReport.data.complianceNotes}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate Regulatory Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Report Type"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <MenuItem value="FINRA">FINRA Report</MenuItem>
                  <MenuItem value="SEC">SEC Report</MenuItem>
                  <MenuItem value="ESMA">ESMA Report</MenuItem>
                  <MenuItem value="MAS">MAS Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reporting Period</InputLabel>
                <Select
                  value={formData.period}
                  label="Reporting Period"
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                >
                  <MenuItem value="Q1">Q1 2024</MenuItem>
                  <MenuItem value="Q2">Q2 2024</MenuItem>
                  <MenuItem value="Q3">Q3 2024</MenuItem>
                  <MenuItem value="Q4">Q4 2024</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Jurisdiction</InputLabel>
                <Select
                  value={formData.jurisdiction}
                  label="Jurisdiction"
                  onChange={(e) =>
                    setFormData({ ...formData, jurisdiction: e.target.value })
                  }
                >
                  <MenuItem value="US">United States</MenuItem>
                  <MenuItem value="EU">European Union</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                  <MenuItem value="SG">Singapore</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <CircularProgress size={24} />
            ) : (
              'Generate Report'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegulatoryReport;
