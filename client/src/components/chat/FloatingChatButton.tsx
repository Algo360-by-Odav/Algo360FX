import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  IconButton,
  Box,
  Paper,
  Typography,
  useTheme,
  Slide,
  Zoom,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  KeyboardArrowDown as MinimizeIcon,
} from '@mui/icons-material';
import ChatInterface from './ChatInterface';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

const FloatingChatButton = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const theme = useTheme();
  const { themeStore } = useStores();

  const handleToggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      <Zoom in={!isOpen || isMinimized}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
          onClick={handleToggleChat}
        >
          <SmartToyIcon />
        </Fab>
      </Zoom>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: isMinimized ? 16 : 32,
            right: 32,
            width: isMinimized ? 'auto' : 400,
            height: isMinimized ? 'auto' : 600,
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1000,
            bgcolor: 'background.paper',
            transition: theme.transitions.create(['width', 'height']),
          }}
        >
          {isMinimized ? (
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
              onClick={() => setIsMinimized(false)}
            >
              <SmartToyIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">AI Assistant</Typography>
            </Box>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="subtitle1">AI Assistant</Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={handleMinimize}
                    sx={{ color: 'inherit', mr: 1 }}
                  >
                    <MinimizeIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{ color: 'inherit' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <ChatInterface />
              </Box>
            </Box>
          )}
        </Paper>
      </Slide>
    </>
  );
});

export default FloatingChatButton;
