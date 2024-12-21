import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Image as ImageIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { DateTimePicker } from '@mui/x-date-pickers';

interface Trade {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  size: number;
  entryTime: Date;
  exitTime: Date;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
  setup: string;
  notes: string;
  screenshots: string[];
  rating: number;
  pnl: number;
  riskRewardRatio: number;
  emotions: string[];
  tags: string[];
}

interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  patterns: string[];
  suggestions: string[];
  confidence: number;
}

const TradeJournal: React.FC = observer(() => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const defaultTrade: Trade = {
    id: '',
    symbol: '',
    type: 'LONG',
    entryPrice: 0,
    exitPrice: 0,
    size: 0,
    entryTime: new Date(),
    exitTime: new Date(),
    stopLoss: 0,
    takeProfit: 0,
    strategy: '',
    setup: '',
    notes: '',
    screenshots: [],
    rating: 0,
    pnl: 0,
    riskRewardRatio: 0,
    emotions: [],
    tags: [],
  };

  const emotionOptions = [
    'Confident',
    'Fearful',
    'Greedy',
    'Patient',
    'Impulsive',
    'Calm',
    'Anxious',
    'Focused',
  ];

  const handleCreateNew = () => {
    setCurrentTrade({
      ...defaultTrade,
      id: Math.random().toString(36).substr(2, 9),
    });
    setIsDialogOpen(true);
  };

  const calculateMetrics = (trade: Trade) => {
    const pnl =
      trade.type === 'LONG'
        ? (trade.exitPrice - trade.entryPrice) * trade.size
        : (trade.entryPrice - trade.exitPrice) * trade.size;

    const risk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.size;
    const reward = Math.abs(trade.takeProfit - trade.entryPrice) * trade.size;
    const riskRewardRatio = risk > 0 ? reward / risk : 0;

    return { pnl, riskRewardRatio };
  };

  const handleSave = () => {
    if (!currentTrade) return;

    const metrics = calculateMetrics(currentTrade);
    const updatedTrade = {
      ...currentTrade,
      pnl: metrics.pnl,
      riskRewardRatio: metrics.riskRewardRatio,
    };

    const updatedTrades = trades.filter((t) => t.id !== updatedTrade.id);
    setTrades([...updatedTrades, updatedTrade]);
    setIsDialogOpen(false);
  };

  const handleAnalyze = async () => {
    if (!currentTrade) return;

    setIsAnalyzing(true);
    try {
      // Call AI service for analysis
      const analysis = await analyzeTradeWithAI(currentTrade);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing trade:', error);
      // Show error notification
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeTradeWithAI = async (trade: Trade): Promise<AIAnalysis> => {
    // Implement AI analysis logic here
    return {
      strengths: ['Good risk management', 'Clear entry criteria'],
      weaknesses: ['Early exit', 'Emotional decision making'],
      patterns: ['Tends to exit too early on winning trades'],
      suggestions: ['Consider using wider stops', 'Follow trading plan strictly'],
      confidence: 0.85,
    };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Trade Journal</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Log New Trade
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Entry/Exit</TableCell>
              <TableCell>P&L</TableCell>
              <TableCell>R:R</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Strategy</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  {trade.entryTime.toLocaleDateString()}
                </TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>
                  <Chip
                    label={trade.type}
                    color={trade.type === 'LONG' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {trade.entryPrice} / {trade.exitPrice}
                </TableCell>
                <TableCell>
                  <Typography
                    color={trade.pnl >= 0 ? 'success.main' : 'error.main'}
                  >
                    {trade.pnl.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>{trade.riskRewardRatio.toFixed(2)}</TableCell>
                <TableCell>
                  <Rating value={trade.rating} readOnly size="small" />
                </TableCell>
                <TableCell>{trade.strategy}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<AnalyticsIcon />}
                    size="small"
                    onClick={() => {
                      setCurrentTrade(trade);
                      handleAnalyze();
                    }}
                  >
                    Analyze
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentTrade?.id ? 'Edit Trade' : 'Log New Trade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                value={currentTrade?.symbol || ''}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, symbol: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type"
                value={currentTrade?.type || 'LONG'}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, type: e.target.value as 'LONG' | 'SHORT' }
                      : null
                  )
                }
              >
                <option value="LONG">Long</option>
                <option value="SHORT">Short</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Entry Price"
                value={currentTrade?.entryPrice || ''}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, entryPrice: Number(e.target.value) }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Exit Price"
                value={currentTrade?.exitPrice || ''}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, exitPrice: Number(e.target.value) }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Entry Time"
                value={currentTrade?.entryTime || null}
                onChange={(date) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, entryTime: date || new Date() }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Exit Time"
                value={currentTrade?.exitTime || null}
                onChange={(date) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, exitTime: date || new Date() }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Strategy"
                value={currentTrade?.strategy || ''}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, strategy: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Setup Description"
                value={currentTrade?.setup || ''}
                onChange={(e) =>
                  setCurrentTrade(
                    currentTrade
                      ? { ...currentTrade, setup: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Emotions
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {emotionOptions.map((emotion) => (
                  <Chip
                    key={emotion}
                    label={emotion}
                    onClick={() => {
                      if (!currentTrade) return;
                      const emotions = currentTrade.emotions.includes(emotion)
                        ? currentTrade.emotions.filter((e) => e !== emotion)
                        : [...currentTrade.emotions, emotion];
                      setCurrentTrade({ ...currentTrade, emotions });
                    }}
                    color={
                      currentTrade?.emotions.includes(emotion)
                        ? 'primary'
                        : 'default'
                    }
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Trade Rating</Typography>
                <Rating
                  value={currentTrade?.rating || 0}
                  onChange={(_, value) =>
                    setCurrentTrade(
                      currentTrade
                        ? { ...currentTrade, rating: value || 0 }
                        : null
                    )
                  }
                />
              </Box>
            </Grid>
          </Grid>

          {aiAnalysis && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                AI Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Strengths</Typography>
                  <ul>
                    {aiAnalysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Weaknesses</Typography>
                  <ul>
                    {aiAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Suggestions</Typography>
                  <ul>
                    {aiAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            startIcon={<PsychologyIcon />}
            onClick={handleAnalyze}
            color="info"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <CircularProgress size={24} />
            ) : (
              'Analyze with AI'
            )}
          </Button>
          <Button
            startIcon={<ImageIcon />}
            color="secondary"
          >
            Add Screenshots
          </Button>
          <Button
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

export default TradeJournal;
