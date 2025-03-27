import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This feature is currently under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
