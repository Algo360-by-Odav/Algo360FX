import React, { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType } from 'lightweight-charts';

interface StrategyMetrics {
  name: string;
  allocation: number;
  sharpeRatio: number;
  correlation: number;
  contribution: number;
  drawdown: number;
  pairExposure: { [key: string]: number };
}

const PortfolioAnalyticsWidget: React.FC = observer(() => {
  const correlationChartRef = useRef<HTMLDivElement>(null);
  const exposureChartRef = useRef<HTMLDivElement>(null);

  const strategies: StrategyMetrics[] = [
    {
      name: 'Trend Follower',
      allocation: 30,
      sharpeRatio: 1.8,
      correlation: 1,
      contribution: 35,
      drawdown: 12,
      pairExposure: { EURUSD: 40, GBPUSD: 30, USDJPY: 30 },
    },
    {
      name: 'Mean Reversion',
      allocation: 25,
      sharpeRatio: 1.5,
      correlation: -0.3,
      contribution: 28,
      drawdown: 8,
      pairExposure: { EURUSD: 20, GBPUSD: 40, AUDUSD: 40 },
    },
    {
      name: 'Breakout System',
      allocation: 25,
      sharpeRatio: 1.6,
      correlation: 0.2,
      contribution: 22,
      drawdown: 15,
      pairExposure: { USDJPY: 50, EURJPY: 50 },
    },
    {
      name: 'Scalping Bot',
      allocation: 20,
      sharpeRatio: 2.1,
      correlation: 0.1,
      contribution: 15,
      drawdown: 5,
      pairExposure: { EURUSD: 60, GBPUSD: 40 },
    },
  ];

  useEffect(() => {
    if (correlationChartRef.current) {
      const chart = createChart(correlationChartRef.current, {
        width: correlationChartRef.current.clientWidth,
        height: 300,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#999',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
      });

      const correlationSeries = chart.addHeatmapSeries({
        defaultColor: '#013369',
      });

      // Generate correlation matrix data
      const correlationData = strategies.flatMap((s1, i) =>
        strategies.map((s2, j) => ({
          x: i,
          y: j,
          value: i === j ? 1 : (Math.random() * 2 - 1).toFixed(2),
        }))
      );

      correlationSeries.setData(correlationData);

      return () => {
        chart.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (exposureChartRef.current) {
      const chart = createChart(exposureChartRef.current, {
        width: exposureChartRef.current.clientWidth,
        height: 300,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#999',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
      });

      const series = chart.addHistogramSeries({
        color: '#2962FF',
      });

      // Aggregate pair exposure across strategies
      const totalExposure: { [key: string]: number } = {};
      strategies.forEach(strategy => {
        Object.entries(strategy.pairExposure).forEach(([pair, exposure]) => {
          totalExposure[pair] = (totalExposure[pair] || 0) + (exposure * strategy.allocation) / 100;
        });
      });

      const exposureData = Object.entries(totalExposure).map(([pair, exposure], index) => ({
        time: index.toString(),
        value: exposure,
        title: pair,
      }));

      series.setData(exposureData);

      return () => {
        chart.remove();
      };
    }
  }, []);

  const getCorrelationColor = (value: number) => {
    if (value >= 0.5) return 'error';
    if (value >= 0.2) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Portfolio Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Strategy Metrics Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell align="right">Allocation (%)</TableCell>
                    <TableCell align="right">Sharpe Ratio</TableCell>
                    <TableCell align="right">Correlation</TableCell>
                    <TableCell align="right">Contribution (%)</TableCell>
                    <TableCell align="right">Max Drawdown (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strategies.map((strategy) => (
                    <TableRow key={strategy.name}>
                      <TableCell>{strategy.name}</TableCell>
                      <TableCell align="right">{strategy.allocation}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={strategy.sharpeRatio.toFixed(2)}
                          color={strategy.sharpeRatio >= 1.5 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={strategy.correlation.toFixed(2)}
                          color={getCorrelationColor(strategy.correlation)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{strategy.contribution}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${strategy.drawdown}%`}
                          color={strategy.drawdown <= 10 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Correlation Matrix */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Strategy Correlation Matrix
            </Typography>
            <div ref={correlationChartRef} style={{ height: '300px' }} />
          </Grid>

          {/* Currency Exposure */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Currency Pair Exposure
            </Typography>
            <div ref={exposureChartRef} style={{ height: '300px' }} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default PortfolioAnalyticsWidget;
