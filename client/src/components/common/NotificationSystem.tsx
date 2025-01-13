import React, { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { useTheme } from '@mui/material/styles';

interface NotificationSystemProps {
  children: ReactNode;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationSystem;
