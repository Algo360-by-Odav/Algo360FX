import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Code,
  PlayArrow,
  Stop,
  Save,
  Delete,
  ExpandMore,
  Add,
  RemoveCircle,
  Settings,
  Timeline,
  ShowChart,
  Warning,
} from '@mui/icons-material';
import MonacoEditor from '@monaco-editor/react';
import './BotCreation.css';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'technical' | 'fundamental' | 'hybrid';
  parameters: Parameter[];
  code: string;
}

interface Parameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
}

const BotCreation: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [customCode, setCustomCode] = useState('');

  const steps = [
    'Basic Information',
    'Strategy Selection',
    'Parameters',
    'Risk Management',
    'Testing & Deployment',
  ];

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Moving Average Crossover',
      description: 'Trade based on crossovers of two moving averages',
      type: 'technical',
      parameters: [
        {
          id: '1',
          name: 'Fast MA Period',
          type: 'number',
          value: 10,
          min: 1,
          max: 200,
        },
        {
          id: '2',
          name: 'Slow MA Period',
          type: 'number',
          value: 20,
          min: 1,
          max: 200,
        },
      ],
      code: `// Moving Average Crossover Strategy
function onTick(data) {
  const fastMA = calculateMA(data, fastPeriod);
  const slowMA = calculateMA(data, slowPeriod);
  
  if (fastMA > slowMA && !position) {
    buy();
  } else if (fastMA < slowMA && position) {
    sell();
  }
}`,
    },
    {
      id: '2',
      name: 'RSI with Trend',
      description: 'Combine RSI with trend detection for better entries',
      type: 'technical',
      parameters: [
        {
          id: '1',
          name: 'RSI Period',
          type: 'number',
          value: 14,
          min: 1,
          max: 100,
        },
        {
          id: '2',
          name: 'Overbought Level',
          type: 'number',
          value: 70,
          min: 50,
          max: 100,
        },
        {
          id: '3',
          name: 'Oversold Level',
          type: 'number',
          value: 30,
          min: 0,
          max: 50,
        },
      ],
      code: `// RSI with Trend Strategy
function onTick(data) {
  const rsi = calculateRSI(data, period);
  const trend = detectTrend(data);
  
  if (rsi < oversoldLevel && trend === 'up') {
    buy();
  } else if (rsi > overboughtLevel && trend === 'down') {
    sell();
  }
}`,
    },
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setParameters(strategy.parameters);
  };

  const handleParameterChange = (parameterId: string, value: any) => {
    setParameters(
      parameters.map((param) =>
        param.id === parameterId ? { ...param, value } : param
      )
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <TextField
              fullWidth
              label="Bot Name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Grid container spacing={2}>
              {strategies.map((strategy) => (
                <Grid item xs={12} md={6} key={strategy.id}>
                  <Card
                    className={`strategy-card ${
                      selectedStrategy?.id === strategy.id ? 'selected' : ''
                    }`}
                    onClick={() => handleStrategySelect(strategy)}
                  >
                    <CardContent>
                      <Typography variant="h6">{strategy.name}</Typography>
                      <Chip
                        label={strategy.type}
                        size="small"
                        className={`strategy-type ${strategy.type}`}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {strategy.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            {parameters.map((param) => (
              <Box key={param.id} className="parameter-item">
                <Typography variant="subtitle1">{param.name}</Typography>
                {param.type === 'number' ? (
                  <Box className="parameter-slider">
                    <Slider
                      value={param.value}
                      onChange={(e, value) =>
                        handleParameterChange(param.id, value)
                      }
                      min={param.min}
                      max={param.max}
                      valueLabelDisplay="auto"
                    />
                    <TextField
                      type="number"
                      value={param.value}
                      onChange={(e) =>
                        handleParameterChange(param.id, Number(e.target.value))
                      }
                      size="small"
                    />
                  </Box>
                ) : param.type === 'select' ? (
                  <FormControl fullWidth>
                    <Select
                      value={param.value}
                      onChange={(e) =>
                        handleParameterChange(param.id, e.target.value)
                      }
                    >
                      {param.options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    value={param.value}
                    onChange={(e) =>
                      handleParameterChange(param.id, e.target.value)
                    }
                  />
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<Code />}
              onClick={() => setShowCode(true)}
              sx={{ mt: 2 }}
            >
              View Strategy Code
            </Button>
          </Box>
        );

      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h6">Risk Management Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">Position Size</Typography>
                    <TextField
                      fullWidth
                      label="Max Position Size (%)"
                      type="number"
                      defaultValue={5}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Max Open Positions"
                      type="number"
                      defaultValue={3}
                      margin="normal"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">Stop Loss/Take Profit</Typography>
                    <TextField
                      fullWidth
                      label="Stop Loss (%)"
                      type="number"
                      defaultValue={2}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Take Profit (%)"
                      type="number"
                      defaultValue={6}
                      margin="normal"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box className="step-content">
            <Typography variant="h6">Testing & Deployment</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">Backtesting</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isBacktesting}
                          onChange={(e) => setIsBacktesting(e.target.checked)}
                        />
                      }
                      label="Run Backtest"
                    />
                    {isBacktesting && (
                      <>
                        <TextField
                          fullWidth
                          label="Start Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="End Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          margin="normal"
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">Deployment</Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Trading Account</InputLabel>
                      <Select defaultValue="">
                        <MenuItem value="demo">Demo Account</MenuItem>
                        <MenuItem value="live">Live Account</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Trading Pairs</InputLabel>
                      <Select multiple defaultValue={[]}>
                        <MenuItem value="EURUSD">EUR/USD</MenuItem>
                        <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                        <MenuItem value="USDJPY">USD/JPY</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bot-creation">
      <Box className="header">
        <Typography variant="h5">Create Trading Bot</Typography>
        <Box className="header-actions">
          <Button startIcon={<Save />}>Save Draft</Button>
          <Button startIcon={<PlayArrow />} variant="contained">
            Deploy Bot
          </Button>
        </Box>
      </Box>

      <Stepper activeStep={activeStep} className="stepper">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper className="content">
        {renderStepContent(activeStep)}
        <Box className="actions">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showCode}
        onClose={() => setShowCode(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Strategy Code</DialogTitle>
        <DialogContent>
          <MonacoEditor
            height="400px"
            language="javascript"
            theme="vs-dark"
            value={selectedStrategy?.code || ''}
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCode(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BotCreation;
