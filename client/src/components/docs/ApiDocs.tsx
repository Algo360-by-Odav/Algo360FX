import React from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ApiDocs: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        API Documentation
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Introduction" />
            <Tab label="Authentication" />
            <Tab label="Endpoints" />
            <Tab label="Examples" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>
            Introduction
          </Typography>
          <Typography paragraph>
            The Algo360FX API provides programmatic access to market data, trading functionality,
            and account management features. This documentation will help you integrate our
            services into your applications.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>
            Authentication
          </Typography>
          <Typography paragraph>
            Learn how to authenticate your API requests using API keys and access tokens.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>
            API Endpoints
          </Typography>
          <Typography paragraph>
            Detailed documentation of all available API endpoints, including request/response formats.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography variant="h6" gutterBottom>
            Code Examples
          </Typography>
          <Typography paragraph>
            Sample code snippets demonstrating how to use the API in various programming languages.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ApiDocs;
