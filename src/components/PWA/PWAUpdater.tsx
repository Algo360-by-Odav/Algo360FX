import React, { useEffect, useState } from 'react';
import { Snackbar, Button } from '@mui/material';

const PWAUpdater: React.FC = () => {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        // Check for updates
        registration.addEventListener('waiting', event => {
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowReload(true);
          }
        });
      });
    }
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  return (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Button color="inherit" size="small" onClick={reloadPage}>
          Reload
        </Button>
      }
    />
  );
};

export default PWAUpdater;
