import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  enabled: boolean;
}

interface ValidationResult {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location: string;
  value: any;
  expected: any;
}

interface ReportValidation {
  id: string;
  reportId: string;
  reportName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results: ValidationResult[];
  timestamp: Date;
}

const ReportValidation: React.FC = () => {
  const { validationStore } = useStore();
  const [validations, setValidations] = React.useState<ReportValidation[]>([]);
  const [rules, setRules] = React.useState<ValidationRule[]>([]);
  const [selectedValidation, setSelectedValidation] = React.useState<ReportValidation | null>(
    null
  );
  const [openRulesDialog, setOpenRulesDialog] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loadedValidations, loadedRules] = await Promise.all([
      validationStore.getValidations(),
      validationStore.getValidationRules(),
    ]);
    setValidations(loadedValidations);
    setRules(loadedRules);
  };

  const handleValidate = async (reportId: string) => {
    setIsValidating(true);
    try {
      await validationStore.validateReport(reportId);
      await loadData();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpdateRule = async (ruleId: string, enabled: boolean) => {
    await validationStore.updateValidationRule(ruleId, { enabled });
    await loadData();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return null;
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
            <Typography variant="h6">Report Validation</Typography>
            <Button
              variant="contained"
              onClick={() => setOpenRulesDialog(true)}
            >
              Manage Rules
            </Button>
          </Box>
        </Grid>

        {/* Validation List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Issues</TableCell>
                    <TableCell>Last Validated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validations.map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>{validation.reportName}</TableCell>
                      <TableCell>
                        <Chip
                          label={validation.status}
                          color={
                            validation.status === 'completed'
                              ? 'success'
                              : validation.status === 'failed'
                              ? 'error'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {validation.results.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {validation.results.some(
                              (r) => r.severity === 'error'
                            ) && (
                              <Chip
                                icon={<ErrorIcon />}
                                label={
                                  validation.results.filter(
                                    (r) => r.severity === 'error'
                                  ).length
                                }
                                color="error"
                                size="small"
                              />
                            )}
                            {validation.results.some(
                              (r) => r.severity === 'warning'
                            ) && (
                              <Chip
                                icon={<WarningIcon />}
                                label={
                                  validation.results.filter(
                                    (r) => r.severity === 'warning'
                                  ).length
                                }
                                color="warning"
                                size="small"
                              />
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(validation.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => setSelectedValidation(validation)}
                        >
                          View Results
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleValidate(validation.reportId)}
                          disabled={isValidating}
                        >
                          {isValidating ? (
                            <CircularProgress size={24} />
                          ) : (
                            <RefreshIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Validation Results */}
        {selectedValidation && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Validation Results
              </Typography>
              <List>
                {selectedValidation.results.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getSeverityIcon(result.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={result.message}
                      secondary={
                        <>
                          Location: {result.location}
                          <br />
                          Value: {JSON.stringify(result.value)}
                          {result.expected && (
                            <>
                              <br />
                              Expected: {JSON.stringify(result.expected)}
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Rules Dialog */}
      <Dialog
        open={openRulesDialog}
        onClose={() => setOpenRulesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Validation Rules</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getSeverityIcon(rule.severity)}
                        label={rule.severity}
                        color={
                          rule.severity === 'error'
                            ? 'error'
                            : rule.severity === 'warning'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{rule.category}</TableCell>
                    <TableCell>
                      <Button
                        variant={rule.enabled ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() =>
                          handleUpdateRule(rule.id, !rule.enabled)
                        }
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRulesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportValidation;
