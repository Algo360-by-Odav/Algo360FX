import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { useRootStore } from '../../stores/RootStoreContext';

const AlgoTradingWidget: React.FC = observer(() => {
  const { algoTradingStore } = useRootStore();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Algorithmic Trading Controls
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={false}
                onChange={() => {}}
                name="algoTrading"
              />
            }
            label="Enable Algo Trading"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Trading Strategy"
                value=""
                onChange={() => {}}
              >
                <MenuItem value="trend_following">Trend Following</MenuItem>
                <MenuItem value="mean_reversion">Mean Reversion</MenuItem>
                <MenuItem value="breakout">Breakout</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Risk Level"
                value="medium"
                onChange={() => {}}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Position Size (%)"
                value="1"
                onChange={() => {}}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {}}
            fullWidth
          >
            Start Trading
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {}}
            fullWidth
          >
            Stop Trading
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

export default AlgoTradingWidget;

