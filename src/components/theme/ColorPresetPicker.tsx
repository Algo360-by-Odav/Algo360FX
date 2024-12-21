import React from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useColorPreset } from '../../hooks/useColorPreset';

const ColorPresetPicker: React.FC = () => {
  const theme = useTheme();
  const { presets, currentPreset, setColorPreset } = useColorPreset();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Color Presets
      </Typography>

      <RadioGroup
        name="color-preset"
        value={currentPreset}
        onChange={(e) => setColorPreset(e.target.value as any)}
      >
        <Stack spacing={1.5}>
          {Object.entries(presets).map(([key, preset]) => (
            <FormControlLabel
              key={key}
              value={key}
              control={
                <Radio
                  sx={{
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: preset.main,
                        border: `solid 1px ${alpha(preset.main, 0.24)}`,
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: preset.main,
                        border: `solid 2px ${theme.palette.background.paper}`,
                        boxShadow: `0 0 0 1px ${preset.main}`,
                      }}
                    />
                  }
                />
              }
              label={
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {preset.name}
                </Typography>
              }
            />
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default ColorPresetPicker;
