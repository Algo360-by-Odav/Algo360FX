import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Tooltip,
  List,
  ListItem,
} from '@mui/material';
import {
  Add as AddIcon,
  ShowChart as ChartIcon,
  Timeline as TimelineIcon,
  Functions as IndicatorIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/stores/RootStoreContext';

interface IndicatorParams {
  type: string;
  params: Record<string, number>;
}

const defaultParams: Record<string, Record<string, number>> = {
  sma: { period: 20 },
  ema: { period: 20 },
  rsi: { period: 14 },
  macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  bollinger: { period: 20, stdDev: 2 },
};

const indicators = [
  {
    type: 'ma',
    name: 'Moving Average',
    description: 'Simple Moving Average (SMA)',
    icon: <TimelineIcon />,
  },
  {
    type: 'rsi',
    name: 'RSI',
    description: 'Relative Strength Index',
    icon: <IndicatorIcon />,
  },
  {
    type: 'macd',
    name: 'MACD',
    description: 'Moving Average Convergence Divergence',
    icon: <CalculateIcon />,
  },
];

interface IndicatorSelectorProps {
  open: boolean;
  onClose: () => void;
  onAdd: (indicatorType: string) => void;
}

const IndicatorSelectorDialog: React.FC<IndicatorSelectorProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Indicator</DialogTitle>
      <DialogContent>
        <List>
          {indicators.map((indicator) => (
            <ListItem
              key={indicator.type}
              button
              onClick={() => {
                onAdd(indicator.type);
                onClose();
              }}
            >
              <ListItemIcon>{indicator.icon}</ListItemIcon>
              <ListItemText
                primary={indicator.name}
                secondary={indicator.description}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const IndicatorSelector: React.FC = observer(() => {
  const { marketStore } = useRootStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedIndicator, setSelectedIndicator] = React.useState<string>('');
  const [params, setParams] = React.useState<Record<string, number>>({});

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIndicatorSelect = (type: string) => {
    setSelectedIndicator(type);
    setParams(defaultParams[type]);
    handleClose();
    setDialogOpen(true);
  };

  const handleParamChange = (param: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [param]: Number(value),
    }));
  };

  const handleAddIndicator = () => {
    marketStore.addIndicator({
      type: selectedIndicator,
      params,
    });
    setDialogOpen(false);
  };

  const handleAddIndicatorFromDialog = (type: string) => {
    marketStore.addIndicator({
      type,
      params: defaultParams[type],
    });
  };

  return (
    <>
      <Tooltip title="Add Indicator">
        <IconButton onClick={handleClick} size="small">
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleIndicatorSelect('sma')}>
          <ListItemIcon>
            <TimelineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Simple Moving Average</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleIndicatorSelect('ema')}>
          <ListItemIcon>
            <ChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exponential Moving Average</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleIndicatorSelect('rsi')}>
          <ListItemIcon>
            <IndicatorIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Relative Strength Index</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleIndicatorSelect('macd')}>
          <ListItemIcon>
            <TrendingUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>MACD</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleIndicatorSelect('bollinger')}>
          <ListItemIcon>
            <ChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bollinger Bands</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setDialogOpen(true)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Indicator from Dialog</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Configure {selectedIndicator?.toUpperCase()} Parameters
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {Object.entries(params).map(([param, value]) => (
              <TextField
                key={param}
                fullWidth
                label={param.charAt(0).toUpperCase() + param.slice(1)}
                type="number"
                value={value}
                onChange={(e) => handleParamChange(param, e.target.value)}
                sx={{ mb: 2 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddIndicator} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <IndicatorSelectorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddIndicatorFromDialog}
      />
    </>
  );
});

export default IndicatorSelector;
