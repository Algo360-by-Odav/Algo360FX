import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MonacoEditor from '@monaco-editor/react';
import { Strategy, Indicator, Rule, Signal } from '../../types/trading';
import { strategyService } from '../../services/strategy/StrategyService';
import { mlStrategyOptimizer } from '../../services/strategy/MLStrategyOptimizer';
import './StrategyBuilder.css';

interface StrategyBuilderProps {
  onSave?: (strategy: Strategy) => void;
  initialStrategy?: Strategy;
}

interface Rule {
  id: string;
  name: string;
  condition: string;
  parameters: { [key: string]: any };
}

interface Signal {
  timestamp: Date;
  type: 'ENTRY' | 'EXIT';
  direction: 'LONG' | 'SHORT';
  price: number;
  reason: string;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = observer(({
  onSave,
  initialStrategy,
}) => {
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy || {
    id: '',
    name: '',
    description: '',
    indicators: [],
    entryRules: [],
    exitRules: [],
    riskManagement: {
      stopLoss: 0,
      takeProfit: 0,
      maxDrawdown: 0,
      positionSize: 0,
    },
    parameters: {},
  });

  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [showIndicatorDialog, setShowIndicatorDialog] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(strategy);
    }
  };

  const handleAddIndicator = () => {
    setShowIndicatorDialog(true);
  };

  const handleIndicatorSave = (indicator: Indicator) => {
    setStrategy({
      ...strategy,
      indicators: [...strategy.indicators, indicator],
    });
    setShowIndicatorDialog(false);
  };

  const handleAddRule = (type: 'entry' | 'exit') => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: '',
      condition: '',
      parameters: {},
    };

    setStrategy({
      ...strategy,
      [type === 'entry' ? 'entryRules' : 'exitRules']: [
        ...(type === 'entry' ? strategy.entryRules : strategy.exitRules),
        newRule,
      ],
    });
  };

  const handleRuleChange = (
    type: 'entry' | 'exit',
    index: number,
    field: keyof Rule,
    value: any
  ) => {
    const rules = type === 'entry' ? strategy.entryRules : strategy.exitRules;
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };

    setStrategy({
      ...strategy,
      [type === 'entry' ? 'entryRules' : 'exitRules']: newRules,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const type = source.droppableId.split('-')[0];
    const rules = type === 'entry' ? strategy.entryRules : strategy.exitRules;
    const newRules = Array.from(rules);
    const [removed] = newRules.splice(source.index, 1);
    newRules.splice(destination.index, 0, removed);

    setStrategy({
      ...strategy,
      [type === 'entry' ? 'entryRules' : 'exitRules']: newRules,
    });
  };

  const renderIndicatorDialog = () => (
    <Dialog
      open={showIndicatorDialog}
      onClose={() => setShowIndicatorDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Technical Indicator</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Indicator Type</InputLabel>
              <Select
                value={selectedIndicator?.type || ''}
                onChange={(e) =>
                  setSelectedIndicator({
                    id: `indicator-${Date.now()}`,
                    type: e.target.value,
                    parameters: {},
                  })
                }
              >
                <MenuItem value="SMA">Simple Moving Average (SMA)</MenuItem>
                <MenuItem value="EMA">Exponential Moving Average (EMA)</MenuItem>
                <MenuItem value="RSI">Relative Strength Index (RSI)</MenuItem>
                <MenuItem value="MACD">MACD</MenuItem>
                <MenuItem value="BB">Bollinger Bands</MenuItem>
                <MenuItem value="STOCH">Stochastic Oscillator</MenuItem>
                <MenuItem value="ATR">Average True Range (ATR)</MenuItem>
                <MenuItem value="ADX">Average Directional Index (ADX)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {selectedIndicator && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Indicator Parameters
                  </Typography>
                  {renderIndicatorParameters(selectedIndicator)}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowIndicatorDialog(false)}>Cancel</Button>
        <Button
          onClick={() => selectedIndicator && handleIndicatorSave(selectedIndicator)}
          color="primary"
          disabled={!selectedIndicator}
        >
          Add Indicator
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderIndicatorParameters = (indicator: Indicator) => {
    switch (indicator.type) {
      case 'SMA':
      case 'EMA':
        return (
          <TextField
            fullWidth
            label="Period"
            type="number"
            value={indicator.parameters.period || ''}
            onChange={(e) =>
              setSelectedIndicator({
                ...indicator,
                parameters: { ...indicator.parameters, period: Number(e.target.value) },
              })
            }
          />
        );
      case 'RSI':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Period"
                type="number"
                value={indicator.parameters.period || ''}
                onChange={(e) =>
                  setSelectedIndicator({
                    ...indicator,
                    parameters: { ...indicator.parameters, period: Number(e.target.value) },
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Overbought Level"
                type="number"
                value={indicator.parameters.overbought || ''}
                onChange={(e) =>
                  setSelectedIndicator({
                    ...indicator,
                    parameters: { ...indicator.parameters, overbought: Number(e.target.value) },
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Oversold Level"
                type="number"
                value={indicator.parameters.oversold || ''}
                onChange={(e) =>
                  setSelectedIndicator({
                    ...indicator,
                    parameters: { ...indicator.parameters, oversold: Number(e.target.value) },
                  })
                }
              />
            </Grid>
          </Grid>
        );
      // Add more indicator parameter configurations
      default:
        return null;
    }
  };

  return (
    <Box className="strategy-builder">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Strategy Name"
                    value={strategy.name}
                    onChange={(e) =>
                      setStrategy({ ...strategy, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={strategy.description}
                    onChange={(e) =>
                      setStrategy({ ...strategy, description: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Technical Indicators</Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={handleAddIndicator}
                >
                  Add Indicator
                </Button>
              </Box>
              <Grid container spacing={2}>
                {strategy.indicators.map((indicator, index) => (
                  <Grid item xs={12} md={4} key={indicator.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">{indicator.type}</Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setStrategy({
                                ...strategy,
                                indicators: strategy.indicators.filter((_, i) => i !== index),
                              })
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {Object.entries(indicator.parameters).map(([key, value]) => (
                            `${key}: ${value}`
                          )).join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trading Rules
              </Typography>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Entry Rules
                    </Typography>
                    <Droppable droppableId="entry-rules">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="rules-container"
                        >
                          {strategy.entryRules.map((rule, index) => (
                            <Draggable
                              key={rule.id}
                              draggableId={rule.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card variant="outlined" className="rule-card">
                                    <CardContent>
                                      <TextField
                                        fullWidth
                                        label="Rule Name"
                                        value={rule.name}
                                        onChange={(e) =>
                                          handleRuleChange('entry', index, 'name', e.target.value)
                                        }
                                      />
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Condition"
                                        value={rule.condition}
                                        onChange={(e) =>
                                          handleRuleChange('entry', index, 'condition', e.target.value)
                                        }
                                        margin="normal"
                                      />
                                      <Box mt={1} display="flex" justifyContent="flex-end">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            setStrategy({
                                              ...strategy,
                                              entryRules: strategy.entryRules.filter(
                                                (_, i) => i !== index
                                              ),
                                            })
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddRule('entry')}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Add Entry Rule
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Exit Rules
                    </Typography>
                    <Droppable droppableId="exit-rules">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="rules-container"
                        >
                          {strategy.exitRules.map((rule, index) => (
                            <Draggable
                              key={rule.id}
                              draggableId={rule.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card variant="outlined" className="rule-card">
                                    <CardContent>
                                      <TextField
                                        fullWidth
                                        label="Rule Name"
                                        value={rule.name}
                                        onChange={(e) =>
                                          handleRuleChange('exit', index, 'name', e.target.value)
                                        }
                                      />
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Condition"
                                        value={rule.condition}
                                        onChange={(e) =>
                                          handleRuleChange('exit', index, 'condition', e.target.value)
                                        }
                                        margin="normal"
                                      />
                                      <Box mt={1} display="flex" justifyContent="flex-end">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            setStrategy({
                                              ...strategy,
                                              exitRules: strategy.exitRules.filter(
                                                (_, i) => i !== index
                                              ),
                                            })
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddRule('exit')}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Add Exit Rule
                    </Button>
                  </Grid>
                </Grid>
              </DragDropContext>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Stop Loss (%)"
                    type="number"
                    value={strategy.riskManagement.stopLoss}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          stopLoss: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Take Profit (%)"
                    type="number"
                    value={strategy.riskManagement.takeProfit}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          takeProfit: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Max Drawdown (%)"
                    type="number"
                    value={strategy.riskManagement.maxDrawdown}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          maxDrawdown: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Position Size (%)"
                    type="number"
                    value={strategy.riskManagement.positionSize}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          positionSize: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              startIcon={<CodeIcon />}
              onClick={() => setShowCodeEditor(true)}
              variant="outlined"
            >
              View Code
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={handleSave}
              variant="contained"
              color="primary"
            >
              Save Strategy
            </Button>
          </Box>
        </Grid>
      </Grid>

      {renderIndicatorDialog()}

      <Dialog
        open={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Strategy Code</DialogTitle>
        <DialogContent>
          <MonacoEditor
            height="600px"
            language="typescript"
            theme="vs-dark"
            value={JSON.stringify(strategy, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCodeEditor(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default StrategyBuilder;
