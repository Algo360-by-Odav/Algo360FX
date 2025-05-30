import React from 'react';
import {
  Box,
  Fab,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Send as SendIcon,
  Close as CloseIcon,
  KeyboardArrowDown as MinimizeIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { TransitionProps } from '@mui/material/transitions';
import { assistantService } from '../../services/assistantService';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WELCOME_MESSAGE = `Hello! I'm your Algo360FX assistant. I can help you with:

• Trading features (MT5, HFT, Advanced Trading)
• Portfolio management
• Risk management tools
• Market analysis features
• NFT marketplace
• Educational resources
• Account settings

How can I assist you with our platform today?`;

const FloatingAssistant = observer(() => {
  const { aiAssistantStore, themeStore } = useStores();
  const [message, setMessage] = React.useState('');
  const [showConfig, setShowConfig] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const theme = useTheme();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [aiAssistantStore.messages]);

  React.useEffect(() => {
    if (aiAssistantStore.messages.length === 0) {
      aiAssistantStore.addMessage({
        role: 'assistant',
        content: WELCOME_MESSAGE,
      });
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    aiAssistantStore.addMessage({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await assistantService.getResponse(aiAssistantStore.messages);
      aiAssistantStore.addMessage({
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Error:', error);
      aiAssistantStore.addMessage({
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team at support@algo360fx.com for immediate assistance.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey) {
      aiAssistantStore.setApiKey(apiKey);
      setShowConfig(false);
    }
  };

  const handleClearChat = () => {
    aiAssistantStore.clearMessages();
    aiAssistantStore.addMessage({
      role: 'assistant',
      content: WELCOME_MESSAGE,
    });
  };

  if (!aiAssistantStore.isOpen) {
    return (
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: theme.zIndex.drawer + 2,
          }}
          onClick={aiAssistantStore.toggleOpen}
        >
          <SmartToyIcon />
        </Fab>
      </Zoom>
    );
  }

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: aiAssistantStore.isMinimized ? 16 : 32,
          right: 32,
          width: aiAssistantStore.isMinimized ? 'auto' : 400,
          height: aiAssistantStore.isMinimized ? 'auto' : 600,
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          transition: theme.transitions.create(['width', 'height']),
        }}
      >
        {aiAssistantStore.isMinimized ? (
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
            onClick={aiAssistantStore.toggleMinimize}
          >
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Algo360FX Support</Typography>
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SmartToyIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Algo360FX Support</Typography>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  onClick={handleClearChat}
                  sx={{ color: 'inherit', mr: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setShowConfig(true)}
                  sx={{ color: 'inherit', mr: 1 }}
                >
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={aiAssistantStore.toggleMinimize}
                  sx={{ color: 'inherit', mr: 1 }}
                >
                  <MinimizeIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={aiAssistantStore.toggleOpen}
                  sx={{ color: 'inherit' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {aiAssistantStore.messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    maxWidth: '80%',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                      color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  aiAssistantStore.isConfigured
                    ? "Ask about Algo360FX features..."
                    : "Please configure API key first"
                }
                disabled={!aiAssistantStore.isConfigured || isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSend}
                        disabled={!message.trim() || !aiAssistantStore.isConfigured || isLoading}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog
        open={showConfig}
        onClose={() => setShowConfig(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Configure OpenAI API Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
            Enter your OpenAI API key to enable the Algo360FX support assistant. You can get an API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI's website
            </a>
            .
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="API Key"
            type="password"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfig(false)}>Cancel</Button>
          <Button onClick={handleSaveApiKey} variant="contained" disabled={!apiKey}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default FloatingAssistant;
