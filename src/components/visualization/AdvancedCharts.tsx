import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  Brush,
  ReferenceArea,
  ReferenceLine,
  Label,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'scatter' | 'composed';
  stacked: boolean;
  showBrush: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  showReferenceLines: boolean;
  smoothing: boolean;
  animation: boolean;
  timeFormat: string;
}

interface ChartSeries {
  id: string;
  name: string;
  type: 'line' | 'area' | 'bar' | 'scatter';
  dataKey: string;
  color?: string;
  opacity?: number;
  visible?: boolean;
}

interface ChartData {
  timestamp: Date;
  [key: string]: any;
}

interface AdvancedChartsProps {
  data: ChartData[];
  series: ChartSeries[];
  title: string;
  xAxisKey?: string;
  initialConfig?: Partial<ChartConfig>;
  height?: number;
  onConfigChange?: (config: ChartConfig) => void;
}

const defaultConfig: ChartConfig = {
  type: 'composed',
  stacked: false,
  showBrush: true,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  showReferenceLines: true,
  smoothing: true,
  animation: true,
  timeFormat: 'HH:mm:ss',
};

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  data,
  series,
  title,
  xAxisKey = 'timestamp',
  initialConfig,
  height = 400,
  onConfigChange,
}) => {
  const theme = useTheme();
  const [config, setConfig] = React.useState<ChartConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const handleConfigChange = (key: keyof ChartConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const formatXAxis = (value: any) => {
    if (value instanceof Date) {
      return format(value, config.timeFormat);
    }
    return value;
  };

  const renderChart = () => {
    const ChartComponent = config.type === 'composed' ? ComposedChart : ComposedChart;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          {config.showTooltip && (
            <Tooltip
              labelFormatter={(value) =>
                value instanceof Date ? format(value, 'PPpp') : value
              }
            />
          )}
          {config.showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
          )}
          {config.showBrush && (
            <Brush
              dataKey={xAxisKey}
              height={30}
              stroke={theme.palette.primary.main}
              tickFormatter={formatXAxis}
            />
          )}
          {series.map((s) => {
            if (!s.visible) return null;

            const commonProps = {
              key: s.id,
              name: s.name,
              dataKey: s.dataKey,
              fill: s.color || theme.palette.primary.main,
              stroke: s.color || theme.palette.primary.main,
              opacity: s.opacity || 1,
              type: config.smoothing ? 'monotone' : 'linear',
              stackId: config.stacked ? 'stack' : undefined,
              animationDuration: config.animation ? 300 : 0,
            };

            switch (s.type) {
              case 'line':
                return <Line {...commonProps} dot={false} />;
              case 'area':
                return <Area {...commonProps} />;
              case 'bar':
                return <Bar {...commonProps} />;
              case 'scatter':
                return <Scatter {...commonProps} />;
              default:
                return null;
            }
          })}
          {config.showReferenceLines && (
            <>
              <ReferenceLine
                y={0}
                stroke={theme.palette.text.secondary}
                strokeDasharray="3 3"
              />
              <ReferenceArea
                y1={0}
                y2={-Infinity}
                fill={theme.palette.error.main}
                fillOpacity={0.1}
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        </Grid>

        {/* Chart Controls */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={config.type}
                    label="Chart Type"
                    onChange={(e) =>
                      handleConfigChange('type', e.target.value)
                    }
                  >
                    <MenuItem value="composed">Composed</MenuItem>
                    <MenuItem value="line">Line</MenuItem>
                    <MenuItem value="area">Area</MenuItem>
                    <MenuItem value="bar">Bar</MenuItem>
                    <MenuItem value="scatter">Scatter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={config.timeFormat}
                    label="Time Format"
                    onChange={(e) =>
                      handleConfigChange('timeFormat', e.target.value)
                    }
                  >
                    <MenuItem value="HH:mm:ss">HH:mm:ss</MenuItem>
                    <MenuItem value="HH:mm">HH:mm</MenuItem>
                    <MenuItem value="MM/dd HH:mm">MM/dd HH:mm</MenuItem>
                    <MenuItem value="yyyy-MM-dd">yyyy-MM-dd</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.stacked}
                        onChange={(e) =>
                          handleConfigChange('stacked', e.target.checked)
                        }
                      />
                    }
                    label="Stacked"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.smoothing}
                        onChange={(e) =>
                          handleConfigChange('smoothing', e.target.checked)
                        }
                      />
                    }
                    label="Smooth"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Chart Area */}
        <Grid item xs={12}>
          {renderChart()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvancedCharts;
