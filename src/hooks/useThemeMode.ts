import { useCallback } from 'react';
import { useRootStore } from './useRootStore';

export default function useThemeMode() {
  const { settingsStore } = useRootStore();

  const toggleMode = useCallback(() => {
    settingsStore.updateAppearanceSettings({
      theme: settingsStore.appearance.theme === 'dark' ? 'light' : 'dark',
    });
  }, [settingsStore]);

  const setMode = useCallback(
    (mode: 'light' | 'dark') => {
      settingsStore.updateAppearanceSettings({
        theme: mode,
      });
    },
    [settingsStore]
  );

  return {
    mode: settingsStore.appearance.theme,
    toggleMode,
    setMode,
  };
}

// Example:
// const { mode, toggleMode, setMode } = useThemeMode();
// <IconButton onClick={toggleMode}>
//   {mode === 'dark' ? <LightMode /> : <DarkMode />}
// </IconButton>
