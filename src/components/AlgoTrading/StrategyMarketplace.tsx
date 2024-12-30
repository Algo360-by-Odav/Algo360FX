import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Chip,
  Rating,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  TrendingUp,
  Speed,
  CompareArrows,
  ShowChart,
  Timeline,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import StrategyTemplateService, { StrategyTemplate } from '../../services/StrategyTemplateService';

const CategoryIcons: Record<StrategyTemplate['category'], React.ReactElement> = {
  TREND: <TrendingUp />,
  SCALPING: <Speed />,
  MEAN_REVERSION: <CompareArrows />,
  ARBITRAGE: <ShowChart />,
  MOMENTUM: <Timeline />,
};

interface StrategyCardProps {
  template: StrategyTemplate;
  onUse: (template: StrategyTemplate) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ template, onUse }) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {CategoryIcons[template.category]}
            <Box component="span" sx={{ ml: 1 }}>
              {template.name}
            </Box>
          </Typography>
          <IconButton
            color="primary"
            onClick={() => onUse(template)}
            size="small"
          >
            <DownloadIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {template.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={template.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({template.downloads} downloads)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {template.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>

          <Button
            variant="text"
            size="small"
            onClick={() => setShowDetails(true)}
            sx={{ mt: 1 }}
          >
            View Details
          </Button>
        </Box>
      </Card>

      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{template.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                {template.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h6">
                    {template.performance?.winRate}%
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sharpe Ratio
                  </Typography>
                  <Typography variant="h6">
                    {template.performance?.sharpeRatio}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h6">
                    {template.performance?.maxDrawdown}%
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Return
                  </Typography>
                  <Typography variant="h6">
                    {template.performance?.monthlyReturn}%
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Strategy Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Chip
                  icon={CategoryIcons[template.category]}
                  label={template.category.replace('_', ' ')}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Author
                </Typography>
                <Typography variant="body1">{template.author}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={template.rating} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({template.downloads} downloads)
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {template.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              onUse(template);
              setShowDetails(false);
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const StrategyMarketplace: React.FC = observer(() => {
  const theme = useTheme();
  const { algoTradingStore } = useRootStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);

  useEffect(() => {
    const templateService = StrategyTemplateService.getInstance();
    let filteredTemplates = templateService.getTemplates();

    if (searchQuery) {
      filteredTemplates = templateService.searchTemplates(searchQuery);
    }

    if (selectedCategory !== 'all') {
      filteredTemplates = filteredTemplates.filter(
        (template) => template.category === selectedCategory
      );
    }

    setTemplates(filteredTemplates);
  }, [searchQuery, selectedCategory]);

  const handleUseTemplate = (template: StrategyTemplate) => {
    try {
      algoTradingStore.startStrategy(template.config);
    } catch (error) {
      console.error('Failed to start strategy:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Strategy Marketplace
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and use pre-built trading strategies from our marketplace
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs
              value={selectedCategory}
              onChange={(_, value) => setSelectedCategory(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="all" />
              <Tab
                label="Trend Following"
                value="TREND"
                icon={<TrendingUp />}
                iconPosition="start"
              />
              <Tab
                label="Scalping"
                value="SCALPING"
                icon={<Speed />}
                iconPosition="start"
              />
              <Tab
                label="Mean Reversion"
                value="MEAN_REVERSION"
                icon={<CompareArrows />}
                iconPosition="start"
              />
              <Tab
                label="Arbitrage"
                value="ARBITRAGE"
                icon={<ShowChart />}
                iconPosition="start"
              />
              <Tab
                label="Momentum"
                value="MOMENTUM"
                icon={<Timeline />}
                iconPosition="start"
              />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <StrategyCard template={template} onUse={handleUseTemplate} />
          </Grid>
        ))}
      </Grid>

      {templates.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">
            No strategies found. Try adjusting your search criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export default StrategyMarketplace;
