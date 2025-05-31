import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import { 
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as RunningIcon
} from '@mui/icons-material';

const DashboardTradingAgentTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const handleStart = () => setStatus('running');
  const handlePause = () => setStatus('paused');
  const handleStop = () => setStatus('idle');

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Trading Agent Quick Access
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Agent Status: 
                <Chip 
                  label={status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Idle'} 
                  color={status === 'running' ? 'success' : status === 'paused' ? 'warning' : 'default'}
                  variant="outlined" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<StartIcon />}
                  onClick={handleStart}
                  disabled={status === 'running'}
                >
                  Start
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<PauseIcon />}
                  onClick={handlePause}
                  disabled={status !== 'running'}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleStop}
                  disabled={status === 'idle'}
                >
                  Stop
                </Button>
              </Stack>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Trading Performance
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 45%', minWidth: '120px' }}>
                  <Typography variant="caption" color="text.secondary">Win Rate</Typography>
                  <Typography variant="h6" color="success.main">68%</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 45%', minWidth: '120px' }}>
                  <Typography variant="caption" color="text.secondary">Net P&L</Typography>
                  <Typography variant="h6" color="success.main">$287.25</Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {status === 'idle' && "Agent is currently idle. Press Start to begin automated trading."}
            {status === 'running' && "Agent is actively monitoring markets and executing trades based on your strategy."}
            {status === 'paused' && "Agent is paused. Current positions are maintained but no new trades will be opened."}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardTradingAgentTest;
