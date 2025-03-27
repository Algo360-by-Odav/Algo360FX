import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  useTheme,
} from '@mui/material';

interface ForexPair {
  symbol: string;
  flags: [string, string];
  ask: number;
  bid: number;
  spread: number;
}

const forexPairs: ForexPair[] = [
  {
    symbol: 'AUDUSD',
    flags: ['au', 'us'],
    ask: 0.63003,
    bid: 0.63000,
    spread: 3,
  },
  {
    symbol: 'EURUSD',
    flags: ['eu', 'us'],
    ask: 1.05134,
    bid: 1.05134,
    spread: 0,
  },
  {
    symbol: 'GBPUSD',
    flags: ['gb', 'us'],
    ask: 1.24976,
    bid: 1.24972,
    spread: 4,
  },
  {
    symbol: 'NZDUSD',
    flags: ['nz', 'us'],
    ask: 0.56993,
    bid: 0.56991,
    spread: 2,
  },
  {
    symbol: 'USDCAD',
    flags: ['us', 'ca'],
    ask: 1.43665,
    bid: 1.43662,
    spread: 3,
  },
];

const ForexPairs: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          pb: 2,
          px: 2,
          minWidth: 'min-content',
        }}
      >
        {forexPairs.map((pair) => (
          <Card
            key={pair.symbol}
            sx={{
              minWidth: 200,
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={`https://flagcdn.com/w40/${pair.flags[0]}.png`}
                    alt={pair.flags[0]}
                    sx={{ width: 20, height: 20, borderRadius: '50%' }}
                  />
                  <Box
                    component="img"
                    src={`https://flagcdn.com/w40/${pair.flags[1]}.png`}
                    alt={pair.flags[1]}
                    sx={{ width: 20, height: 20, borderRadius: '50%' }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {pair.symbol}
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Ask
                    </Typography>
                    <Typography variant="body2">{pair.ask.toFixed(5)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Bid
                    </Typography>
                    <Typography variant="body2">{pair.bid.toFixed(5)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Spread
                    </Typography>
                    <Typography variant="body2">{pair.spread}</Typography>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    Sell
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    Buy
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ForexPairs;
