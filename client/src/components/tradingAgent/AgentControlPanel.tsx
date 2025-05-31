import React from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as RunningIcon,
  PauseCircle as PausedIcon,
  Cancel as IdleIcon
} from '@mui/icons-material';

interface AgentControlPanelProps {
  status: 'idle' | 'running' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const AgentControlPanel: React.FC<AgentControlPanelProps> = ({
  status,
  onStart,
  onPause,
  onStop
}) => {
  // Get status chip color and icon
  const getStatusDetails = () => {
    switch (status) {
      case 'running':
        return {
          color: 'success',
          label: 'Running',
          icon: <RunningIcon />
        };
      case 'paused':
        return {
          color: 'warning',
          label: 'Paused',
          icon: <PausedIcon />
        };
      default:
        return {
          color: 'default',
          label: 'Idle',
          icon: <IdleIcon />
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1">Status:</Typography>
        <Chip
          icon={statusDetails.icon}
          label={statusDetails.label}
          color={statusDetails.color as any}
          variant="outlined"
          size="medium"
        />
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center">
        <Tooltip title="Start Trading Agent">
          <Button
            variant="contained"
            color="success"
            startIcon={<StartIcon />}
            onClick={onStart}
            disabled={status === 'running'}
            fullWidth
          >
            Start
          </Button>
        </Tooltip>

        <Tooltip title="Pause Trading Agent">
          <Button
            variant="contained"
            color="warning"
            startIcon={<PauseIcon />}
            onClick={onPause}
            disabled={status !== 'running'}
            fullWidth
          >
            Pause
          </Button>
        </Tooltip>

        <Tooltip title="Stop Trading Agent">
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={onStop}
            disabled={status === 'idle'}
            fullWidth
          >
            Stop
          </Button>
        </Tooltip>
      </Stack>

      <Box mt={2} p={1} bgcolor="rgba(0,0,0,0.03)" borderRadius={1}>
        <Typography variant="caption" color="text.secondary">
          {status === 'idle' && "Agent is currently idle. Press Start to begin automated trading."}
          {status === 'running' && "Agent is actively monitoring markets and executing trades based on your strategy."}
          {status === 'paused' && "Agent is paused. Current positions are maintained but no new trades will be opened."}
        </Typography>
      </Box>
    </Box>
  );
};

export default AgentControlPanel;
