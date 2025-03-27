import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface ComplianceReport {
  type: string;
  date: string;
  status: 'Completed' | 'Pending' | 'In Progress';
  issues: number;
}

interface ComplianceRequirement {
  name: string;
  dueDate: string;
  progress: number;
}

interface ComplianceAlert {
  type: 'error' | 'warning' | 'info';
  message: string;
  time: string;
}

export const Compliance: React.FC = observer(() => {
  const reports: ComplianceReport[] = [
    {
      type: 'KYC Verification',
      date: '2024-03-25',
      status: 'Completed',
      issues: 0,
    },
    {
      type: 'AML Screening',
      date: '2024-03-24',
      status: 'In Progress',
      issues: 2,
    },
    {
      type: 'Risk Assessment',
      date: '2024-03-23',
      status: 'Pending',
      issues: 1,
    },
  ];

  const requirements: ComplianceRequirement[] = [
    {
      name: 'Annual Compliance Review',
      dueDate: '2024-04-15',
      progress: 75,
    },
    {
      name: 'Staff Training',
      dueDate: '2024-05-01',
      progress: 45,
    },
    {
      name: 'Policy Update',
      dueDate: '2024-04-30',
      progress: 90,
    },
  ];

  const alerts: ComplianceAlert[] = [
    {
      type: 'error',
      message: 'Missing KYC documentation for 3 clients',
      time: '2 hours ago',
    },
    {
      type: 'warning',
      message: 'AML screening pending for new accounts',
      time: '4 hours ago',
    },
    {
      type: 'info',
      message: 'New compliance policy update available',
      time: '1 day ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Compliance Alerts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Compliance Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type}
              icon={
                alert.type === 'warning' ? (
                  <WarningIcon />
                ) : alert.type === 'info' ? (
                  <InfoIcon />
                ) : undefined
              }
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{alert.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.time}
                </Typography>
              </Box>
            </Alert>
          ))}
        </Box>
      </Box>

      {/* Compliance Reports */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Reports
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Issues</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.type}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {report.issues > 0 ? (
                      <Chip
                        label={report.issues}
                        color="error"
                        size="small"
                      />
                    ) : (
                      report.issues
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Compliance Requirements */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Requirements
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Requirement</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requirements.map((req) => (
                <TableRow key={req.name}>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.dueDate}</TableCell>
                  <TableCell sx={{ width: '40%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={req.progress}
                          color={getProgressColor(req.progress)}
                        />
                      </Box>
                      <Typography variant="body2">{req.progress}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
});

export default Compliance;
