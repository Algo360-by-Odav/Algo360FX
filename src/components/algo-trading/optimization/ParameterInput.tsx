import React from 'react';
import { TextField, Box, Typography, Slider } from '@mui/material';
import { OptimizationParameter } from '../../../types/optimization';

interface ParameterInputProps {
  parameter: OptimizationParameter;
}

const ParameterInput: React.FC<ParameterInputProps> = ({ parameter }) => {
  return (
    <Box>
      <Typography gutterBottom>{parameter.name}</Typography>
      <Slider
        value={parameter.current}
        min={parameter.min}
        max={parameter.max}
        step={parameter.step}
        valueLabelDisplay="auto"
        marks={[
          { value: parameter.min, label: parameter.min.toString() },
          { value: parameter.max, label: parameter.max.toString() },
        ]}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          size="small"
          label="Min"
          type="number"
          value={parameter.min}
          inputProps={{
            step: parameter.step,
          }}
        />
        <TextField
          size="small"
          label="Max"
          type="number"
          value={parameter.max}
          inputProps={{
            step: parameter.step,
          }}
        />
        <TextField
          size="small"
          label="Step"
          type="number"
          value={parameter.step}
          inputProps={{
            step: 0.0001,
            min: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default ParameterInput;
