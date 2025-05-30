import React, { useState, useEffect } from 'react';
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
import { initializeOpenAI } from '../services/openaiService';
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

const AIAgent: React.FC = observer(() => {
  // Store access
  const { chatStore } = useStores();
  
  // State for API configuration
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
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
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Advanced AI model with strong reasoning and knowledge capabilities',
      capabilities: ['Market analysis', 'Strategy development', 'Educational content', 'Code generation'],
      contextLength: 8192,
      isAvailable: true
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient model for general trading assistance',
      capabilities: ['Basic market analysis', 'Trading guidance', 'FAQ responses'],
      contextLength: 4096,
      isAvailable: true
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Alternative AI model with strong reasoning capabilities',
      capabilities: ['Detailed analysis', 'Nuanced responses', 'Risk assessment'],
      contextLength: 100000,
      isAvailable: false
    }
  ];
  
  // Preset prompts for quick access
  const presetPrompts: PresetPrompt[] = [
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      prompt: 'Analyze the current market conditions for major forex pairs and provide key support/resistance levels.',
      category: 'analysis',
      icon: <TrendingUpIcon />
    },
    {
      id: 'trading-strategy',
      title: 'Trading Strategy',
      prompt: 'Explain a risk-managed swing trading strategy suitable for the current market.',
      category: 'trading',
      icon: <PsychologyIcon />
    },
    {
      id: 'learn-indicators',
      title: 'Technical Indicators',
      prompt: 'Explain how to effectively use RSI, MACD and Bollinger Bands together for trading decisions.',
      category: 'education',
      icon: <SchoolIcon />
    },
    {
      id: 'code-indicator',
      title: 'Custom Indicator',
      prompt: 'Write a MQL5 code for a custom indicator that combines RSI and moving averages.',
      category: 'general',
      icon: <CodeIcon />
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      prompt: 'Provide a comprehensive risk management framework for a $10,000 trading account.',
      category: 'education',
      icon: <LightbulbIcon />
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
    setSelectedModel(modelId);
    localStorage.setItem('ai_selected_model', modelId);
    showNotification(`Model changed to ${aiModels.find(m => m.id === modelId)?.name}`, 'info');
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
            <Typography variant="h4">
              AI Trading Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal AI assistant for market analysis, trading strategies, and financial insights
            </Typography>
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
            {/* AI Model selection chips */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  AI Model:
                </Typography>
                {aiModels.map((model) => (
                  <Chip
                    key={model.id}
                    label={model.name}
                    variant={selectedModel === model.id ? 'filled' : 'outlined'}
                    color={selectedModel === model.id ? 'primary' : 'default'}
                    onClick={() => model.isAvailable && handleModelChange(model.id)}
                    disabled={!model.isAvailable}
                    size="small"
                  />
                ))}
                <Box sx={{ flexGrow: 1 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={useAdvancedMode}
                      onChange={handleAdvancedModeToggle}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Advanced Mode</Typography>}
                />
              </Paper>
            </Grid>
            
            {/* Main content area with tabs */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ height: 'calc(85vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
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
                  <Typography variant="h6" gutterBottom>
                    Preset Prompts
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Click on any prompt to quickly get AI assistance on common trading topics.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {presetPrompts.map((preset) => (
                      <Grid item xs={12} sm={6} md={4} key={preset.id}>
                        <Card 
                          variant="outlined" 
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 2
                            }
                          }}
                          onClick={() => handlePresetPromptClick(preset.prompt)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ mr: 1, color: 'primary.main' }}>
                                {preset.icon}
                              </Box>
                              <Typography variant="subtitle1">
                                {preset.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {preset.prompt}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                {/* System Prompt (Advanced Mode) */}
                {useAdvancedMode && (
                  <Box sx={{ display: currentTab === 2 ? 'block' : 'none', p: 2, overflowY: 'auto', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        System Prompt
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSystemPromptSave}
                      >
                        Save
                      </Button>
                    </Box>
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                      The system prompt defines the AI's behavior and knowledge context. Customize it to get more specialized trading assistance.
                    </Alert>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      variant="outlined"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Enter system prompt for the AI..."
                    />
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
      <Dialog open={showModelInfo} onClose={() => setShowModelInfo(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            AI Models Information
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            The AI Trading Assistant supports multiple AI models with different capabilities. 
            Choose the model that best suits your needs.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {aiModels.map((model) => (
              <Grid item xs={12} key={model.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    <Typography variant="subtitle2" gutterBottom>
                      Capabilities:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {model.capabilities.map((capability, index) => (
                        <Chip key={index} label={capability} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="body2">
                      Context length: {model.contextLength.toLocaleString()} tokens
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModelInfo(false)}>Close</Button>
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
