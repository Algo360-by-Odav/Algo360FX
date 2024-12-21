import React from 'react';
import {
  IconButton,
  Tooltip,
  Popover,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  GridOn as GridIcon,
  ShowChart as VolumeIcon,
  Add as AddIcon,
  Edit as DrawIcon,
  Clear as ClearIcon,
  Crosshairs as CrosshairIcon,
  Info as LegendIcon,
} from '@mui/icons-material';
import { ChartSettings } from '../../../types/trading';

interface ChartControlsProps {
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
  onIndicatorAdd: () => void;
  onClearDrawings: () => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  settings,
  onSettingsChange,
  onIndicatorAdd,
  onClearDrawings,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingChange = (key: keyof ChartSettings) => {
    onSettingsChange({ [key]: !settings[key] });
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Tooltip title="Chart Settings">
          <IconButton onClick={handleClick} size="small">
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Indicator">
          <IconButton onClick={onIndicatorAdd} size="small">
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={settings.drawingMode ? "Exit Drawing Mode" : "Enter Drawing Mode"}>
          <IconButton 
            onClick={() => onSettingsChange({ drawingMode: !settings.drawingMode })}
            color={settings.drawingMode ? "primary" : "default"}
            size="small"
          >
            <DrawIcon />
          </IconButton>
        </Tooltip>

        {settings.drawingMode && (
          <Tooltip title="Clear Drawings">
            <IconButton onClick={onClearDrawings} size="small">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ width: 250 }}>
          <ListItem>
            <ListItemIcon>
              <GridIcon />
            </ListItemIcon>
            <ListItemText primary="Show Grid" />
            <Switch
              edge="end"
              checked={settings.showGrid}
              onChange={() => handleSettingChange('showGrid')}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <VolumeIcon />
            </ListItemIcon>
            <ListItemText primary="Show Volume" />
            <Switch
              edge="end"
              checked={settings.showVolume}
              onChange={() => handleSettingChange('showVolume')}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CrosshairIcon />
            </ListItemIcon>
            <ListItemText primary="Show Crosshair" />
            <Switch
              edge="end"
              checked={settings.showCrosshair}
              onChange={() => handleSettingChange('showCrosshair')}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <LegendIcon />
            </ListItemIcon>
            <ListItemText primary="Show Legend" />
            <Switch
              edge="end"
              checked={settings.showLegend}
              onChange={() => handleSettingChange('showLegend')}
            />
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default ChartControls;
