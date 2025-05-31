import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Telegram as TelegramIcon,
  CheckCircle as ConnectedIcon,
  Cancel as DisconnectedIcon
} from '@mui/icons-material';

interface TelegramIntegrationProps {
  connected: boolean;
  onConnect: (botToken: string, chatId: string) => void;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({
  connected,
  onConnect
}) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    tradeEntry: true,
    tradeExit: true,
    dailySummary: true,
    profitAlerts: true,
    drawdownAlerts: true
  });

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked
    });
  };

  const handleConnect = () => {
    if (!botToken || !chatId) {
      setError('Please enter both Bot Token and Chat ID');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onConnect(botToken, chatId);
    }, 1500);
  };

  // Commands info
  const botCommands = [
    { command: '/startagent', description: 'Start the trading agent' },
    { command: '/pauseagent', description: 'Pause the trading agent' },
    { command: '/stopagent', description: 'Stop the trading agent' },
    { command: '/status', description: 'Get current agent status' },
    { command: '/performance', description: 'Get performance metrics' },
    { command: '/trades', description: 'List open trades' }
  ];

  return (
    <Box>
      {connected ? (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <ConnectedIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Connected to Telegram
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Notification Settings
          </Typography>
          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.tradeEntry}
                  onChange={handleNotificationChange}
                  name="tradeEntry"
                  size="small"
                />
              }
              label="Trade Entry"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.tradeExit}
                  onChange={handleNotificationChange}
                  name="tradeExit"
                  size="small"
                />
              }
              label="Trade Exit"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.dailySummary}
                  onChange={handleNotificationChange}
                  name="dailySummary"
                  size="small"
                />
              }
              label="Daily Summary"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.profitAlerts}
                  onChange={handleNotificationChange}
                  name="profitAlerts"
                  size="small"
                />
              }
              label="Profit Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.drawdownAlerts}
                  onChange={handleNotificationChange}
                  name="drawdownAlerts"
                  size="small"
                />
              }
              label="Drawdown Alerts"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Available Commands
          </Typography>
          <Paper variant="outlined" sx={{ p: 1, maxHeight: 150, overflow: 'auto' }}>
            <Stack spacing={1}>
              {botCommands.map((cmd, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Chip 
                    label={cmd.command} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption">
                    {cmd.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
          
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => {
              // This would disconnect the Telegram bot
              onConnect('', '');
            }}
          >
            Disconnect Telegram
          </Button>
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <DisconnectedIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Not connected to Telegram
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Bot Token"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
            placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
            type="password"
          />
          
          <TextField
            label="Chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
            placeholder="-100123456789"
          />
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TelegramIcon />}
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Telegram Bot'}
          </Button>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="caption" color="text.secondary" paragraph>
              To create a Telegram bot:
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              1. Start a chat with @BotFather on Telegram
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              2. Send /newbot and follow the instructions
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              3. Copy the token provided by BotFather
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              4. Start a chat with your new bot and get your Chat ID
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TelegramIntegration;
