import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import { Stock } from '../../stores/StockMarketStore';

interface ScreeningCriteria {
  id: string;
  category: string;
  metric: string;
  operator: string;
  value: number;
}

interface SavedScreen {
  id: string;
  name: string;
  criteria: ScreeningCriteria[];
}

const MarketScreener: React.FC = observer(() => {
  const { stockMarketStore } = useRootStore();
  const [criteria, setCriteria] = useState<ScreeningCriteria[]>([
    {
      id: '1',
      category: 'Fundamental',
      metric: 'P/E Ratio',
      operator: '<',
      value: 20,
    },
  ]);

  const [savedScreens] = useState<SavedScreen[]>([
    {
      id: '1',
      name: 'Value Stocks',
      criteria: [
        { id: '1', category: 'Fundamental', metric: 'P/E Ratio', operator: '<', value: 15 },
        { id: '2', category: 'Fundamental', metric: 'P/B Ratio', operator: '<', value: 2 },
      ],
    },
    {
      id: '2',
      name: 'Growth Stocks',
      criteria: [
        { id: '1', category: 'Growth', metric: 'Revenue Growth', operator: '>', value: 20 },
        { id: '2', category: 'Technical', metric: 'RSI', operator: '<', value: 70 },
      ],
    },
  ]);

  const [screenResults, setScreenResults] = useState<Stock[]>(
    Array.from(stockMarketStore.stocks.values())
  );

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [screenName, setScreenName] = useState('');

  const categories = {
    Fundamental: ['P/E Ratio', 'P/B Ratio', 'Dividend Yield', 'Market Cap', 'Debt/Equity'],
    Technical: ['RSI', 'MACD', '50-Day MA', '200-Day MA', 'Volume'],
    Growth: ['Revenue Growth', 'Earnings Growth', 'Profit Margin', 'ROE', 'ROA'],
    Valuation: ['EV/EBITDA', 'PEG Ratio', 'Price/Sales', 'Price/Cash Flow'],
  };

  const operators = ['>', '<', '>=', '<=', '=', '≠'];

  const addCriteria = () => {
    const newCriteria: ScreeningCriteria = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'Fundamental',
      metric: 'P/E Ratio',
      operator: '>',
      value: 0,
    };
    setCriteria([...criteria, newCriteria]);
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  const updateCriteria = (id: string, field: keyof ScreeningCriteria, value: any) => {
    setCriteria(
      criteria.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const runScreener = () => {
    // In a real implementation, this would apply the criteria to filter stocks
    console.log('Running screener with criteria:', criteria);
  };

  const saveScreen = () => {
    console.log('Saving screen:', { name: screenName, criteria });
    setOpenSaveDialog(false);
    setScreenName('');
  };

  const loadScreen = (screen: SavedScreen) => {
    setCriteria(screen.criteria);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Screening Criteria */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Screening Criteria
              </Typography>
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={() => setOpenSaveDialog(true)}
                  sx={{ mr: 1 }}
                >
                  Save Screen
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={runScreener}
                >
                  Run Screen
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {criteria.map((criterion) => (
                <Grid item xs={12} key={criterion.id}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 150 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={criterion.category}
                        label="Category"
                        onChange={(e) =>
                          updateCriteria(criterion.id, 'category', e.target.value)
                        }
                      >
                        {Object.keys(categories).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }}>
                      <InputLabel>Metric</InputLabel>
                      <Select
                        value={criterion.metric}
                        label="Metric"
                        onChange={(e) =>
                          updateCriteria(criterion.id, 'metric', e.target.value)
                        }
                      >
                        {categories[criterion.category as keyof typeof categories].map(
                          (metric) => (
                            <MenuItem key={metric} value={metric}>
                              {metric}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 100 }}>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={criterion.operator}
                        label="Operator"
                        onChange={(e) =>
                          updateCriteria(criterion.id, 'operator', e.target.value)
                        }
                      >
                        {operators.map((op) => (
                          <MenuItem key={op} value={op}>
                            {op}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Value"
                      type="number"
                      value={criterion.value}
                      onChange={(e) =>
                        updateCriteria(criterion.id, 'value', parseFloat(e.target.value))
                      }
                      sx={{ width: 120 }}
                    />

                    <IconButton
                      color="error"
                      onClick={() => removeCriteria(criterion.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button
              startIcon={<AddIcon />}
              onClick={addCriteria}
              sx={{ mt: 2 }}
            >
              Add Criteria
            </Button>
          </Paper>
        </Grid>

        {/* Saved Screens */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Saved Screens
            </Typography>
            <Grid container spacing={2}>
              {savedScreens.map((screen) => (
                <Grid item xs={12} key={screen.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {screen.name}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => loadScreen(screen)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small">
                            <StarBorderIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        {screen.criteria.map((c) => (
                          <Chip
                            key={c.id}
                            label={`${c.metric} ${c.operator} ${c.value}`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Screen Results */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Screening Results
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Change %</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">P/E Ratio</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {screenResults.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            stock.changePercent >= 0
                              ? 'success.main'
                              : 'error.main',
                        }}
                      >
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        ${(stock.marketCap / 1e9).toFixed(1)}B
                      </TableCell>
                      <TableCell align="right">{stock.pe.toFixed(2)}</TableCell>
                      <TableCell>
                        <Tooltip title="Add to Watchlist">
                          <IconButton size="small">
                            <StarBorderIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Save Screen Dialog */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Screen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Screen Name"
            fullWidth
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button onClick={saveScreen} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default MarketScreener;

