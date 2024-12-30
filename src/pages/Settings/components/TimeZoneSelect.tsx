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

const timeZones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Australia/Sydney',
  'Pacific/Auckland',
].sort();

const TimeZoneSelect: React.FC = observer(() => {
  const { settingsStore } = useRootStore();

  const handleChange = (event: SelectChangeEvent<string>) => {
    settingsStore.updateSettings({ timeZone: event.target.value });
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Time Zone</InputLabel>
      <Select
        value={settingsStore.settings.timeZone || 'UTC'}
        onChange={handleChange}
        label="Time Zone"
      >
        {timeZones.map((zone) => (
          <MenuItem key={zone} value={zone}>
            {zone.replace('_', ' ')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default TimeZoneSelect;
