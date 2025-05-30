// mainJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './appJs.js';
import "./index.css";
import theme from './theme';

// Override mobx-react-lite to avoid MobX integration issues
import './utils/mobxOverride.js';

// Import the standalone chat assistant
import './components/chat/injectChat';

// Import the topbar enhancer
import './utils/topbarEnhancer';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using React.createElement instead of JSX
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(BrowserRouter, null,
      React.createElement(ThemeProvider, { theme: theme },
        [
          React.createElement(CssBaseline, { key: 'cssbaseline' }),
          React.createElement(SnackbarProvider, { key: 'snackbar', maxSnack: 3 },
            React.createElement(LocalizationProvider, { dateAdapter: AdapterDayjs },
              React.createElement(App)
            )
          )
        ]
      )
    )
  )
);

// Manually inject the chat assistant after a short delay to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'algo360-chat-assistant';
    document.body.appendChild(chatContainer);
    
    const chatRoot = ReactDOM.createRoot(chatContainer);
    // Import dynamically to avoid circular dependencies
    import('./components/chat/StandaloneChat').then(({ default: StandaloneChat }) => {
      chatRoot.render(React.createElement(StandaloneChat));
      console.log('Chat assistant injected successfully');
    });
  }, 1000);
});
