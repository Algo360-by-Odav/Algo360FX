import { useState, useCallback, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue);
      } catch {
        console.error(`Error parsing stored value for key: ${key}`);
        return defaultValue;
      }
    }
    
    return defaultValue;
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
          if (value !== newValue) {
            setValue(newValue);
          }
        } catch {
          console.error(`Error parsing storage event value for key: ${key}`);
        }
      }
    };

    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, value, defaultValue]);

  const setValueInStorage = useCallback(
    (newValue: T | ((val: T) => T)) => {
      setValue((prev) => {
        const resolvedValue = newValue instanceof Function ? newValue(prev) : newValue;
        localStorage.setItem(key, JSON.stringify(resolvedValue));
        return resolvedValue;
      });
    },
    [key]
  );

  const removeFromStorage = useCallback(() => {
    setValue(defaultValue);
    localStorage.removeItem(key);
  }, [key, defaultValue]);

  return [value, setValueInStorage, removeFromStorage] as const;
}

// Example:
// const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
// setTheme('dark');
// removeTheme(); // Resets to default value
