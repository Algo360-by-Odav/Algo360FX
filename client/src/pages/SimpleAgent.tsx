import React from 'react';
import { Box, Typography, Paper, Button, Container } from '@mui/material';

/**
 * A super simple Trading Agent page with no dependencies on any other components
 * This should eliminate any potential issues from imported components
 */
const SimpleAgent: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trading Agent - Simple Version
        </Typography>
        
        <Typography variant="body1" paragraph>
          This is a simplified version of the Trading Agent page that should work without any routing issues.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/standalone-agent.html'}
            sx={{ mr: 2 }}
          >
            View Full Trading Agent UI
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/dashboard'}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleAgent;
