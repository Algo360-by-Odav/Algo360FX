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
  useTheme,
} from '@mui/material';
import { scaleLinear } from 'd3-scale';
import { format } from 'date-fns';

interface HeatmapCell {
  x: number | string;
  y: number | string;
  value: number;
  metadata?: any;
}

interface HeatmapConfig {
  colorScheme: 'default' | 'diverging' | 'sequential';
  cellSize: number;
  showValues: boolean;
  valueFormat: string;
  minColor?: string;
  maxColor?: string;
  neutralColor?: string;
}

interface HeatmapGridProps {
  data: HeatmapCell[];
  xLabels: (number | string)[];
  yLabels: (number | string)[];
  title: string;
  initialConfig?: Partial<HeatmapConfig>;
  onCellClick?: (cell: HeatmapCell) => void;
  onConfigChange?: (config: HeatmapConfig) => void;
}

const defaultConfig: HeatmapConfig = {
  colorScheme: 'default',
  cellSize: 40,
  showValues: true,
  valueFormat: '0.00',
};

const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  data,
  xLabels,
  yLabels,
  title,
  initialConfig,
  onCellClick,
  onConfigChange,
}) => {
  const theme = useTheme();
  const [config, setConfig] = React.useState<HeatmapConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const handleConfigChange = (key: keyof HeatmapConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const getColorScale = () => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    switch (config.colorScheme) {
      case 'diverging':
        return scaleLinear<string>()
          .domain([min, 0, max])
          .range([
            config.minColor || theme.palette.error.light,
            config.neutralColor || theme.palette.grey[300],
            config.maxColor || theme.palette.success.light,
          ]);
      case 'sequential':
        return scaleLinear<string>()
          .domain([min, max])
          .range([
            config.minColor || theme.palette.primary.light,
            config.maxColor || theme.palette.primary.dark,
          ]);
      default:
        return scaleLinear<string>()
          .domain([min, max])
          .range([
            config.minColor || theme.palette.primary.light,
            config.maxColor || theme.palette.primary.main,
          ]);
    }
  };

  const colorScale = getColorScale();

  const formatValue = (value: number) => {
    if (!config.showValues) return '';
    
    switch (config.valueFormat) {
      case 'percent':
        return `${(value * 100).toFixed(2)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      default:
        return value.toFixed(2);
    }
  };

  const getCellStyle = (value: number) => ({
    width: config.cellSize,
    height: config.cellSize,
    backgroundColor: colorScale(value),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onCellClick ? 'pointer' : 'default',
    fontSize: config.cellSize * 0.3,
    color: theme.palette.getContrastText(colorScale(value)),
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.8,
      transform: 'scale(1.1)',
    },
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        </Grid>

        {/* Controls */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Color Scheme</InputLabel>
                  <Select
                    value={config.colorScheme}
                    label="Color Scheme"
                    onChange={(e) =>
                      handleConfigChange('colorScheme', e.target.value)
                    }
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="diverging">Diverging</MenuItem>
                    <MenuItem value="sequential">Sequential</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Value Format</InputLabel>
                  <Select
                    value={config.valueFormat}
                    label="Value Format"
                    onChange={(e) =>
                      handleConfigChange('valueFormat', e.target.value)
                    }
                  >
                    <MenuItem value="0.00">Number</MenuItem>
                    <MenuItem value="percent">Percentage</MenuItem>
                    <MenuItem value="currency">Currency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography gutterBottom>Cell Size</Typography>
                <Slider
                  value={config.cellSize}
                  min={20}
                  max={60}
                  step={5}
                  onChange={(_, value) =>
                    handleConfigChange('cellSize', value)
                  }
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Heatmap Grid */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `auto repeat(${xLabels.length}, ${config.cellSize}px)`,
              gap: 1,
              overflowX: 'auto',
            }}
          >
            {/* Empty top-left cell */}
            <Box />

            {/* X-axis labels */}
            {xLabels.map((label, i) => (
              <Box
                key={`x-${i}`}
                sx={{
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'bottom left',
                  width: config.cellSize,
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  fontSize: '0.75rem',
                }}
              >
                {label}
              </Box>
            ))}

            {/* Y-axis labels and cells */}
            {yLabels.map((yLabel, y) => (
              <React.Fragment key={`row-${y}`}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pr: 1,
                    fontSize: '0.75rem',
                  }}
                >
                  {yLabel}
                </Box>
                {xLabels.map((xLabel, x) => {
                  const cell = data.find(
                    (d) => d.x === xLabel && d.y === yLabel
                  );
                  return (
                    <Box
                      key={`cell-${x}-${y}`}
                      sx={getCellStyle(cell?.value || 0)}
                      onClick={() => cell && onCellClick?.(cell)}
                    >
                      {cell && formatValue(cell.value)}
                    </Box>
                  );
                })}
              </React.Fragment>
            ))}
          </Box>
        </Grid>

        {/* Legend */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: '200px',
                height: '20px',
                background: `linear-gradient(to right, ${colorScale.range().join(', ')})`,
              }}
            />
            <Box sx={{ ml: 1, display: 'flex', gap: 2 }}>
              <Typography variant="caption">
                {formatValue(Math.min(...data.map((d) => d.value)))}
              </Typography>
              <Typography variant="caption">
                {formatValue(Math.max(...data.map((d) => d.value)))}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeatmapGrid;
