import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import MT5Page from './pages/MT5Page';
import { WebSocketProvider } from './contexts/WebSocketContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebSocketProvider url="ws://localhost:6778">
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Algo360FX
                </Typography>
                <Button color="inherit" component={Link} to="/">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/mt5">
                  MT5
                </Button>
              </Toolbar>
            </AppBar>

            <Container>
              <Routes>
                <Route path="/mt5" element={<MT5Page />} />
                <Route path="/" element={
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h4">
                      Welcome to Algo360FX
                    </Typography>
                  </Box>
                } />
              </Routes>
            </Container>
          </Box>
        </Router>
      </WebSocketProvider>
    </ThemeProvider>
  );
};

export default App;
