import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Tab,
  Tabs,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Code as CodeIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ReactMarkdown from 'react-markdown';

interface MarketCondition {
  type: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

interface StrategyDoc {
  id: string;
  name: string;
  version: string;
  description: string;
  logic: string;
  parameters: Array<{
    name: string;
    type: string;
    default: string;
    description: string;
  }>;
  marketConditions: MarketCondition[];
  limitations: string[];
  setup: string;
  lastUpdated: string;
}

const StrategyDocumentationWidget: React.FC = observer(() => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [editContent, setEditContent] = useState('');

  const [strategy, setStrategy] = useState<StrategyDoc>({
    id: '1',
    name: 'Trend Following Strategy',
    version: '2.1.0',
    description: `# Trend Following Strategy
    
This strategy is designed to identify and follow medium to long-term market trends using multiple technical indicators and price action analysis.

## Key Features
- Multiple timeframe analysis
- Dynamic position sizing
- Automated trend detection
- Risk-adjusted position management`,
    logic: `## Trading Logic

1. **Trend Identification**
   - Uses 200 EMA for primary trend
   - 50 EMA for secondary trend confirmation
   - RSI for momentum confirmation

2. **Entry Conditions**
   - Price above/below both EMAs
   - RSI showing momentum in trend direction
   - Volume confirmation

3. **Exit Strategy**
   - Trailing stop loss
   - Take profit at key resistance/support levels
   - RSI divergence exit signals`,
    parameters: [
      {
        name: 'EMAPeriod',
        type: 'integer',
        default: '200',
        description: 'Primary trend EMA period',
      },
      {
        name: 'RSIPeriod',
        type: 'integer',
        default: '14',
        description: 'RSI calculation period',
      },
      {
        name: 'StopLoss',
        type: 'double',
        default: '50',
        description: 'Initial stop loss in pips',
      },
    ],
    marketConditions: [
      {
        type: 'Trending Market',
        description: 'Strong directional movement with clear higher highs/lower lows',
        importance: 'high',
      },
      {
        type: 'High Volume',
        description: 'Above average market volume for reliable signals',
        importance: 'medium',
      },
      {
        type: 'Low Volatility',
        description: 'Stable market conditions for better trend following',
        importance: 'medium',
      },
    ],
    limitations: [
      'Poor performance in ranging markets',
      'Requires significant price movement for profitability',
      'May experience larger drawdowns during trend reversals',
      'Not suitable for high-frequency trading',
    ],
    setup: `## Setup Instructions

1. **Installation**
   - Copy strategy files to MT5 directory
   - Restart MetaTrader 5
   - Enable AutoTrading

2. **Configuration**
   - Set default parameters
   - Configure risk management settings
   - Set up notifications

3. **Testing**
   - Run strategy on demo account first
   - Monitor performance for at least 1 month
   - Adjust parameters as needed`,
    lastUpdated: '2024-12-15',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleEdit = (section: string, content: string) => {
    setSelectedSection(section);
    setEditContent(content);
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    setStrategy({
      ...strategy,
      [selectedSection.toLowerCase()]: editContent,
    });
    setEditDialogOpen(false);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0: // Overview
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Strategy Overview
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('description', strategy.description)}
              >
                Edit
              </Button>
            </Box>
            <Paper sx={{ p: 2 }}>
              <ReactMarkdown>{strategy.description}</ReactMarkdown>
            </Paper>
          </Box>
        );

      case 1: // Trading Logic
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Trading Logic
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('logic', strategy.logic)}
              >
                Edit
              </Button>
            </Box>
            <Paper sx={{ p: 2 }}>
              <ReactMarkdown>{strategy.logic}</ReactMarkdown>
            </Paper>
          </Box>
        );

      case 2: // Parameters
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Strategy Parameters
            </Typography>
            <List>
              {strategy.parameters.map((param, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">{param.name}</Typography>
                        <Chip
                          label={param.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`Default: ${param.default}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={param.description}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 3: // Market Conditions
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Required Market Conditions
            </Typography>
            <Grid container spacing={2}>
              {strategy.marketConditions.map((condition, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {condition.type}
                    </Typography>
                    <Chip
                      label={condition.importance.toUpperCase()}
                      color={
                        condition.importance === 'high'
                          ? 'error'
                          : condition.importance === 'medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2">
                      {condition.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 4: // Limitations
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Known Limitations
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('limitations', strategy.limitations.join('\n'))}
              >
                Edit
              </Button>
            </Box>
            <List>
              {strategy.limitations.map((limitation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={limitation} />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 5: // Setup
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Setup Instructions
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit('setup', strategy.setup)}
              >
                Edit
              </Button>
            </Box>
            <Paper sx={{ p: 2 }}>
              <ReactMarkdown>{strategy.setup}</ReactMarkdown>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6">
              {strategy.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Version {strategy.version} • Last updated: {strategy.lastUpdated}
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<DescriptionIcon />} label="Overview" />
          <Tab icon={<CodeIcon />} label="Logic" />
          <Tab icon={<SettingsIcon />} label="Parameters" />
          <Tab icon={<TimelineIcon />} label="Market Conditions" />
          <Tab icon={<WarningIcon />} label="Limitations" />
          <Tab icon={<DescriptionIcon />} label="Setup" />
        </Tabs>

        {renderContent()}

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit {selectedSection}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default StrategyDocumentationWidget;
