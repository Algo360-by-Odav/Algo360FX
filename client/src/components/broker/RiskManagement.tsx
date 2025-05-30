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
  Card,
  CardContent,
  Switch,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface RiskExposure {
  currencyPair: string;
  exposure: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  maxLimit: number;
}

interface MarginAlert {
  client: string;
  marginLevel: number;
  status: 'warning' | 'success';
  message: string;
}

export const RiskManagement: React.FC = observer(() => {
  const riskExposures: RiskExposure[] = [
    {
      currencyPair: 'EUR/USD',
      exposure: 2500000,
      riskLevel: 'Medium',
      maxLimit: 5000000,
    },
    {
      currencyPair: 'GBP/USD',
      exposure: 1800000,
      riskLevel: 'Low',
      maxLimit: 4000000,
    },
    {
      currencyPair: 'USD/JPY',
      exposure: 3500000,
      riskLevel: 'High',
      maxLimit: 4000000,
    },
  ];

  const marginAlerts: MarginAlert[] = [
    {
      client: 'John Doe',
      marginLevel: 85,
      status: 'warning',
      message: 'Margin level below 100%',
    },
    {
      client: 'Jane Smith',
      marginLevel: 120,
      status: 'success',
      message: 'Margin level healthy',
    },
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Risk Exposure */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Risk Exposure
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Currency Pair</TableCell>
                <TableCell align="right">Current Exposure</TableCell>
                <TableCell align="right">Max Limit</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Auto Stop</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskExposures.map((exposure) => (
                <TableRow key={exposure.currencyPair}>
                  <TableCell>{exposure.currencyPair}</TableCell>
                  <TableCell align="right">
                    ${exposure.exposure.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${exposure.maxLimit.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exposure.riskLevel}
                      color={getRiskLevelColor(exposure.riskLevel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      size="small"
                      defaultChecked={exposure.riskLevel === 'High'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Margin Alerts */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Margin Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {marginAlerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.status}
              icon={alert.status === 'warning' ? <WarningIcon /> : undefined}
            >
              <Typography variant="subtitle2">{alert.client}</Typography>
              <Typography variant="body2">
                Margin Level: {alert.marginLevel}% - {alert.message}
              </Typography>
            </Alert>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default RiskManagement;
