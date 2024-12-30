import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Comment as CommentIcon,
  History as HistoryIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'validation' | 'approval';
  assignee: string;
  status: 'pending' | 'completed' | 'rejected';
  comments: string[];
}

interface Report {
  id: string;
  name: string;
  type: string;
  status: string;
  currentStep: number;
  workflow: WorkflowStep[];
  history: {
    timestamp: Date;
    action: string;
    user: string;
    comment: string;
  }[];
}

const ReportWorkflow: React.FC = () => {
  const { workflowStore } = useStore();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = React.useState(false);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const loadedReports = await workflowStore.getReports();
    setReports(loadedReports);
  };

  const handleAction = async (
    reportId: string,
    stepId: string,
    action: 'approve' | 'reject'
  ) => {
    try {
      await workflowStore.updateWorkflowStep(reportId, stepId, {
        action,
        comment,
      });
      await loadReports();
      setOpenDialog(false);
      setComment('');
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" />;
      case 'rejected':
        return <CloseIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h6">Report Workflow Management</Typography>
        </Grid>

        {/* Reports List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current Step</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          color={
                            report.status === 'Approved'
                              ? 'success'
                              : report.status === 'Rejected'
                              ? 'error'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {report.workflow[report.currentStep]?.name || 'Completed'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => setSelectedReport(report)}
                        >
                          View Workflow
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedReport(report);
                            setOpenHistoryDialog(true);
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Selected Report Workflow */}
        {selectedReport && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Workflow Steps
              </Typography>
              <Stepper
                activeStep={selectedReport.currentStep}
                alternativeLabel
              >
                {selectedReport.workflow.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel
                      optional={
                        <Typography variant="caption">
                          {step.assignee}
                        </Typography>
                      }
                      icon={getStepIcon(step.status)}
                    >
                      {step.name}
                      {step.status === 'rejected' && (
                        <Typography
                          variant="caption"
                          color="error"
                          display="block"
                        >
                          Rejected
                        </Typography>
                      )}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Current Step Actions */}
              {selectedReport.currentStep < selectedReport.workflow.length && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info">
                    Current Step:{' '}
                    {
                      selectedReport.workflow[selectedReport.currentStep]
                        .name
                    }
                  </Alert>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CommentIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Add Comment
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step Comments */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Comments
                </Typography>
                {selectedReport.workflow[selectedReport.currentStep]?.comments.map(
                  (comment, index) => (
                    <Alert
                      key={index}
                      severity="info"
                      sx={{ mb: 1 }}
                      icon={<CommentIcon />}
                    >
                      {comment}
                    </Alert>
                  )
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Action Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label="Comment"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              handleAction(
                selectedReport!.id,
                selectedReport!.workflow[selectedReport!.currentStep].id,
                'approve'
              )
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Workflow History</DialogTitle>
        <DialogContent>
          <Timeline>
            {selectedReport?.history.map((event, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="text.secondary">
                  {new Date(event.timestamp).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={
                      event.action === 'approved'
                        ? 'success'
                        : event.action === 'rejected'
                        ? 'error'
                        : 'grey'
                    }
                  >
                    {event.action === 'approved' ? (
                      <CheckIcon />
                    ) : event.action === 'rejected' ? (
                      <CloseIcon />
                    ) : (
                      <SendIcon />
                    )}
                  </TimelineDot>
                  {index < selectedReport.history.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle2">
                    {event.action.charAt(0).toUpperCase() +
                      event.action.slice(1)}
                  </Typography>
                  <Typography variant="body2">By: {event.user}</Typography>
                  {event.comment && (
                    <Typography variant="body2" color="text.secondary">
                      Comment: {event.comment}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportWorkflow;
