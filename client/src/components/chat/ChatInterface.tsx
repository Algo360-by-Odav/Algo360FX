import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Help as HelpIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';

const ChatInterface = observer(() => {
  // Get stores
  const { chatStore } = useStores();
  
  // State
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions] = useState([
    "What's the best trading strategy?",
    "Show me signal providers",
    "How do I connect MT5?",
    "Explain risk management",
    "Latest market news"
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition if available
      if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSendMessage(transcript);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Check if it's a command
    if (text.startsWith('/') || text.startsWith('!')) {
      const isCommand = await chatStore.handleCommand(text);
      if (isCommand) {
        setInput('');
        return;
      }
    }
    
    setIsProcessing(true);
    setInput('');
    
    try {
      // Send message to API via store
      await chatStore.sendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage(suggestion);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '80vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Messages area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {chatStore.messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {message.role === 'assistant' && (
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  mr: 1,
                }}
              >
                <SmartToyIcon fontSize="small" />
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                color: message.role === 'user' ? 'white' : 'text.primary',
                borderRadius: 2,
                borderTopRightRadius: message.role === 'user' ? 0 : 2,
                borderTopLeftRadius: message.role === 'assistant' ? 0 : 2,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
            {message.role === 'user' && (
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 32,
                  height: 32,
                  ml: 1,
                }}
              >
                U
              </Avatar>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Suggestions */}
      <Box
        sx={{
          p: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Chip
            key={index}
            label={suggestion}
            size="small"
            onClick={() => handleSuggestionClick(suggestion)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>
      
      {/* Input area */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isProcessing}
            size="small"
            sx={{ bgcolor: 'background.paper' }}
          />
          <IconButton
            color="primary"
            onClick={() => chatStore.handleCommand('/help')}
            sx={{ mr: 1 }}
          >
            <HelpIcon />
          </IconButton>
          <IconButton
            color={isListening ? 'secondary' : 'default'}
            onClick={toggleListening}
            sx={{ mr: 1 }}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          {isProcessing ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              color="primary"
              onClick={() => handleSendMessage()}
              disabled={!input.trim()}
            >
              <SendIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default ChatInterface;
