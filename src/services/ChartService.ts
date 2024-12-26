import {
  Chart,
  ChartConfiguration,
  registerables,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { 
  CandleData, 
  ChartStyle, 
  IndicatorOptions,
  ChartType,
  AreaChartOptions,
  ScatterChartOptions 
} from '../types/trading';
import { TechnicalIndicators } from './TechnicalIndicators';
import { AlternativeCharts } from './AlternativeCharts';

Chart.register(...registerables);

export class ChartService {
  private static defaultStyle: ChartStyle = {
    backgroundColor: '#1a1a1a',
    textColor: '#e0e0e0',
    gridColor: '#333333',
    candleUpColor: '#26a69a',
    candleDownColor: '#ef5350',
    volumeUpColor: 'rgba(38, 166, 154, 0.5)',
    volumeDownColor: 'rgba(239, 83, 80, 0.5)',
    lineColors: [
      '#2196F3',
      '#FF9800',
      '#4CAF50',
      '#E91E63',
      '#9C27B0',
      '#00BCD4',
    ],
    crosshairColor: '#666666',
    fontFamily: 'Roboto, sans-serif',
  };

  static createChart(
    canvas: HTMLCanvasElement,
    data: CandleData[],
    chartType: ChartType = 'candlestick',
    indicators: string[] = [],
    options: IndicatorOptions & AreaChartOptions & ScatterChartOptions = {},
    style: Partial<ChartStyle> = {}
  ): Chart {
    const mergedStyle = { ...this.defaultStyle, ...style };
    const config = this.generateChartConfig(data, chartType, indicators, options, mergedStyle);
    return new Chart(canvas, config);
  }

  private static generateChartConfig(
    data: CandleData[],
    chartType: ChartType,
    indicators: string[],
    options: IndicatorOptions & AreaChartOptions & ScatterChartOptions,
    style: ChartStyle
  ): ChartConfiguration {
    let baseConfig: ChartConfiguration;

    switch (chartType) {
      case 'line':
        baseConfig = this.generateLineConfig(data, style);
        break;
      case 'area':
        baseConfig = this.generateAreaConfig(data, options as AreaChartOptions, style);
        break;
      case 'scatter':
        baseConfig = this.generateScatterConfig(data, options as ScatterChartOptions, style);
        break;
      case 'bubble':
        baseConfig = this.generateBubbleConfig(data, style);
        break;
      case 'heikinAshi':
        baseConfig = this.generateHeikinAshiConfig(data, style);
        break;
      case 'renko':
        baseConfig = this.generateRenkoConfig(data, options.brickSize || 10, style);
        break;
      case 'kagi':
        baseConfig = this.generateKagiConfig(data, options.reversalAmount || 0.04, style);
        break;
      case 'candlestick':
      default:
        baseConfig = this.generateCandlestickConfig(data, style);
    }

    // Add indicators if requested
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        const color = style.lineColors[index % style.lineColors.length];
        this.addIndicator(baseConfig, data, indicator, options, color);
      });
    }

    return baseConfig;
  }

  private static generateLineConfig(data: CandleData[], style: ChartStyle): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d.timestamp).toISOString()),
        datasets: [{
          label: 'Price',
          data: data.map(d => d.close),
          borderColor: style.lineColors[0],
          backgroundColor: style.lineColors[0] + '20',
          tension: 0.1,
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateAreaConfig(
    data: CandleData[], 
    options: AreaChartOptions,
    style: ChartStyle
  ): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d.timestamp).toISOString()),
        datasets: [{
          label: 'Price',
          data: data.map(d => d.close),
          borderColor: style.lineColors[0],
          backgroundColor: options.fillColor || style.lineColors[0] + '20',
          fill: true,
          tension: options.curved ? 0.4 : 0,
          pointRadius: options.showPoints ? 3 : 0,
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateScatterConfig(
    data: CandleData[],
    options: ScatterChartOptions,
    style: ChartStyle
  ): ChartConfiguration {
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Price',
          data: AlternativeCharts.calculateScatterPlot(data, 'timestamp', 'close'),
          backgroundColor: style.lineColors[0],
          pointStyle: options.pointStyle || 'circle',
          pointRadius: options.pointSize || 5,
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateBubbleConfig(data: CandleData[], style: ChartStyle): ChartConfiguration {
    return {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Price/Volume',
          data: AlternativeCharts.calculateBubbleChart(data, candle => 
            Math.sqrt(candle.volume) / 1000 // Adjust radius based on volume
          ),
          backgroundColor: style.lineColors.map(color => color + '80'),
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateHeikinAshiConfig(data: CandleData[], style: ChartStyle): ChartConfiguration {
    const haData = AlternativeCharts.calculateHeikinAshi(data);
    return {
      type: 'candlestick',
      data: {
        labels: haData.map(d => new Date(d.timestamp).toISOString()),
        datasets: [{
          label: 'Heikin Ashi',
          data: haData.map(d => ({
            x: d.timestamp,
            o: d.open,
            h: d.high,
            l: d.low,
            c: d.close
          })),
          color: {
            up: style.candleUpColor,
            down: style.candleDownColor,
          }
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateRenkoConfig(
    data: CandleData[],
    brickSize: number,
    style: ChartStyle
  ): ChartConfiguration {
    const renkoData = AlternativeCharts.calculateRenko(data, brickSize);
    return {
      type: 'candlestick',
      data: {
        labels: renkoData.map(d => new Date(d.timestamp).toISOString()),
        datasets: [{
          label: 'Renko',
          data: renkoData.map(d => ({
            x: d.timestamp,
            o: d.open,
            h: d.high,
            l: d.low,
            c: d.close
          })),
          color: {
            up: style.candleUpColor,
            down: style.candleDownColor,
          }
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static generateKagiConfig(
    data: CandleData[],
    reversalAmount: number,
    style: ChartStyle
  ): ChartConfiguration {
    const kagiData = AlternativeCharts.calculateKagi(data, reversalAmount);
    return {
      type: 'line',
      data: {
        labels: kagiData.map(d => new Date(d.timestamp).toISOString()),
        datasets: [{
          label: 'Kagi',
          data: kagiData.map(d => d.price),
          borderColor: kagiData.map(d => 
            d.direction === 'up' ? style.candleUpColor : style.candleDownColor
          ),
          borderWidth: kagiData.map(d => d.reversal ? 2 : 1),
          stepped: true,
        }]
      },
      options: this.getCommonOptions(style)
    };
  }

  private static getCommonOptions(style: ChartStyle) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        x: {
          type: 'time',
          grid: {
            color: style.gridColor,
          },
          ticks: {
            color: style.textColor,
          },
        },
        y: {
          type: 'linear',
          position: 'right',
          grid: {
            color: style.gridColor,
          },
          ticks: {
            color: style.textColor,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            color: style.textColor,
            font: {
              family: style.fontFamily,
            },
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
    };
  }

  private static generateCandlestickConfig(data: CandleData[], style: ChartStyle): ChartConfiguration {
    return {
      type: 'candlestick',
      data: {
        labels: data.map(d => new Date(d.timestamp).toISOString()),
        datasets: [
          {
            label: 'Price',
            data: data.map(d => ({
              x: d.timestamp,
              o: d.open,
              h: d.high,
              l: d.low,
              c: d.close,
            })),
            borderColor: style.candleUpColor,
            color: {
              up: style.candleUpColor,
              down: style.candleDownColor,
            },
          },
          {
            label: 'Volume',
            data: data.map((d, i) => ({
              x: d.timestamp,
              y: d.volume,
              color: d.close >= d.open ? style.volumeUpColor : style.volumeDownColor,
            })),
            type: 'bar',
            yAxisID: 'volume',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            type: 'time',
            grid: {
              color: style.gridColor,
            },
            ticks: {
              color: style.textColor,
            },
          },
          y: {
            type: 'linear',
            position: 'right',
            grid: {
              color: style.gridColor,
            },
            ticks: {
              color: style.textColor,
            },
          },
          volume: {
            type: 'linear',
            position: 'left',
            grid: {
              display: false,
            },
            ticks: {
              color: style.textColor,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: style.textColor,
              font: {
                family: style.fontFamily,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context: any) => {
                const label = context.dataset.label || '';
                if (label === 'Price') {
                  const point = context.raw;
                  return [
                    `Open: ${point.o}`,
                    `High: ${point.h}`,
                    `Low: ${point.l}`,
                    `Close: ${point.c}`,
                  ];
                }
                return `${label}: ${context.formattedValue}`;
              },
            },
          },
          crosshair: {
            line: {
              color: style.crosshairColor,
              width: 1,
            },
            sync: {
              enabled: true,
            },
            zoom: {
              enabled: true,
            },
          },
        },
      },
    };
  }

  private static addIndicator(
    config: ChartConfiguration,
    data: CandleData[],
    indicator: string,
    options: IndicatorOptions,
    color: string
  ) {
    const closes = data.map(d => d.close);
    const timestamps = data.map(d => d.timestamp);

    switch (indicator.toLowerCase()) {
      case 'sma':
        const sma = TechnicalIndicators.calculateSMA(closes, options.period || 20);
        this.addLineDataset(config, 'SMA', sma, timestamps, color);
        break;

      case 'ema':
        const ema = TechnicalIndicators.calculateEMA(closes, options.period || 20);
        this.addLineDataset(config, 'EMA', ema, timestamps, color);
        break;

      case 'bollinger':
        const bb = TechnicalIndicators.calculateBollingerBands(
          closes,
          options.period || 20,
          options.stdDev || 2
        );
        this.addBollingerBands(config, bb, timestamps, color);
        break;

      case 'macd':
        const macd = TechnicalIndicators.calculateMACD(closes);
        this.addMACDIndicator(config, macd, timestamps, color);
        break;

      case 'rsi':
        const rsi = TechnicalIndicators.calculateRSI(closes, options.period || 14);
        this.addRSIIndicator(config, rsi, timestamps, color);
        break;

      case 'ichimoku':
        const ichimoku = TechnicalIndicators.calculateIchimoku(data);
        this.addIchimokuCloud(config, ichimoku, timestamps, color);
        break;
    }
  }

  private static addLineDataset(
    config: ChartConfiguration,
    label: string,
    data: number[],
    timestamps: number[],
    color: string
  ) {
    config.data.datasets.push({
      label,
      data: data.map((value, i) => ({ x: timestamps[i], y: value })),
      type: 'line',
      borderColor: color,
      fill: false,
    });
  }

  private static addBollingerBands(
    config: ChartConfiguration,
    bands: { upper: number[]; middle: number[]; lower: number[] },
    timestamps: number[],
    color: string
  ) {
    const alpha = '33'; // 20% opacity
    config.data.datasets.push(
      {
        label: 'BB Upper',
        data: bands.upper.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: color,
        backgroundColor: `${color}${alpha}`,
        fill: '+1',
      },
      {
        label: 'BB Middle',
        data: bands.middle.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: color,
        fill: false,
      },
      {
        label: 'BB Lower',
        data: bands.lower.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: color,
        backgroundColor: `${color}${alpha}`,
        fill: '-1',
      }
    );
  }

  private static addMACDIndicator(
    config: ChartConfiguration,
    macd: { macd: number[]; signal: number[]; histogram: number[] },
    timestamps: number[],
    color: string
  ) {
    // Add MACD scale
    config.options.scales.macd = {
      type: 'linear',
      position: 'bottom',
      grid: {
        drawOnChartArea: false,
      },
    };

    config.data.datasets.push(
      {
        label: 'MACD',
        data: macd.macd.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: color,
        yAxisID: 'macd',
      },
      {
        label: 'Signal',
        data: macd.signal.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: `${color}88`,
        yAxisID: 'macd',
      },
      {
        label: 'Histogram',
        data: macd.histogram.map((value, i) => ({
          x: timestamps[i],
          y: value,
          color: value >= 0 ? color : `${color}88`,
        })),
        type: 'bar',
        backgroundColor: color,
        yAxisID: 'macd',
      }
    );
  }

  private static addRSIIndicator(
    config: ChartConfiguration,
    rsi: number[],
    timestamps: number[],
    color: string
  ) {
    // Add RSI scale
    config.options.scales.rsi = {
      type: 'linear',
      position: 'bottom',
      min: 0,
      max: 100,
      grid: {
        drawOnChartArea: false,
      },
    };

    config.data.datasets.push({
      label: 'RSI',
      data: rsi.map((value, i) => ({ x: timestamps[i], y: value })),
      type: 'line',
      borderColor: color,
      yAxisID: 'rsi',
    });
  }

  private static addIchimokuCloud(
    config: ChartConfiguration,
    ichimoku: {
      tenkan: number[];
      kijun: number[];
      senkou_a: number[];
      senkou_b: number[];
      chikou: number[];
    },
    timestamps: number[],
    color: string
  ) {
    const alpha = '33'; // 20% opacity
    config.data.datasets.push(
      {
        label: 'Tenkan-sen',
        data: ichimoku.tenkan.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: color,
        fill: false,
      },
      {
        label: 'Kijun-sen',
        data: ichimoku.kijun.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: `${color}88`,
        fill: false,
      },
      {
        label: 'Senkou Span A',
        data: ichimoku.senkou_a.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: `${color}`,
        backgroundColor: `${color}${alpha}`,
        fill: '+1',
      },
      {
        label: 'Senkou Span B',
        data: ichimoku.senkou_b.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: `${color}88`,
        backgroundColor: `${color}${alpha}`,
        fill: '-1',
      },
      {
        label: 'Chikou Span',
        data: ichimoku.chikou.map((value, i) => ({ x: timestamps[i], y: value })),
        type: 'line',
        borderColor: `${color}`,
        fill: false,
      }
    );
  }
}
