import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

const ThemeToggle: React.FC = observer(() => {
  const { uiStore } = useStores();
  const isDarkMode = uiStore.theme === 'dark';

  const handleToggle = () => {
    uiStore.setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <IconButton onClick={handleToggle} color="inherit" size="large">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
});

export default ThemeToggle;
