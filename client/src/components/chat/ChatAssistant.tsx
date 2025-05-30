import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fade,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Send,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Close,
  SmartToy,
  Help
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';

export const ChatAssistant = observer(() => {
  // Get stores
  const { chatStore } = useStores();
  
  // State
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions] = useState([
    "What's the best trading strategy?",
    "Show me signal providers",
    "How do I connect MT5?",
    "Explain risk management",
    "Latest market news"
  ]);
  
  // Refs
  const chatOutputRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;
      
      // Initialize speech recognition if available
      if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          handleSendMessage(transcript);
        };
        
        recognitionRef.current.onend = () => {
          chatStore.toggleListening();
        };
        
        recognitionRef.current.onerror = () => {
          chatStore.toggleListening();
        };
      }
    }
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [chatStore]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatOutputRef.current) {
      chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
    }
  }, [chatStore.messages]);
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (chatStore.isListening) {
      recognitionRef.current?.abort();
      chatStore.toggleListening();
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          chatStore.toggleListening();
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
    }
  };
  
  // Toggle speech synthesis
  const toggleSpeaking = () => {
    chatStore.toggleSpeech();
    if (chatStore.isSpeechEnabled) {
      synthRef.current?.cancel();
    }
  };
  
  // Speak text
  const speak = (text: string) => {
    if (synthRef.current && chatStore.isSpeechEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        // Speech ended
      };
      synthRef.current.speak(utterance);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (text: string = inputMessage) => {
    if (!text.trim()) return;
    
    // Check if it's a command
    if (text.startsWith('/') || text.startsWith('!')) {
      const isCommand = await chatStore.handleCommand(text);
      if (isCommand) {
        setInputMessage('');
        return;
      }
    }
    
    setIsProcessing(true);
    setInputMessage('');
    
    try {
      // Send message to API via store
      const response = await chatStore.sendMessage(text);
      
      // Speak the response if speech is enabled
      speak(response);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage(suggestion);
  };
  
  // Toggle chat window
  const toggleChat = () => {
    chatStore.toggleChat();
  };
  
  return (
    <>
      {/* Robot icon to toggle chat */}
      <Box
        id="robot-container"
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 3,
          zIndex: 1000,
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          transform: chatStore.isOpen ? 'scale(1.05)' : 'scale(1)',
          animation: chatStore.isListening ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)'
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)'
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)'
            },
          },
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={toggleChat}
        onDoubleClick={toggleListening}
      >
        <SmartToy sx={{ 
          color: 'white', 
          fontSize: 30,
          animation: chatStore.isSpeechEnabled ? 'bounce 0.5s alternate infinite ease-in' : 'none',
          '@keyframes bounce': {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(-5px)' }
          }
        }} />
      </Box>
      
      {/* Chat window */}
      <Fade in={chatStore.isOpen}>
        <Paper
          id="chat-box"
          sx={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: { xs: '90%', sm: '400px' },
            height: '500px',
            display: chatStore.isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            boxShadow: 3,
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Algo360 Assistant</Typography>
            <Box>
              <IconButton size="small" color="inherit" onClick={toggleSpeaking}>
                {chatStore.isSpeechEnabled ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
              <IconButton size="small" color="inherit" onClick={toggleChat}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          
          {/* Chat messages */}
          <Box
            ref={chatOutputRef}
            id="chat-output"
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: 'background.default',
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
                    <SmartToy fontSize="small" />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    backgroundColor: message.role === 'user' ? 'primary.light' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    borderTopRightRadius: message.role === 'user' ? 0 : 2,
                    borderTopLeftRadius: message.role === 'assistant' ? 0 : 2,
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
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
          </Box>
          
          {/* Suggestions */}
          <Box
            id="suggestions"
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
                className="suggestion-btn"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
          
          {/* Input area */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <TextField
              id="chat-assistant-input"
              fullWidth
              size="small"
              placeholder="Type your message..."
              variant="outlined"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              sx={{ mr: 1 }}
            />
            <IconButton
              color="primary"
              onClick={() => chatStore.handleCommand('/help')}
              sx={{ mr: 1 }}
            >
              <Help />
            </IconButton>
            <IconButton
              color={chatStore.isListening ? 'secondary' : 'default'}
              onClick={toggleListening}
              sx={{ mr: 1 }}
            >
              {chatStore.isListening ? <MicOff /> : <Mic />}
            </IconButton>
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton
                color="primary"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
              >
                <Send />
              </IconButton>
            )}
          </Box>
        </Paper>
      </Fade>
    </>
  );
});

export default ChatAssistant;
