import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { HeatMap } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';

interface CorrelationData {
  pairs: string[];
  matrix: number[][];
  timestamp: Date;
}

const CorrelationMatrix: React.FC = observer(() => {
  const [timeframe, setTimeframe] = useState('1D');
  const [lookbackPeriod, setLookbackPeriod] = useState(30);
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(0.7);

  const availablePairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD',
    'NZDUSD', 'USDCHF', 'EURJPY', 'GBPJPY', 'AUDJPY',
  ];

  useEffect(() => {
    if (selectedPairs.length > 0) {
      fetchCorrelationData();
    }
  }, [timeframe, lookbackPeriod, selectedPairs]);

  const fetchCorrelationData = async () => {
    setLoading(true);
    try {
      // Implement correlation data fetching
      const data = await calculateCorrelations();
      setCorrelationData(data);
    } catch (error) {
      console.error('Error fetching correlation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCorrelations = async (): Promise<CorrelationData> => {
    // Implement correlation calculation logic
    return {
      pairs: selectedPairs,
      matrix: Array(selectedPairs.length).fill(0).map(() =>
        Array(selectedPairs.length).fill(0).map(() =>
          Math.random() * 2 - 1
        )
      ),
      timestamp: new Date(),
    };
  };

  const getCorrelationColor = (value: number) => {
    const colorScale = scaleLinear({
      domain: [-1, 0, 1],
      range: ['#ef5350', '#ffffff', '#4caf50'],
    });
    return colorScale(value);
  };

  const findHighCorrelations = () => {
    if (!correlationData) return [];

    const results = [];
    const { pairs, matrix } = correlationData;

    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const correlation = matrix[i][j];
        if (Math.abs(correlation) >= threshold) {
          results.push({
            pair1: pairs[i],
            pair2: pairs[j],
            correlation,
          });
        }
      }
    }

    return results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Currency Pair Correlation Matrix
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Currency Pairs</InputLabel>
            <Select
              multiple
              value={selectedPairs}
              onChange={(e) => setSelectedPairs(e.target.value as string[])}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {availablePairs.map((pair) => (
                <MenuItem key={pair} value={pair}>
                  {pair}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="1H">1 Hour</MenuItem>
              <MenuItem value="4H">4 Hours</MenuItem>
              <MenuItem value="1D">1 Day</MenuItem>
              <MenuItem value="1W">1 Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Lookback Period (Days)</Typography>
          <Slider
            value={lookbackPeriod}
            onChange={(_, value) => setLookbackPeriod(value as number)}
            min={5}
            max={90}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : correlationData ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {correlationData.pairs.map((pair) => (
                        <TableCell key={pair}>{pair}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {correlationData.matrix.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{correlationData.pairs[i]}</TableCell>
                        {row.map((value, j) => (
                          <TableCell
                            key={j}
                            sx={{
                              bgcolor: getCorrelationColor(value),
                              color: Math.abs(value) > 0.5 ? 'white' : 'inherit',
                            }}
                          >
                            {value.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                High Correlations
              </Typography>
              <Typography variant="body2" gutterBottom>
                Threshold: {threshold}
              </Typography>
              <Slider
                value={threshold}
                onChange={(_, value) => setThreshold(value as number)}
                min={0.5}
                max={1}
                step={0.05}
                valueLabelDisplay="auto"
              />
              <Box mt={2}>
                {findHighCorrelations().map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {item.pair1} / {item.pair2}
                    </Typography>
                    <Typography
                      variant="h6"
                      color={item.correlation > 0 ? 'success.main' : 'error.main'}
                    >
                      {item.correlation.toFixed(3)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary" align="center">
          Select currency pairs to view correlations
        </Typography>
      )}
    </Box>
  );
});

export default CorrelationMatrix;
