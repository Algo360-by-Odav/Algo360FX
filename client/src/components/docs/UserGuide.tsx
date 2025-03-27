import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const UserGuide: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Guide
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Getting Started
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Account Setup"
                secondary="Learn how to set up your trading account and configure initial settings."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Basic Navigation"
                secondary="Understanding the dashboard and main navigation elements."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Trading Interface"
                secondary="How to use the trading chart and place orders."
              />
            </ListItem>
          </List>

          <Typography variant="h5" sx={{ mb: 3, mt: 4 }}>
            Advanced Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Technical Analysis"
                secondary="Using technical indicators and drawing tools."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Risk Management"
                secondary="Setting up stop losses and managing position sizes."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Portfolio Management"
                secondary="Creating and managing multiple portfolios."
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserGuide;
