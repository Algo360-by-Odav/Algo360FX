import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../hooks/useRootStore';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
].sort((a, b) => a.name.localeCompare(b.name));

const LanguageSelect: React.FC = observer(() => {
  const { settingsStore } = useRootStore();

  const handleChange = (event: SelectChangeEvent<string>) => {
    settingsStore.updateSettings({ language: event.target.value });
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Language</InputLabel>
      <Select
        value={settingsStore.language || 'en'}
        onChange={handleChange}
        label="Language"
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default LanguageSelect;
