import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Rating,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';
import { JournalEntry, Trade } from '../../types/trading';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

interface JournalEntryDialogProps {
  open: boolean;
  onClose: () => void;
  entry?: JournalEntry;
  trade?: Trade;
}

const TRADE_ASPECTS = [
  'Entry Timing',
  'Exit Timing',
  'Position Sizing',
  'Risk Management',
  'Emotional Control',
  'Strategy Adherence',
];

const EMOTIONS = [
  'Confident',
  'Anxious',
  'FOMO',
  'Greedy',
  'Patient',
  'Impulsive',
  'Disciplined',
  'Frustrated',
];

const JournalEntryDialog: React.FC<JournalEntryDialogProps> = observer(({
  open,
  onClose,
  entry,
  trade,
}) => {
  const { journalStore } = useStore();
  const [formData, setFormData] = React.useState({
    title: entry?.title || '',
    description: entry?.description || '',
    emotions: entry?.emotions || [],
    rating: entry?.rating || 3,
    aspects: entry?.aspects || {},
    learnings: entry?.learnings || '',
    improvements: entry?.improvements || '',
  });

  const handleSubmit = () => {
    if (entry) {
      journalStore.updateEntry(entry.id, formData);
    } else if (trade) {
      journalStore.createEntry({
        ...formData,
        tradeId: trade.id,
        timestamp: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {entry ? 'Edit Journal Entry' : 'New Journal Entry'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Trade Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Trade Rating
          </Typography>
          <Rating
            value={formData.rating}
            onChange={(_, value) =>
              setFormData((prev) => ({ ...prev, rating: value || 0 }))
            }
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Emotions During Trade
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {EMOTIONS.map((emotion) => (
              <Chip
                key={emotion}
                label={emotion}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    emotions: prev.emotions.includes(emotion)
                      ? prev.emotions.filter((e) => e !== emotion)
                      : [...prev.emotions, emotion],
                  }))
                }
                color={
                  formData.emotions.includes(emotion) ? 'primary' : 'default'
                }
              />
            ))}
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Trade Aspects Rating
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {TRADE_ASPECTS.map((aspect) => (
              <Grid item xs={12} sm={6} key={aspect}>
                <Typography variant="body2" gutterBottom>
                  {aspect}
                </Typography>
                <Rating
                  value={formData.aspects[aspect] || 0}
                  onChange={(_, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      aspects: {
                        ...prev.aspects,
                        [aspect]: value || 0,
                      },
                    }))
                  }
                />
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Key Learnings"
            value={formData.learnings}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, learnings: e.target.value }))
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Areas for Improvement"
            value={formData.improvements}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                improvements: e.target.value,
              }))
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {entry ? 'Update' : 'Create'} Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const TradingJournal: React.FC = observer(() => {
  const theme = useTheme();
  const { journalStore } = useStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<JournalEntry | null>(
    null
  );
  const [filter, setFilter] = React.useState({
    period: '1M',
    rating: 'all',
  });

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      journalStore.deleteEntry(entryId);
    }
  };

  const filteredEntries = React.useMemo(() => {
    return journalStore.entries.filter((entry) => {
      // Period filter
      const entryDate = new Date(entry.timestamp);
      const now = new Date();
      switch (filter.period) {
        case '1W':
          return entryDate >= new Date(now.setDate(now.getDate() - 7));
        case '1M':
          return entryDate >= new Date(now.setMonth(now.getMonth() - 1));
        case '3M':
          return entryDate >= new Date(now.setMonth(now.getMonth() - 3));
        case 'ALL':
          return true;
        default:
          return true;
      }
    });
  }, [journalStore.entries, filter]);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Trading Journal</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewEntry}
        >
          New Entry
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={filter.period}
                label="Time Period"
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, period: e.target.value }))
                }
              >
                <MenuItem value="1W">Last Week</MenuItem>
                <MenuItem value="1M">Last Month</MenuItem>
                <MenuItem value="3M">Last 3 Months</MenuItem>
                <MenuItem value="ALL">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rating</InputLabel>
              <Select
                value={filter.rating}
                label="Rating"
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, rating: e.target.value }))
                }
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Journal Entries */}
      <Grid container spacing={3}>
        {filteredEntries.map((entry) => (
          <Grid item xs={12} md={6} key={entry.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{entry.title}</Typography>
                  <Rating value={entry.rating} readOnly size="small" />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  {formatDateTime(entry.timestamp)}
                </Typography>

                <Typography variant="body1" paragraph>
                  {entry.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {entry.emotions.map((emotion) => (
                    <Chip
                      key={emotion}
                      label={emotion}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Key Learnings
                </Typography>
                <Typography variant="body2" paragraph>
                  {entry.learnings}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Areas for Improvement
                </Typography>
                <Typography variant="body2">
                  {entry.improvements}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditEntry(entry)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteEntry(entry.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <JournalEntryDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry || undefined}
      />
    </Box>
  );
});

export default TradingJournal;
