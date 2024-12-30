import React from 'react';
import {
  Box,
  Drawer,
  Stack,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { Settings, Close } from '@mui/icons-material';
import ThemeSwitch from './ThemeSwitch';
import ColorPresetPicker from './ColorPresetPicker';
import ResponsiveStack from './ResponsiveStack';

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ open, onClose, onOpen }) => {
  const theme = useTheme();

  return (
    <>
      <IconButton
        color="inherit"
        onClick={onOpen}
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
          width: 48,
          height: 48,
          boxShadow: theme.customShadows.primary,
        }}
      >
        <Settings />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2.5 }}
        >
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider />

        <Stack spacing={3} sx={{ p: 2.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Mode
            </Typography>
            <ThemeSwitch />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Presets
            </Typography>
            <ColorPresetPicker />
          </Box>
        </Stack>
      </Drawer>
    </>
  );
};

export default ThemeSettings;
