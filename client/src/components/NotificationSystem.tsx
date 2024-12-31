import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useApp } from '../context/AppContext';

const NotificationSystem: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleClose = (notificationId: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
  };

  return (
    <>
      {state.notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ top: `${(index * 80) + 24}px` }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            <AlertTitle>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</AlertTitle>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationSystem;
