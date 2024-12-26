import { Chart } from 'chart.js';
import { ComparisonSeries, CandleData } from '../types/trading';

export class ChartComparisonService {
  private chart: Chart;
  private series: Map<string, ComparisonSeries>;
  private baseSymbol: string;
  private normalizeToPercentage: boolean;

  constructor(chart: Chart, baseSymbol: string) {
    this.chart = chart;
    this.series = new Map();
    this.baseSymbol = baseSymbol;
    this.normalizeToPercentage = true;
  }

  addComparisonSeries(series: ComparisonSeries) {
    this.series.set(series.id, series);
    this.updateChart();
  }

  removeComparisonSeries(id: string) {
    this.series.delete(id);
    this.updateChart();
  }

  updateSeriesVisibility(id: string, visible: boolean) {
    const series = this.series.get(id);
    if (series) {
      series.visible = visible;
      this.updateChart();
    }
  }

  setNormalizationMode(normalize: boolean) {
    this.normalizeToPercentage = normalize;
    this.updateChart();
  }

  private updateChart() {
    // Remove existing comparison datasets
    this.chart.data.datasets = this.chart.data.datasets.filter(
      dataset => !dataset.label?.startsWith('Compare:')
    );

    // Add comparison datasets
    this.series.forEach(series => {
      if (series.visible) {
        this.addComparisonDataset(series);
      }
    });

    this.chart.update();
  }

  private addComparisonDataset(series: ComparisonSeries) {
    const normalizedData = this.normalizeData(series.data);
    
    const dataset = {
      label: `Compare: ${series.symbol}`,
      data: normalizedData,
      borderColor: series.color,
      backgroundColor: series.color + '20',
      yAxisID: this.normalizeToPercentage ? 'percentage' : 'price',
      fill: false,
      tension: 0.1,
    };

    this.chart.data.datasets.push(dataset);

    // Ensure we have the correct scale
    if (this.normalizeToPercentage && !this.chart.options.scales?.percentage) {
      this.addPercentageScale();
    }
  }

  private normalizeData(data: CandleData[]): number[] {
    if (!this.normalizeToPercentage) {
      return data.map(d => d.close);
    }

    const baseValue = data[0]?.close || 1;
    return data.map(d => ((d.close - baseValue) / baseValue) * 100);
  }

  private addPercentageScale() {
    if (!this.chart.options.scales) {
      this.chart.options.scales = {};
    }

    this.chart.options.scales.percentage = {
      type: 'linear',
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        callback: (value: number) => `${value.toFixed(2)}%`,
      },
    };
  }

  // Helper methods for syncing multiple symbols
  static async fetchComparisonData(
    symbol: string,
    timeframe: string,
    startTime: number,
    endTime: number
  ): Promise<CandleData[]> {
    try {
      const response = await fetch(
        `/api/market-data/${symbol}?timeframe=${timeframe}&start=${startTime}&end=${endTime}`
      );
      return await response.json();
    } catch (error) {
      console.error(`Error fetching comparison data for ${symbol}:`, error);
      return [];
    }
  }

  static normalizeTimeframes(
    baseSeries: CandleData[],
    comparisonSeries: CandleData[]
  ): CandleData[] {
    const baseTimestamps = new Set(baseSeries.map(candle => candle.timestamp));
    return comparisonSeries.filter(candle => baseTimestamps.has(candle.timestamp));
  }

  static calculateCorrelation(series1: number[], series2: number[]): number {
    const n = Math.min(series1.length, series2.length);
    if (n < 2) return 0;

    const mean1 = series1.reduce((a, b) => a + b, 0) / n;
    const mean2 = series2.reduce((a, b) => a + b, 0) / n;

    const variance1 = series1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
    const variance2 = series2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);

    const covariance = series1
      .slice(0, n)
      .reduce((a, b, i) => a + (b - mean1) * (series2[i] - mean2), 0);

    return covariance / Math.sqrt(variance1 * variance2);
  }

  static calculateBeta(
    marketReturns: number[],
    symbolReturns: number[]
  ): number {
    const n = Math.min(marketReturns.length, symbolReturns.length);
    if (n < 2) return 0;

    const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / n;
    const meanSymbol = symbolReturns.reduce((a, b) => a + b, 0) / n;

    const covariance = marketReturns
      .slice(0, n)
      .reduce((a, b, i) => a + (b - meanMarket) * (symbolReturns[i] - meanSymbol), 0) / n;

    const marketVariance = marketReturns.reduce((a, b) => a + Math.pow(b - meanMarket, 2), 0) / n;

    return covariance / marketVariance;
  }

  static calculateRelativeStrength(
    series1: CandleData[],
    series2: CandleData[]
  ): number[] {
    return series1.map((candle, i) => {
      if (!series2[i]) return 1;
      return candle.close / series2[i].close;
    });
  }
}
