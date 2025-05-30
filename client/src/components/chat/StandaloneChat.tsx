import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fade,
  Chip,
  Avatar,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Help as HelpIcon,
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import SimpleRobot3D from './SimpleRobot3D';

// Simple chat message type
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Standalone chat component that doesn't rely on MobX or other stores
const StandaloneChat: React.FC = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! How can I help you with Algo360FX today?' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Theme
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [suggestions] = useState([
    "What's the best trading strategy?",
    "Show me signal providers",
    "How do I connect MT5?",
    "Explain risk management",
    "Latest market news"
  ]);
  
  // Refs
  const chatOutputRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  
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
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatOutputRef.current) {
      chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
    }
  }, [messages]);
  
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
  
  // Toggle speech synthesis
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      synthRef.current?.cancel();
    }
  };
  
  // Speak text
  const speak = (text: string) => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        // Speech ended
      };
      synthRef.current.speak(utterance);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = (text: string = inputMessage) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    
    // Simulate API call and response
    setTimeout(() => {
      let response = '';
      
      // Simple pattern matching for demo purposes
      const lowerText = text.toLowerCase();
      if (lowerText.includes('trading strategy') || lowerText.includes('strategy')) {
        response = "For trading strategies, I recommend looking at our Educational Content section where we have detailed guides on trend following, breakout, and mean reversion strategies. Would you like me to show you those resources?";
      } else if (lowerText.includes('signal provider') || lowerText.includes('provider')) {
        response = "We have several top-rated signal providers available. You can view them in the Signal Provider tab. Would you like me to show you the providers with the highest win rates?";
      } else if (lowerText.includes('mt5') || lowerText.includes('metatrader')) {
        response = "To connect your MT5 account, go to the Copy Trading section and click on 'Add New MT5 Account'. You'll need your account number, password, and server details from your broker.";
      } else if (lowerText.includes('risk') || lowerText.includes('management')) {
        response = "Risk management is crucial for trading success. We recommend risking no more than 1-2% of your account per trade. Our Risk Assessment tools can help you analyze your portfolio exposure and optimize position sizing.";
      } else if (lowerText.includes('news') || lowerText.includes('market')) {
        response = "The latest market news shows increased volatility in EUR/USD due to recent central bank announcements. Our Economic Calendar highlights important events coming up this week that might impact your trading.";
      } else if (lowerText.includes('help') || lowerText.startsWith('/help')) {
        response = "Here are some things I can help you with:\n- Trading strategies and analysis\n- Signal provider information\n- MT5 connection and setup\n- Risk management advice\n- Market news and updates\n- Platform navigation";
      } else {
        response = "I understand you're asking about " + text + ". Could you provide more details about what you're looking for in Algo360FX?";
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      // Speak the response if speech is enabled
      speak(response);
    }, 1000);
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
    setIsOpen(!isOpen);
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
          zIndex: 1000,
        }}
      >
        <SimpleRobot3D 
          isActive={isOpen} 
          isListening={isListening} 
          isSpeaking={isSpeaking}
          onClick={toggleChat}
          onDoubleClick={toggleListening}
          size={100}
        />
      </Box>
      
      {/* Chat window */}
      <Fade in={isOpen}>
        <Paper
          id="chat-box"
          sx={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: { xs: '90%', sm: '400px' },
            height: '550px',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'primary.dark',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Algo360 Assistant</Typography>
            <Box>
              <IconButton size="small" color="inherit" onClick={toggleSpeaking} sx={{ mr: 1 }}>
                {isSpeaking ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </IconButton>
              <IconButton size="small" color="inherit" onClick={toggleChat}>
                <CloseIcon />
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
            {messages.map((message, index) => (
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
                      bgcolor: 'primary.dark',
                      width: 32,
                      height: 32,
                      mr: 1,
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    backgroundColor: message.role === 'assistant' ? 'primary.dark' : 'grey.100',
                    color: message.role === 'assistant' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    borderTopRightRadius: message.role === 'user' ? 0 : 2,
                    borderTopLeftRadius: message.role === 'assistant' ? 0 : 2,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>
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
              id="standalone-chat-input"
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
              onClick={() => handleSendMessage('/help')}
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
                disabled={!inputMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

// Function to inject the chat assistant into the DOM
export function injectChatAssistant() {
  // Create a container for the chat assistant
  const chatContainer = document.createElement('div');
  chatContainer.id = 'algo360-chat-assistant';
  document.body.appendChild(chatContainer);
  
  // Render the chat assistant into the container
  const root = createRoot(chatContainer);
  root.render(<StandaloneChat />);
}

export default StandaloneChat;
