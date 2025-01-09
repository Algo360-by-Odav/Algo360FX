import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { useStore } from '@/context/StoreContext';

interface Indicator {
  id: string;
  name: string;
  type: string;
  period: number;
}

const TradingIndicators: React.FC = () => {
  const { tradingStore } = useStore();

  const handleRemoveIndicator = (indicatorId: string) => {
    tradingStore.removeIndicator(indicatorId);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Active Indicators
      </Typography>
      <List>
        {tradingStore.indicators.map((indicator: Indicator) => (
          <ListItem
            key={indicator.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveIndicator(indicator.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={indicator.name}
              secondary={`Type: ${indicator.type}, Period: ${indicator.period}`}
            />
          </ListItem>
        ))}
        {tradingStore.indicators.length === 0 && (
          <ListItem>
            <ListItemText primary="No active indicators" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default TradingIndicators;
