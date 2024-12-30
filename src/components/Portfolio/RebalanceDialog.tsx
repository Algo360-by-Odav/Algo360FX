import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { Position, RebalanceTarget } from '../../types/trading';
import { formatPercentage } from '../../utils/formatters';

interface RebalanceDialogProps {
  positions: Position[];
  onRebalance: (targets: RebalanceTarget[]) => void;
}

const RebalanceDialog: React.FC<RebalanceDialogProps> = ({
  positions,
  onRebalance,
}) => {
  const [targets, setTargets] = React.useState<RebalanceTarget[]>(
    positions.map((position) => ({
      symbol: position.symbol,
      targetWeight: position.weight,
    }))
  );

  const totalWeight = targets.reduce(
    (sum, target) => sum + target.targetWeight,
    0
  );

  const handleWeightChange = (symbol: string, weight: number) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.symbol === symbol
          ? { ...target, targetWeight: weight }
          : target
      )
    );
  };

  const handleEqualWeight = () => {
    const equalWeight = 100 / positions.length;
    setTargets((prev) =>
      prev.map((target) => ({
        ...target,
        targetWeight: equalWeight,
      }))
    );
  };

  const handleRebalance = () => {
    onRebalance(targets);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Target Weights</Typography>
            <Button variant="outlined" onClick={handleEqualWeight}>
              Equal Weight
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Current Weight</TableCell>
                  <TableCell align="right">Target Weight</TableCell>
                  <TableCell align="right">Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {targets.map((target) => {
                  const position = positions.find(
                    (p) => p.symbol === target.symbol
                  )!;
                  const weightChange = target.targetWeight - position.weight;

                  return (
                    <TableRow key={target.symbol}>
                      <TableCell>{target.symbol}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(position.weight)}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={target.targetWeight}
                          onChange={(e) =>
                            handleWeightChange(
                              target.symbol,
                              Number(e.target.value)
                            )
                          }
                          InputProps={{
                            endAdornment: '%',
                          }}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            weightChange > 0
                              ? 'success.main'
                              : weightChange < 0
                              ? 'error.main'
                              : 'inherit',
                        }}
                      >
                        {weightChange > 0 && '+'}
                        {formatPercentage(weightChange)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {totalWeight !== 100 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Total weight must equal 100%. Current total:{' '}
              {formatPercentage(totalWeight)}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleRebalance}
              disabled={totalWeight !== 100}
            >
              Rebalance Portfolio
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RebalanceDialog;
