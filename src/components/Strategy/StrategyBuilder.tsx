import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { useRootStore } from '../../stores/RootStoreContext';
import { Strategy, Rule, TimeFrame } from '../../types/trading';
import RuleBuilder from './RuleBuilder';
import BacktestResults from './BacktestResults';

interface RuleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: Rule) => void;
  initialRule?: Rule;
  type: 'entry' | 'exit';
}

const StrategyBuilder: React.FC = observer(() => {
  const theme = useTheme();
  const rootStore = useRootStore();
  const { strategyStore, backtestingStore } = rootStore;
  const [strategy, setStrategy] = React.useState<Partial<Strategy>>({
    name: '',
    description: '',
    symbol: 'EUR/USD',
    timeframe: '1H',
    entryRules: [],
    exitRules: [],
    riskManagement: {
      riskPerTrade: 1,
      maxDrawdown: 10,
      maxPositions: 1,
    },
  });
  const [ruleDialogOpen, setRuleDialogOpen] = React.useState(false);
  const [ruleType, setRuleType] = React.useState<'entry' | 'exit'>('entry');
  const [selectedRule, setSelectedRule] = React.useState<Rule | null>(null);
  const [backtestResults, setBacktestResults] = React.useState(null);
  const [isBacktesting, setIsBacktesting] = React.useState(false);

  const handleAddRule = (type: 'entry' | 'exit') => {
    setRuleType(type);
    setSelectedRule(null);
    setRuleDialogOpen(true);
  };

  const handleEditRule = (rule: Rule, type: 'entry' | 'exit') => {
    setRuleType(type);
    setSelectedRule(rule);
    setRuleDialogOpen(true);
  };

  const handleSaveRule = (rule: Rule) => {
    if (selectedRule) {
      // Edit existing rule
      const rules = ruleType === 'entry' ? strategy.entryRules : strategy.exitRules;
      const index = rules?.findIndex((r) => r.id === selectedRule.id) || 0;
      const newRules = [...(rules || [])];
      newRules[index] = rule;
      setStrategy((prev) => ({
        ...prev,
        [ruleType === 'entry' ? 'entryRules' : 'exitRules']: newRules,
      }));
    } else {
      // Add new rule
      setStrategy((prev) => ({
        ...prev,
        [ruleType === 'entry' ? 'entryRules' : 'exitRules']: [
          ...(ruleType === 'entry' ? prev.entryRules : prev.exitRules) || [],
          rule,
        ],
      }));
    }
    setRuleDialogOpen(false);
  };

  const handleDeleteRule = (ruleId: string, type: 'entry' | 'exit') => {
    const rules = type === 'entry' ? strategy.entryRules : strategy.exitRules;
    const newRules = rules?.filter((rule) => rule.id !== ruleId);
    setStrategy((prev) => ({
      ...prev,
      [type === 'entry' ? 'entryRules' : 'exitRules']: newRules,
    }));
  };

  const handleSaveStrategy = async () => {
    try {
      await strategyStore.saveStrategy(strategy as Strategy);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to save strategy:', error);
    }
  };

  const handleBacktest = async () => {
    setIsBacktesting(true);
    try {
      const results = await backtestingStore.runBacktest(strategy as Strategy);
      setBacktestResults(results);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsBacktesting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Strategy Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strategy Configuration
            </Typography>

            <TextField
              fullWidth
              label="Strategy Name"
              value={strategy.name}
              onChange={(e) =>
                setStrategy((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={strategy.description}
              onChange={(e) =>
                setStrategy((prev) => ({ ...prev, description: e.target.value }))
              }
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={strategy.symbol}
                    label="Symbol"
                    onChange={(e) =>
                      setStrategy((prev) => ({
                        ...prev,
                        symbol: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                    <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                    <MenuItem value="USD/JPY">USD/JPY</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={strategy.timeframe}
                    label="Timeframe"
                    onChange={(e) =>
                      setStrategy((prev) => ({
                        ...prev,
                        timeframe: e.target.value as TimeFrame,
                      }))
                    }
                  >
                    <MenuItem value="1m">1 Minute</MenuItem>
                    <MenuItem value="5m">5 Minutes</MenuItem>
                    <MenuItem value="15m">15 Minutes</MenuItem>
                    <MenuItem value="1H">1 Hour</MenuItem>
                    <MenuItem value="4H">4 Hours</MenuItem>
                    <MenuItem value="1D">1 Day</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Risk Management Settings */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Risk Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Risk per Trade %"
                    value={strategy.riskManagement?.riskPerTrade}
                    onChange={(e) =>
                      setStrategy((prev) => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement!,
                          riskPerTrade: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Drawdown %"
                    value={strategy.riskManagement?.maxDrawdown}
                    onChange={(e) =>
                      setStrategy((prev) => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement!,
                          maxDrawdown: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Positions"
                    value={strategy.riskManagement?.maxPositions}
                    onChange={(e) =>
                      setStrategy((prev) => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement!,
                          maxPositions: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Rules Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Trading Rules</Typography>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddRule('entry')}
                  sx={{ mr: 1 }}
                >
                  Add Entry Rule
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddRule('exit')}
                >
                  Add Exit Rule
                </Button>
              </Box>
            </Box>

            {/* Entry Rules */}
            <Typography variant="subtitle1" gutterBottom>
              Entry Rules
            </Typography>
            <List>
              {strategy.entryRules?.map((rule) => (
                <ListItem key={rule.id}>
                  <ListItemText
                    primary={rule.name}
                    secondary={rule.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEditRule(rule, 'entry')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule(rule.id, 'entry')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Exit Rules */}
            <Typography variant="subtitle1" gutterBottom>
              Exit Rules
            </Typography>
            <List>
              {strategy.exitRules?.map((rule) => (
                <ListItem key={rule.id}>
                  <ListItemText
                    primary={rule.name}
                    secondary={rule.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEditRule(rule, 'exit')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule(rule.id, 'exit')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => {/* Open optimization dialog */}}
            >
              Optimize
            </Button>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleBacktest}
              disabled={isBacktesting}
            >
              Run Backtest
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveStrategy}
              color="primary"
            >
              Save Strategy
            </Button>
          </Box>
        </Grid>

        {/* Backtest Results */}
        {backtestResults && (
          <Grid item xs={12}>
            <BacktestResults results={backtestResults} />
          </Grid>
        )}
      </Grid>

      {/* Rule Builder Dialog */}
      <Dialog
        open={ruleDialogOpen}
        onClose={() => setRuleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRule ? 'Edit' : 'Add'} {ruleType} Rule
        </DialogTitle>
        <DialogContent>
          <RuleBuilder
            initialRule={selectedRule}
            onSave={handleSaveRule}
            type={ruleType}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
});

export default StrategyBuilder;
