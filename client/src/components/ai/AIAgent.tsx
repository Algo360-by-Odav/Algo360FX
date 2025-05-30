import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  useTheme,
  Slide,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAgentProps {
  onClose: () => void;
}

const AIAgent: React.FC<AIAgentProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI trading assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const theme = useTheme();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        content: "I'm processing your request. This is a placeholder response.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: { xs: '90vw', sm: 400 },
          height: 500,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Typography variant="h6" component="div">
            AI Assistant
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
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
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  bgcolor: message.isUser
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.grey[50], 0.1),
                  borderRadius: 2,
                  ...(message.isUser
                    ? {
                        borderTopRightRadius: 0,
                      }
                    : {
                        borderTopLeftRadius: 0,
                      }),
                }}
              >
                <Typography variant="body2" color="text.primary">
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSend} disabled={!input.trim()}>
                  <SendIcon />
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>
      </Paper>
    </Slide>
  );
};

export default AIAgent;
