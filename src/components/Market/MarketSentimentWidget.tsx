import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

interface SentimentData {
  pair: string;
  bullish: number;
  bearish: number;
  neutral: number;
  momentum: 'Bullish' | 'Bearish' | 'Neutral';
  strength: 'Strong' | 'Moderate' | 'Weak';
}

const MarketSentimentWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { marketStore } = useRootStore();
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([
    {
      pair: 'EUR/USD',
      bullish: 65,
      bearish: 25,
      neutral: 10,
      momentum: 'Bullish',
      strength: 'Strong',
    },
    {
      pair: 'GBP/USD',
      bullish: 45,
      bearish: 40,
      neutral: 15,
      momentum: 'Neutral',
      strength: 'Weak',
    },
    {
      pair: 'USD/JPY',
      bullish: 30,
      bearish: 60,
      neutral: 10,
      momentum: 'Bearish',
      strength: 'Moderate',
    },
    {
      pair: 'AUD/USD',
      bullish: 55,
      bearish: 35,
      neutral: 10,
      momentum: 'Bullish',
      strength: 'Moderate',
    },
  ]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Market Sentiment</Typography>
      </Box>
      <Box sx={{ p: 2, flex: 1 }}>
        <Grid container spacing={2}>
          {sentimentData.map((data, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">{data.pair}</Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: data.momentum === 'Bullish' 
                        ? theme.palette.success.main
                        : data.momentum === 'Bearish'
                        ? theme.palette.error.main
                        : theme.palette.warning.main
                    }}
                  >
                    {data.momentum} ({data.strength})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={data.bullish}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ minWidth: 35 }}>
                    {data.bullish}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={data.bearish}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.error.main,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ minWidth: 35 }}>
                    {data.bearish}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={data.neutral}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.warning.main,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ minWidth: 35 }}>
                    {data.neutral}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
});

export default MarketSentimentWidget;
