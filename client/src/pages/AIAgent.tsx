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
} from '@mui/material';
import ChatInterface from '../components/chat/ChatInterface';
import { initializeOpenAI } from '../services/openaiService';

const AIAgent: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      initializeOpenAI(savedApiKey);
      setIsConfigured(true);
    } else {
      setShowConfig(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      initializeOpenAI(apiKey);
      setIsConfigured(true);
      setShowConfig(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Trading Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your personal AI assistant for market analysis, trading strategies, and financial insights.
        </Typography>

        {isConfigured ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ height: 'calc(90vh - 200px)' }}>
                <ChatInterface />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setShowConfig(true)}
                sx={{ mt: 2 }}
              >
                Configure API Key
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                OpenAI API Configuration Required
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please configure your OpenAI API key to use the AI assistant.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowConfig(true)}
              >
                Configure API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={showConfig} onClose={() => setShowConfig(false)}>
        <DialogTitle>Configure OpenAI API Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
            Enter your OpenAI API key. You can get one from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
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
    </Container>
  );
};

export default AIAgent;
