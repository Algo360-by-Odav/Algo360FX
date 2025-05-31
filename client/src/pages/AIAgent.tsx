import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import ChatInterface from '../components/chat/ChatInterface';
import { initializeOpenAI, setAIModel } from '../services/openaiService';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/storeProviderJs';

// Define interface for AI model options
interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  contextLength: number;
  isAvailable: boolean;
}

// Define interface for preset prompts
interface PresetPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'trading' | 'analysis' | 'education' | 'general';
  icon: React.ReactNode;
}

// Define the component using standard naming convention for better compatibility
const AIAgent: React.FC = observer(function AIAgent() {
  // Store access
  const { chatStore } = useStores();
  
  // State for API configuration
  const [apiKey, setApiKey] = useState('');
  // Force isConfigured to true for testing purposes
  const [isConfigured, setIsConfigured] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  
  // State for AI Agent features
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an AI trading assistant for Algo360FX. Provide helpful, accurate information about trading, market analysis, and financial concepts. When discussing strategies, always emphasize risk management.'
  );
  
  // Available AI models
  const aiModels: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: 'Latest OpenAI model with enhanced reasoning and multimodal capabilities',
      capabilities: ['Real-time market analysis', 'Advanced strategy development', 'Chart interpretation', 'Code generation'],
      contextLength: 128000,
      isAvailable: true
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Reliable OpenAI model with strong reasoning and knowledge capabilities',
      capabilities: ['Market analysis', 'Strategy development', 'Educational content', 'Code generation'],
      contextLength: 8192,
      isAvailable: true
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient model for general trading assistance',
      capabilities: ['Basic market analysis', 'Trading guidance', 'FAQ responses'],
      contextLength: 16384,
      isAvailable: true
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Anthropics most advanced model with exceptional reasoning capabilities',
      capabilities: ['Complex financial analysis', 'Advanced risk assessment', 'Nuanced market interpretation'],
      contextLength: 200000,
      isAvailable: true
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: 'Balanced Anthropic model combining power and efficiency',
      capabilities: ['Detailed analysis', 'Nuanced responses', 'Risk assessment'],
      contextLength: 150000,
      isAvailable: true
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Googles advanced AI model with strong analytical capabilities',
      capabilities: ['Technical analysis', 'Pattern recognition', 'Market trend prediction'],
      contextLength: 32000,
      isAvailable: true
    },
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      description: 'Powerful open-weight model with excellent reasoning capabilities',
      capabilities: ['Trading strategy analysis', 'Market forecasting', 'Risk evaluation'],
      contextLength: 32000,
      isAvailable: true
    },
    {
      id: 'llama-3',
      name: 'Llama 3',
      description: 'Metas open model with strong performance for various trading tasks',
      capabilities: ['General trading guidance', 'Market summaries', 'Basic strategy suggestions'],
      contextLength: 8000,
      isAvailable: false
    }
  ];
  
  // Preset prompts for quick access
  const presetPrompts: PresetPrompt[] = [
    // Market Analysis category
    {
      id: 'market-analysis-overview',
      title: 'Market Overview',
      prompt: 'Provide a comprehensive analysis of the current global financial markets, focusing on major forex pairs, indices, and commodities. Include key levels and potential market movers for the next 24 hours.',
      category: 'analysis',
      icon: <TrendingUpIcon />
    },
    {
      id: 'support-resistance',
      title: 'Support/Resistance Levels',
      prompt: 'Analyze the key support and resistance levels for EUR/USD, GBP/USD, USD/JPY, and XAU/USD. Include both daily and weekly perspectives.',
      category: 'analysis',
      icon: <TrendingUpIcon />
    },
    {
      id: 'correlation-analysis',
      title: 'Correlation Analysis',
      prompt: 'Analyze the current correlations between major currency pairs, gold, oil, and US equities. Identify potential trading opportunities based on correlation divergences.',
      category: 'analysis',
      icon: <TrendingUpIcon />
    },
    
    // Trading Strategies category
    {
      id: 'swing-trading',
      title: 'Swing Trading Strategy',
      prompt: 'Explain a risk-managed swing trading strategy suitable for the current market environment, including specific entry/exit criteria and position sizing.',
      category: 'trading',
      icon: <PsychologyIcon />
    },
    {
      id: 'scalping-strategy',
      title: 'Scalping Strategy',
      prompt: 'Detail an intraday scalping strategy for EUR/USD and GBP/USD using 5-minute and 15-minute charts, including precise entry/exit rules and risk parameters.',
      category: 'trading',
      icon: <PsychologyIcon />
    },
    {
      id: 'breakout-strategy',
      title: 'Breakout Strategy',
      prompt: 'Explain a comprehensive breakout trading strategy with specific entry conditions, stop placement, and take profit targets. Include methods to filter false breakouts.',
      category: 'trading',
      icon: <PsychologyIcon />
    },
    
    // Technical Analysis category
    {
      id: 'indicators-guide',
      title: 'Technical Indicators Guide',
      prompt: 'Explain how to effectively use RSI, MACD, and Bollinger Bands together for trading decisions. Include specific settings, entry/exit signals, and common pitfalls to avoid.',
      category: 'education',
      icon: <SchoolIcon />
    },
    {
      id: 'price-action',
      title: 'Price Action Patterns',
      prompt: 'Explain the most reliable price action patterns for forex trading. Include pin bars, engulfing patterns, and multi-candle formations with specific examples for identification.',
      category: 'education',
      icon: <SchoolIcon />
    },
    {
      id: 'elliot-wave',
      title: 'Elliott Wave Analysis',
      prompt: 'Provide a detailed explanation of Elliott Wave Theory and how to apply it to forex markets. Include practical examples for identifying wave structures.',
      category: 'education',
      icon: <SchoolIcon />
    },
    
    // Risk Management category
    {
      id: 'risk-management',
      title: 'Risk Management Framework',
      prompt: 'Provide a comprehensive risk management framework for a $10,000 trading account, including position sizing, maximum drawdown rules, and equity curve management.',
      category: 'education',
      icon: <LightbulbIcon />
    },
    {
      id: 'portfolio-optimization',
      title: 'Portfolio Optimization',
      prompt: 'Explain how to optimize a trading portfolio across multiple forex pairs to maximize returns while minimizing overall risk. Include correlation analysis and capital allocation strategies.',
      category: 'education',
      icon: <LightbulbIcon />
    },
    
    // Programming & Automation category
    {
      id: 'mt5-strategy',
      title: 'MT5 Strategy Code',
      prompt: 'Write a complete MQL5 code for an automated trading strategy that combines moving averages, RSI, and support/resistance levels. Include risk management parameters.',
      category: 'general',
      icon: <CodeIcon />
    },
    {
      id: 'custom-indicator',
      title: 'Custom Indicator',
      prompt: 'Create a custom indicator in MQL5 that identifies potential reversal zones based on RSI divergence, price action patterns, and volume analysis.',
      category: 'general',
      icon: <CodeIcon />
    }
  ];

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      initializeOpenAI(savedApiKey);
      setIsConfigured(true);
    } else {
      setShowConfig(true);
    }
    
    // Load saved preferences
    const savedModel = localStorage.getItem('ai_selected_model');
    if (savedModel) setSelectedModel(savedModel);
    
    const savedAdvancedMode = localStorage.getItem('ai_advanced_mode');
    if (savedAdvancedMode) setUseAdvancedMode(savedAdvancedMode === 'true');
    
    const savedSystemPrompt = localStorage.getItem('ai_system_prompt');
    if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      initializeOpenAI(apiKey);
      setIsConfigured(true);
      setShowConfig(false);
      showNotification('API key saved successfully', 'success');
    }
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  const handleModelChange = (modelId: string) => {
    try {
      // Attempt to set the model in the OpenAI service
      const result = setAIModel(modelId);
      if (result) {
        setSelectedModel(modelId);
        localStorage.setItem('ai_selected_model', modelId);
        showNotification(`Model changed to ${aiModels.find(m => m.id === modelId)?.name}`, 'success');
      } else {
        showNotification(`Failed to set model: ${modelId}`, 'error');
      }
    } catch (error) {
      console.error('Error setting AI model:', error);
      showNotification('Error changing AI model. Please check your API configuration.', 'error');
    }
  };
  
  const handleAdvancedModeToggle = () => {
    const newValue = !useAdvancedMode;
    setUseAdvancedMode(newValue);
    localStorage.setItem('ai_advanced_mode', String(newValue));
  };
  
  const handleSystemPromptSave = () => {
    localStorage.setItem('ai_system_prompt', systemPrompt);
    showNotification('System prompt saved', 'success');
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleClearHistory = () => {
    chatStore.clearMessages();
    showNotification('Chat history cleared', 'info');
    handleMenuClose();
  };
  
  const handlePresetPromptClick = (prompt: string) => {
    chatStore.sendMessage(prompt);
  };
  
  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };
  
  const exportChatHistory = () => {
    try {
      const historyData = JSON.stringify(chatStore.messages, null, 2);
      const blob = new Blob([historyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `algo360fx-chat-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Chat history exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting chat history:', error);
      showNotification('Failed to export chat history', 'error');
    }
    handleMenuClose();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <AIIcon fontSize="large" color="primary" />
          </Grid>
          <Grid item xs>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Settings">
                <IconButton onClick={() => setShowConfig(true)} color="primary">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton onClick={handleMenuOpen} color="primary">
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={exportChatHistory}>
                <ListItemIcon>
                  <DownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export chat history</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClearHistory}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear chat history</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setShowModelInfo(true)}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>About AI models</ListItemText>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>

        {isConfigured ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* AI Model selection section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    AI Model Selection
                  </Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useAdvancedMode}
                          onChange={handleAdvancedModeToggle}
                          size="small"
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Advanced Mode</Typography>}
                    />
                    <Tooltip title="View model details">
                      <IconButton size="small" onClick={() => setShowModelInfo(true)} color="primary">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Select an AI model based on your needs. More powerful models offer deeper analysis but may be slower.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Typography variant="caption" color="primary" fontWeight="500">OpenAI Models</Typography>
                    </Box>
                    {aiModels.filter(model => model.id.includes('gpt')).map((model) => (
                      <Chip
                        key={model.id}
                        label={model.name}
                        variant={selectedModel === model.id ? 'filled' : 'outlined'}
                        color={selectedModel === model.id ? 'primary' : 'default'}
                        onClick={() => model.isAvailable && handleModelChange(model.id)}
                        disabled={!model.isAvailable}
                        size="medium"
                        sx={{ px: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Typography variant="caption" color="primary" fontWeight="500">Anthropic Models</Typography>
                    </Box>
                    {aiModels.filter(model => model.id.includes('claude')).map((model) => (
                      <Chip
                        key={model.id}
                        label={model.name}
                        variant={selectedModel === model.id ? 'filled' : 'outlined'}
                        color={selectedModel === model.id ? 'primary' : 'default'}
                        onClick={() => model.isAvailable && handleModelChange(model.id)}
                        disabled={!model.isAvailable}
                        size="medium"
                        sx={{ px: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Typography variant="caption" color="primary" fontWeight="500">Other Models</Typography>
                    </Box>
                    {aiModels.filter(model => !model.id.includes('gpt') && !model.id.includes('claude')).map((model) => (
                      <Chip
                        key={model.id}
                        label={model.name}
                        variant={selectedModel === model.id ? 'filled' : 'outlined'}
                        color={selectedModel === model.id ? 'primary' : 'default'}
                        onClick={() => model.isAvailable && handleModelChange(model.id)}
                        disabled={!model.isAvailable}
                        size="medium"
                        sx={{ px: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Main content area with tabs */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ height: 'calc(85vh - 240px)', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange} 
                    variant="scrollable" 
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        minHeight: '56px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        '&.Mui-selected': {
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3
                      }
                    }}
                  >
                    <Tab label="Chat" icon={<AIIcon />} iconPosition="start" />
                    <Tab label="Preset Prompts" icon={<LightbulbIcon />} iconPosition="start" />
                    {useAdvancedMode && <Tab label="System Prompt" icon={<CodeIcon />} iconPosition="start" />}
                  </Tabs>
                </Box>
                
                {/* Chat Interface */}
                <Box sx={{ display: currentTab === 0 ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                  <ChatInterface />
                </Box>
                
                {/* Preset Prompts */}
                <Box sx={{ display: currentTab === 1 ? 'block' : 'none', p: 2, overflowY: 'auto', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Preset Trading Prompts
                    </Typography>
                    <Chip 
                      label={`${presetPrompts.length} prompts available`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Click on any prompt to quickly get AI assistance on common trading topics.
                  </Typography>
                  
                  {/* Market Analysis Section */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      pb: 0.5, 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
                    }}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Market Analysis
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {presetPrompts
                        .filter(prompt => prompt.category === 'analysis')
                        .map((preset) => (
                          <Grid item xs={12} sm={6} md={4} key={preset.id}>
                            <Card 
                              variant="outlined" 
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '10px',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2,
                                  borderColor: 'primary.main'
                                }
                              }}
                              onClick={() => handlePresetPromptClick(preset.prompt)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {preset.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {preset.prompt}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {/* Trading Strategies Section */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      pb: 0.5, 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
                    }}>
                      <PsychologyIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Trading Strategies
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {presetPrompts
                        .filter(prompt => prompt.category === 'trading')
                        .map((preset) => (
                          <Grid item xs={12} sm={6} md={4} key={preset.id}>
                            <Card 
                              variant="outlined" 
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '10px',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2,
                                  borderColor: 'secondary.main'
                                }
                              }}
                              onClick={() => handlePresetPromptClick(preset.prompt)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {preset.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {preset.prompt}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {/* Technical Analysis & Education Section */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      pb: 0.5, 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
                    }}>
                      <SchoolIcon color="info" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Technical Analysis & Education
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {presetPrompts
                        .filter(prompt => prompt.category === 'education')
                        .map((preset) => (
                          <Grid item xs={12} sm={6} md={4} key={preset.id}>
                            <Card 
                              variant="outlined" 
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '10px',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2,
                                  borderColor: 'info.main'
                                }
                              }}
                              onClick={() => handlePresetPromptClick(preset.prompt)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {preset.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {preset.prompt}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {/* Programming & Automation Section */}
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      pb: 0.5, 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
                    }}>
                      <CodeIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Programming & Automation
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {presetPrompts
                        .filter(prompt => prompt.category === 'general')
                        .map((preset) => (
                          <Grid item xs={12} sm={6} md={4} key={preset.id}>
                            <Card 
                              variant="outlined" 
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '10px',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2,
                                  borderColor: 'success.main'
                                }
                              }}
                              onClick={() => handlePresetPromptClick(preset.prompt)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {preset.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {preset.prompt}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                
                {/* System Prompt (Advanced Mode) */}
                {useAdvancedMode && (
                  <Box sx={{ display: currentTab === 2 ? 'block' : 'none', p: 2, overflowY: 'auto', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        System Prompt Configuration
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => setSystemPrompt('')}
                          sx={{ mr: 1 }}
                        >
                          Clear
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={handleSystemPromptSave}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      The system prompt defines the AI's behavior and knowledge context. Customize it to get more specialized trading assistance.
                      Your changes will be saved locally and applied to all future conversations.
                    </Alert>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                          Preset System Prompts
                        </Typography>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent sx={{ py: 1 }}>
                            <Button 
                              fullWidth 
                              variant="text" 
                              onClick={() => setSystemPrompt(
                                'You are an expert forex and trading assistant for Algo360FX, a sophisticated trading platform. ' +
                                'Provide professional, accurate information about trading, technical analysis, and market insights. ' +
                                'Always emphasize risk management in your advice. Focus on factual information and avoid speculation. ' +
                                'When appropriate, explain concepts in detail and provide educational context.'
                              )}
                            >
                              General Trading Assistant
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent sx={{ py: 1 }}>
                            <Button 
                              fullWidth 
                              variant="text" 
                              onClick={() => setSystemPrompt(
                                'You are a technical analysis specialist for Algo360FX. Your expertise is in chart patterns, ' +
                                'indicators, and price action analysis. When asked about trading, focus primarily on technical ' +
                                'aspects rather than fundamentals. Provide detailed explanations of chart setups, indicator ' +
                                'configurations, and pattern recognition techniques. Include specific entry criteria, stop loss ' +
                                'placement guidelines, and take profit methodologies in your advice.'
                              )}
                            >
                              Technical Analysis Specialist
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent sx={{ py: 1 }}>
                            <Button 
                              fullWidth 
                              variant="text" 
                              onClick={() => setSystemPrompt(
                                'You are a risk management and psychology expert for traders using the Algo360FX platform. ' +
                                'Your primary focus is helping traders develop robust risk management strategies and maintain ' +
                                'psychological discipline. Always emphasize position sizing, risk-to-reward ratios, drawdown ' +
                                'management, and maintaining trading discipline. When providing advice, prioritize capital ' +
                                'preservation strategies and psychological resilience techniques over specific trading setups.'
                              )}
                            >
                              Risk Management Specialist
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card variant="outlined">
                          <CardContent sx={{ py: 1 }}>
                            <Button 
                              fullWidth 
                              variant="text" 
                              onClick={() => setSystemPrompt(
                                'You are an automated trading and coding expert for the Algo360FX platform. Your specialty is ' +
                                'helping traders develop algorithmic trading strategies, particularly in MQL4/MQL5 and Python. ' +
                                'When assisting with code, focus on best practices, error handling, and optimization techniques. ' +
                                'Always ensure that automation strategies include proper risk management parameters and ' +
                                'safeguards. Provide detailed explanations of code logic and implementation approaches.'
                              )}
                            >
                              Trading Automation Expert
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                          Custom System Prompt
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={17}
                          variant="outlined"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          placeholder="Enter a custom system prompt for the AI assistant..."
                          InputProps={{
                            sx: {
                              '& textarea': {
                                fontFamily: 'monospace',
                                fontSize: '0.875rem'
                              }
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid rgba(0,0,0,0.12)' }}>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary">
                        Tips for effective system prompts:
                      </Typography>
                      <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
                        <li>Define the AI's role and expertise clearly</li>
                        <li>Specify how it should handle questions about risk</li>
                        <li>Indicate the level of detail you expect in responses</li>
                        <li>Provide guidance on the balance between technical and fundamental analysis</li>
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AIIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  OpenAI API Configuration Required
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                To use the AI Trading Assistant, you need to provide your OpenAI API key. This key is stored locally on your device and is never sent to our servers.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowConfig(true)}
                startIcon={<SettingsIcon />}
              >
                Configure API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* API Key Configuration Dialog */}
      <Dialog open={showConfig} onClose={() => setShowConfig(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            Configure AI Assistant
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            OpenAI API Key
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your OpenAI API key. You can get one from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
              OpenAI's website
            </a>
            .
          </Typography>
          <TextField
            margin="dense"
            label="API Key"
            type="password"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            variant="outlined"
          />
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Privacy Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your API key is stored only in your browser's local storage and is never sent to our servers. 
              All AI interactions happen directly between your browser and OpenAI's servers.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfig(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveApiKey} 
            variant="contained" 
            disabled={!apiKey}
            startIcon={<SaveIcon />}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* AI Model Information Dialog */}
      <Dialog open={showModelInfo} onClose={() => setShowModelInfo(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} />
              <Typography variant="h6">AI Models Comparison</Typography>
            </Box>
            <IconButton onClick={() => setShowModelInfo(false)} size="small">
              <Box sx={{ p: 0.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </Box>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              The AI Trading Assistant integrates with multiple AI models to provide the best trading insights. Select the model that best matches your specific needs.
            </Alert>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 500 }}>
              Model Categories
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<AIIcon />} label="OpenAI Models" color="primary" variant="outlined" />
              <Chip icon={<PsychologyIcon />} label="Anthropic Models" color="secondary" variant="outlined" />
              <Chip icon={<TrendingUpIcon />} label="Trading Optimized" color="success" variant="outlined" />
              <Chip icon={<LightbulbIcon />} label="General Purpose" color="default" variant="outlined" />
            </Box>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main', pb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            OpenAI Models
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {aiModels.filter(model => model.id.includes('gpt')).map((model) => (
              <Grid item xs={12} md={6} key={model.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{model.name}</Typography>
                      <Chip 
                        label={model.isAvailable ? 'Available' : 'Coming Soon'} 
                        color={model.isAvailable ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {model.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Best for:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {model.capabilities.map((capability, index) => (
                          <Chip key={index} label={capability} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Context: {model.contextLength.toLocaleString()} tokens
                        </Typography>
                        <Button 
                          size="small" 
                          variant="text" 
                          color="primary"
                          disabled={!model.isAvailable}
                          onClick={() => { 
                            handleModelChange(model.id);
                            setShowModelInfo(false);
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'secondary.main', pb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            Anthropic Models
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {aiModels.filter(model => model.id.includes('claude')).map((model) => (
              <Grid item xs={12} md={6} key={model.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{model.name}</Typography>
                      <Chip 
                        label={model.isAvailable ? 'Available' : 'Coming Soon'} 
                        color={model.isAvailable ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {model.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Best for:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {model.capabilities.map((capability, index) => (
                          <Chip key={index} label={capability} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Context: {model.contextLength.toLocaleString()} tokens
                        </Typography>
                        <Button 
                          size="small" 
                          variant="text" 
                          color="secondary"
                          disabled={!model.isAvailable}
                          onClick={() => { 
                            handleModelChange(model.id);
                            setShowModelInfo(false);
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary', pb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            Other AI Models
          </Typography>
          <Grid container spacing={2}>
            {aiModels.filter(model => !model.id.includes('gpt') && !model.id.includes('claude')).map((model) => (
              <Grid item xs={12} md={6} key={model.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{model.name}</Typography>
                      <Chip 
                        label={model.isAvailable ? 'Available' : 'Coming Soon'} 
                        color={model.isAvailable ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {model.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Best for:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {model.capabilities.map((capability, index) => (
                          <Chip key={index} label={capability} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Context: {model.contextLength.toLocaleString()} tokens
                        </Typography>
                        <Button 
                          size="small" 
                          variant="text"
                          disabled={!model.isAvailable}
                          onClick={() => { 
                            handleModelChange(model.id);
                            setShowModelInfo(false);
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModelInfo(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
});

export default AIAgent;
