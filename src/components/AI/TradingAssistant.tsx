import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Tooltip,
  Fab,
  Drawer,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon,
  ShowChart as ChartIcon,
  TrendingUp as SignalIcon,
  Analytics as AnalyticsIcon,
  Timeline as MarketIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'analysis' | 'signal' | 'market' | 'general';
  confidence?: number;
  charts?: any[];
  metadata?: {
    symbol?: string;
    timeframe?: string;
    indicators?: string[];
    sentiment?: 'bullish' | 'bearish' | 'neutral';
  };
}

const TradingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am Algo, your AI trading companion. I can assist you with:\n• Market Analysis\n• Trading Signals\n• Risk Management\n• Strategy Building\n• Performance Optimization\n\nHow can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'general',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const processUserInput = async (userInput: string) => {
    try {
      // Detect intent and extract entities
      const intent = detectIntent(userInput);
      const entities = extractEntities(userInput);
      
      let response;
      switch (intent) {
        case 'market_analysis':
          response = await axios.post('/api/ai/analyze', {
            symbol: entities.symbol,
            timeframe: entities.timeframe,
            indicators: entities.indicators,
          });
          break;
        case 'trading_signal':
          response = await axios.post('/api/ai/signal', {
            symbol: entities.symbol,
            timeframe: entities.timeframe,
            strategy: entities.strategy,
          });
          break;
        case 'risk_assessment':
          response = await axios.post('/api/ai/risk', {
            position: entities.position,
          });
          break;
        default:
          // Handle general queries with default analysis
          response = await axios.post('/api/ai/analyze', {
            query: userInput,
          });
      }

      return formatAIResponse(response.data);
    } catch (error) {
      console.error('Error processing request:', error);
      return {
        text: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        type: 'general',
        confidence: 0,
      };
    }
  };

  const detectIntent = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('analysis') || lowerInput.includes('analyze')) return 'market_analysis';
    if (lowerInput.includes('signal') || lowerInput.includes('trade')) return 'trading_signal';
    if (lowerInput.includes('risk') || lowerInput.includes('position')) return 'risk_assessment';
    return 'general';
  };

  const extractEntities = (input: string): any => {
    // Implement entity extraction logic here
    // This is a placeholder implementation
    return {
      symbol: 'EURUSD',
      timeframe: '1H',
      indicators: ['MACD', 'RSI'],
      strategy: 'trend_following',
      position: {
        type: 'long',
        entry: 1.1000,
        stopLoss: 1.0950,
        takeProfit: 1.1100,
        size: 1.0,
      },
    };
  };

  const formatAIResponse = (data: any): Partial<Message> => {
    return {
      text: data.analysis || data.signal || data.assessment,
      type: data.type || 'general',
      confidence: data.confidence || 0.8,
      charts: data.charts,
      metadata: data.metadata,
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await processUserInput(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text || 'I apologize, but I could not process that request.',
        sender: 'ai',
        timestamp: new Date(),
        type: aiResponse.type,
        confidence: aiResponse.confidence,
        charts: aiResponse.charts,
        metadata: aiResponse.metadata,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'general',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (message: Message) => {
    return (
      <Box>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {message.text}
        </Typography>
        {message.charts && message.charts.map((chart, index) => (
          <Box key={index} mt={2} mb={2} height={200}>
            <Line data={chart.data} options={chart.options} />
          </Box>
        ))}
        {message.metadata && (
          <Box mt={1}>
            {message.metadata.symbol && (
              <Chip
                label={message.metadata.symbol}
                size="small"
                color="primary"
                style={{ marginRight: 8 }}
              />
            )}
            {message.metadata.timeframe && (
              <Chip
                label={message.metadata.timeframe}
                size="small"
                color="secondary"
                style={{ marginRight: 8 }}
              />
            )}
            {message.metadata.sentiment && (
              <Chip
                label={message.metadata.sentiment}
                size="small"
                color={
                  message.metadata.sentiment === 'bullish'
                    ? 'success'
                    : message.metadata.sentiment === 'bearish'
                    ? 'error'
                    : 'default'
                }
              />
            )}
          </Box>
        )}
        {message.confidence && (
          <Box mt={1}>
            <Tooltip title="AI Confidence Score">
              <Chip
                label={`${(message.confidence * 100).toFixed(0)}% confidence`}
                size="small"
                color="info"
              />
            </Tooltip>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="AI Assistant"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: theme.zIndex.drawer + 2,
        }}
      >
        <AIIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '400px',
            maxWidth: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display="flex" alignItems="center">
              <AIIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Algo AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: 2,
              bgcolor: theme.palette.grey[50],
            }}
          >
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {message.sender === 'user' ? <PersonIcon /> : <AIIcon />}
                  </Avatar>
                </ListItemAvatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  {renderMessageContent(message)}
                </Paper>
              </ListItem>
            ))}
            {isTyping && (
              <Box display="flex" alignItems="center" ml={2}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary" ml={1}>
                  Algo is typing...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </List>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about trading..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default TradingAssistant;
