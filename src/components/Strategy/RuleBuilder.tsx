import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Rule {
  id: string;
  indicator: string;
  condition: string;
  value: string;
  timeframe?: string;
}

const RuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      indicator: '',
      condition: '',
      value: '',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const renderIndicatorFields = (rule: Rule) => {
    switch (rule.indicator) {
      case 'MA':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={rule.timeframe || ''}
                  onChange={(e) => updateRule(rule.id, 'timeframe', e.target.value)}
                  label="Period"
                >
                  <MenuItem value="14">14</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                  <MenuItem value="200">200</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={rule.value || ''}
                  onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                  label="Type"
                >
                  <MenuItem value="SMA">Simple</MenuItem>
                  <MenuItem value="EMA">Exponential</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'RSI':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={rule.timeframe || ''}
                  onChange={(e) => updateRule(rule.id, 'timeframe', e.target.value)}
                  label="Period"
                >
                  <MenuItem value="14">14</MenuItem>
                  <MenuItem value="21">21</MenuItem>
                  <MenuItem value="28">28</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={rule.value}
                onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 'MACD':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fast Period"
                type="number"
                value={rule.value.split(',')[0] || ''}
                onChange={(e) => {
                  const [_, slow, signal] = rule.value.split(',');
                  updateRule(rule.id, 'value', `${e.target.value},${slow || ''},${signal || ''}`);
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Slow Period"
                type="number"
                value={rule.value.split(',')[1] || ''}
                onChange={(e) => {
                  const [fast, _, signal] = rule.value.split(',');
                  updateRule(rule.id, 'value', `${fast || ''},${e.target.value},${signal || ''}`);
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Signal Period"
                type="number"
                value={rule.value.split(',')[2] || ''}
                onChange={(e) => {
                  const [fast, slow] = rule.value.split(',');
                  updateRule(rule.id, 'value', `${fast || ''},${slow || ''},${e.target.value}`);
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {rules.map((rule) => (
        <Paper key={rule.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Indicator</InputLabel>
                <Select
                  value={rule.indicator}
                  onChange={(e) => updateRule(rule.id, 'indicator', e.target.value)}
                  label="Indicator"
                >
                  <MenuItem value="MA">Moving Average</MenuItem>
                  <MenuItem value="RSI">RSI</MenuItem>
                  <MenuItem value="MACD">MACD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={rule.condition}
                  onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
                  label="Condition"
                >
                  <MenuItem value="crosses_above">Crosses Above</MenuItem>
                  <MenuItem value="crosses_below">Crosses Below</MenuItem>
                  <MenuItem value="is_above">Is Above</MenuItem>
                  <MenuItem value="is_below">Is Below</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              {renderIndicatorFields(rule)}
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton onClick={() => removeRule(rule.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addRule}
        fullWidth
      >
        Add Rule
      </Button>
    </Box>
  );
};

export default RuleBuilder;
