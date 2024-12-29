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
  Menu,
  MenuItem,
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
  MoreVert as MoreIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'analysis' | 'signal' | 'market' | 'general' | 'prediction';
  confidence?: number;
  charts?: any[];
  metadata?: {
    symbol?: string;
    timeframe?: string;
    indicators?: string[];
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    prediction?: {
      price?: number;
      timeframe?: string;
      probability?: number;
    };
    analysis?: {
      technicalScore?: number;
      fundamentalScore?: number;
      marketSentiment?: string;
      riskLevel?: 'low' | 'medium' | 'high';
    };
  };
}

interface QuickAction {
  label: string;
  query: string;
  icon: React.ReactNode;
}

const TradingAssistant: React.FC = observer(() => {
  const theme = useTheme();
  const { authStore, marketStore } = useRootStore();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [quickActions] = useState<QuickAction[]>([
    { 
      label: 'Market Analysis',
      query: 'Analyze current market conditions and major trends',
      icon: <AnalyticsIcon />
    },
    {
      label: 'Trading Signals',
      query: 'Show me the top trading opportunities right now',
      icon: <SignalIcon />
    },
    {
      label: 'Price Prediction',
      query: 'Predict the price movement for major currency pairs',
      icon: <ChartIcon />
    },
    {
      label: 'Risk Analysis',
      query: 'Analyze market risks and potential hedging strategies',
      icon: <PsychologyIcon />
    },
  ]);

  useEffect(() => {
    scrollToBottom();
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hello ${authStore.user?.name || 'trader'}! I'm your AI Trading Assistant. I can help you with:
        • Market analysis and predictions
        • Trading signals and opportunities
        • Risk assessment and management
        • Technical and fundamental analysis
        • Trading strategies and optimization
        
        What would you like to know about today?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'general'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, authStore.user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setIsLoading(true);

    try {
      // Call your AI backend service
      const response = await axios.post('/api/ai/chat', {
        message: input,
        context: {
          previousMessages: messages.slice(-5),
          user: authStore.user,
          selectedMarkets: marketStore.selectedMarkets,
          timeframe: marketStore.timeframe,
        }
      });

      const aiResponse: Message = {
        id: Date.now().toString(),
        text: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
        type: response.data.type,
        confidence: response.data.confidence,
        charts: response.data.charts,
        metadata: response.data.metadata,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    handleSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: 'column',
          alignItems: isAI ? 'flex-start' : 'flex-end',
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            maxWidth: '80%',
            gap: 1,
          }}
        >
          <ListItemAvatar sx={{ minWidth: 40 }}>
            <Avatar
              sx={{
                bgcolor: isAI ? 'primary.main' : 'secondary.main',
                width: 32,
                height: 32,
              }}
            >
              {isAI ? <AIIcon /> : <PersonIcon />}
            </Avatar>
          </ListItemAvatar>
          <Box>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: isAI ? 'background.paper' : 'primary.main',
                borderRadius: 2,
                color: isAI ? 'text.primary' : 'primary.contrastText',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
              {message.metadata && (
                <Box sx={{ mt: 2 }}>
                  {message.metadata.symbol && (
                    <Chip
                      label={message.metadata.symbol}
                      size="small"
                      color="primary"
                      sx={{ mr: 1, mb: 1 }}
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
                          : 'warning'
                      }
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {message.metadata.prediction && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block">
                        Prediction: {message.metadata.prediction.price} ({message.metadata.prediction.timeframe})
                      </Typography>
                      <Typography variant="caption" display="block">
                        Confidence: {message.metadata.prediction.probability}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              {message.charts && message.charts.length > 0 && (
                <Box sx={{ mt: 2, width: '100%', height: 200 }}>
                  <Line data={message.charts[0]} options={{ responsive: true }} />
                </Box>
              )}
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </ListItem>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="AI Assistant"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        {isOpen ? <CloseIcon /> : <AIIcon />}
      </Fab>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            height: '100%',
            top: 64,
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          {/* Header */}
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
            <Typography variant="h6" component="div">
              AI Trading Assistant
            </Typography>
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={() => setMessages([])}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{
              p: 1,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
            }}
          >
            {quickActions.map((action) => (
              <Button
                key={action.label}
                size="small"
                variant="outlined"
                startIcon={action.icon}
                onClick={() => handleQuickAction(action.query)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {action.label}
              </Button>
            ))}
          </Box>

          {/* Messages */}
          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 0,
            }}
          >
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </List>

          {/* Input */}
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
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about markets, trading strategies, or analysis..."
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setSelectedType(null); setAnchorEl(null); }}>
          All Messages
        </MenuItem>
        <MenuItem onClick={() => { setSelectedType('analysis'); setAnchorEl(null); }}>
          Analysis Only
        </MenuItem>
        <MenuItem onClick={() => { setSelectedType('signal'); setAnchorEl(null); }}>
          Signals Only
        </MenuItem>
        <MenuItem onClick={() => { setSelectedType('prediction'); setAnchorEl(null); }}>
          Predictions Only
        </MenuItem>
      </Menu>
    </>
  );
});

export default TradingAssistant;
