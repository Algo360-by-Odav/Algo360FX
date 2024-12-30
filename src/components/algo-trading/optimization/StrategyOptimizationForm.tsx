import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  OptimizationConfig,
  OptimizationMethod,
  OptimizationObjective,
  OptimizationParameter,
} from '../../../types/optimization';
import ParameterInput from './ParameterInput';

interface StrategyOptimizationFormProps {
  onSubmit: (config: OptimizationConfig) => void;
  isLoading: boolean;
}

const StrategyOptimizationForm: React.FC<StrategyOptimizationFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [method, setMethod] = useState<OptimizationMethod>(OptimizationMethod.GeneticAlgorithm);
  const [objective, setObjective] = useState<OptimizationObjective>(OptimizationObjective.SharpeRatio);
  const [parameters, setParameters] = useState<OptimizationParameter[]>([
    {
      name: 'stopLoss',
      min: 10,
      max: 100,
      step: 5,
      current: 50,
    },
    {
      name: 'takeProfit',
      min: 20,
      max: 200,
      step: 10,
      current: 100,
    },
  ]);

  const [populationSize, setPopulationSize] = useState(50);
  const [generations, setGenerations] = useState(100);
  const [crossoverRate, setCrossoverRate] = useState(0.8);
  const [mutationRate, setMutationRate] = useState(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      method,
      objective,
      parameters,
      geneticConfig: {
        populationSize,
        generations,
        crossoverRate,
        mutationRate,
      },
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Strategy Optimization
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Method Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Optimization Method</FormLabel>
              <RadioGroup
                value={method}
                onChange={(e) => setMethod(e.target.value as OptimizationMethod)}
              >
                <FormControlLabel
                  value={OptimizationMethod.GeneticAlgorithm}
                  control={<Radio />}
                  label="Genetic Algorithm"
                />
                <FormControlLabel
                  value={OptimizationMethod.GridSearch}
                  control={<Radio />}
                  label="Grid Search"
                />
                <FormControlLabel
                  value={OptimizationMethod.ParticleSwarm}
                  control={<Radio />}
                  label="Particle Swarm"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Objective Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Optimization Objective</FormLabel>
              <Select
                value={objective}
                onChange={(e) => setObjective(e.target.value as OptimizationObjective)}
              >
                <MenuItem value={OptimizationObjective.SharpeRatio}>Sharpe Ratio</MenuItem>
                <MenuItem value={OptimizationObjective.Returns}>Returns</MenuItem>
                <MenuItem value={OptimizationObjective.DrawdownAdjustedReturns}>
                  Drawdown-Adjusted Returns
                </MenuItem>
                <MenuItem value={OptimizationObjective.ProfitFactor}>Profit Factor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Parameters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Parameters
            </Typography>
            <Grid container spacing={2}>
              {parameters.map((param, index) => (
                <Grid item xs={12} sm={6} key={param.name}>
                  <ParameterInput parameter={param} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Genetic Algorithm Configuration */}
          {method === OptimizationMethod.GeneticAlgorithm && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Genetic Algorithm Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Population Size"
                    type="number"
                    value={populationSize}
                    onChange={(e) => setPopulationSize(Number(e.target.value))}
                    inputProps={{ min: 10, max: 1000 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Generations"
                    type="number"
                    value={generations}
                    onChange={(e) => setGenerations(Number(e.target.value))}
                    inputProps={{ min: 10, max: 1000 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Crossover Rate"
                    type="number"
                    value={crossoverRate}
                    onChange={(e) => setCrossoverRate(Number(e.target.value))}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mutation Rate"
                    type="number"
                    value={mutationRate}
                    onChange={(e) => setMutationRate(Number(e.target.value))}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Optimizing...' : 'Start Optimization'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StrategyOptimizationForm;
