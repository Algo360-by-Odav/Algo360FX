import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  PlayArrow as TestIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { MonacoEditor } from '../Common/MonacoEditor';

interface Indicator {
  id: string;
  name: string;
  description: string;
  formula: string;
  parameters: {
    name: string;
    type: 'number' | 'boolean' | 'string';
    defaultValue: any;
  }[];
  plotType: 'line' | 'histogram' | 'dots' | 'columns';
  color: string;
}

const IndicatorBuilder: React.FC = observer(() => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [currentIndicator, setCurrentIndicator] = useState<Indicator | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const defaultIndicator: Indicator = {
    id: '',
    name: '',
    description: '',
    formula: '',
    parameters: [],
    plotType: 'line',
    color: '#1976d2',
  };

  const handleCreateNew = () => {
    setCurrentIndicator({
      ...defaultIndicator,
      id: Math.random().toString(36).substr(2, 9),
    });
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!currentIndicator) return;

    try {
      // Validate formula
      const isValid = await validateFormula(currentIndicator.formula);
      if (!isValid) {
        throw new Error('Invalid formula syntax');
      }

      const updatedIndicators = indicators.filter(
        (ind) => ind.id !== currentIndicator.id
      );
      setIndicators([...updatedIndicators, currentIndicator]);
      setIsEditorOpen(false);
    } catch (error) {
      console.error('Error saving indicator:', error);
      // Show error notification
    }
  };

  const handleTest = async () => {
    if (!currentIndicator) return;

    try {
      const results = await testIndicator(currentIndicator);
      setTestResults(results);
    } catch (error) {
      console.error('Error testing indicator:', error);
      // Show error notification
    }
  };

  const validateFormula = async (formula: string): Promise<boolean> => {
    // Add formula validation logic here
    return true;
  };

  const testIndicator = async (indicator: Indicator): Promise<any> => {
    // Add indicator testing logic here
    return null;
  };

  const handleAddParameter = () => {
    if (!currentIndicator) return;

    setCurrentIndicator({
      ...currentIndicator,
      parameters: [
        ...currentIndicator.parameters,
        {
          name: 'parameter' + (currentIndicator.parameters.length + 1),
          type: 'number',
          defaultValue: 0,
        },
      ],
    });
  };

  const handleRemoveParameter = (index: number) => {
    if (!currentIndicator) return;

    const updatedParameters = [...currentIndicator.parameters];
    updatedParameters.splice(index, 1);
    setCurrentIndicator({
      ...currentIndicator,
      parameters: updatedParameters,
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Custom Indicator Builder</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Indicator
        </Button>
      </Box>

      <Grid container spacing={3}>
        {indicators.map((indicator) => (
          <Grid item xs={12} md={4} key={indicator.id}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{indicator.name}</Typography>
                <IconButton
                  onClick={() => {
                    setCurrentIndicator(indicator);
                    setIsEditorOpen(true);
                  }}
                >
                  <CodeIcon />
                </IconButton>
              </Box>
              <Typography color="textSecondary" paragraph>
                {indicator.description}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {indicator.parameters.map((param) => (
                  <Chip
                    key={param.name}
                    label={`${param.name}: ${param.defaultValue}`}
                    size="small"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentIndicator?.name || 'New Indicator'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={currentIndicator?.name || ''}
                onChange={(e) =>
                  setCurrentIndicator(
                    currentIndicator
                      ? { ...currentIndicator, name: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={currentIndicator?.description || ''}
                onChange={(e) =>
                  setCurrentIndicator(
                    currentIndicator
                      ? { ...currentIndicator, description: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1">Parameters</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddParameter}
                  size="small"
                >
                  Add Parameter
                </Button>
              </Box>
              {currentIndicator?.parameters.map((param, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap={2}
                  alignItems="center"
                  mb={2}
                >
                  <TextField
                    label="Name"
                    size="small"
                    value={param.name}
                    onChange={(e) => {
                      const updatedParams = [...currentIndicator.parameters];
                      updatedParams[index] = {
                        ...param,
                        name: e.target.value,
                      };
                      setCurrentIndicator({
                        ...currentIndicator,
                        parameters: updatedParams,
                      });
                    }}
                  />
                  <FormControl size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={param.type}
                      label="Type"
                      onChange={(e) => {
                        const updatedParams = [...currentIndicator.parameters];
                        updatedParams[index] = {
                          ...param,
                          type: e.target.value as any,
                        };
                        setCurrentIndicator({
                          ...currentIndicator,
                          parameters: updatedParams,
                        });
                      }}
                    >
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                      <MenuItem value="string">String</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Default Value"
                    size="small"
                    value={param.defaultValue}
                    onChange={(e) => {
                      const updatedParams = [...currentIndicator.parameters];
                      updatedParams[index] = {
                        ...param,
                        defaultValue: e.target.value,
                      };
                      setCurrentIndicator({
                        ...currentIndicator,
                        parameters: updatedParams,
                      });
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveParameter(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Formula
              </Typography>
              <MonacoEditor
                height="300px"
                language="typescript"
                value={currentIndicator?.formula || ''}
                onChange={(value) =>
                  setCurrentIndicator(
                    currentIndicator
                      ? { ...currentIndicator, formula: value }
                      : null
                  )
                }
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Plot Type</InputLabel>
                <Select
                  value={currentIndicator?.plotType || 'line'}
                  label="Plot Type"
                  onChange={(e) =>
                    setCurrentIndicator(
                      currentIndicator
                        ? {
                            ...currentIndicator,
                            plotType: e.target.value as any,
                          }
                        : null
                    )
                  }
                >
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="histogram">Histogram</MenuItem>
                  <MenuItem value="dots">Dots</MenuItem>
                  <MenuItem value="columns">Columns</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditorOpen(false)}>Cancel</Button>
          <Button
            startIcon={<TestIcon />}
            onClick={handleTest}
            color="info"
          >
            Test
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default IndicatorBuilder;
