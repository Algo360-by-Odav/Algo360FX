import { ISeriesApi, LineData, Time } from 'lightweight-charts';

export interface IndicatorConfig {
  period?: number;
  source?: 'close' | 'open' | 'high' | 'low' | 'hl2' | 'hlc3' | 'ohlc4';
  stdDev?: number;
  signalPeriod?: number;
}

export const calculateSMA = (data: LineData[], period: number): LineData[] => {
  const sma: LineData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + (val.value as number), 0);
    sma.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return sma;
};

export const calculateEMA = (data: LineData[], period: number): LineData[] => {
  const ema: LineData[] = [];
  const multiplier = 2 / (period + 1);
  let prevEMA = data[0].value as number;

  for (let i = 0; i < data.length; i++) {
    const currentValue = data[i].value as number;
    const currentEMA = (currentValue - prevEMA) * multiplier + prevEMA;
    ema.push({
      time: data[i].time,
      value: currentEMA,
    });
    prevEMA = currentEMA;
  }
  return ema;
};

export const calculateRSI = (data: LineData[], period: number): LineData[] => {
  const rsi: LineData[] = [];
  let gains: number[] = [];
  let losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = (data[i].value as number) - (data[i - 1].value as number);
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // Calculate initial averages
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

  // Calculate RSI values
  for (let i = period; i < data.length; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;

    const rs = avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));

    rsi.push({
      time: data[i].time,
      value: rsiValue,
    });
  }

  return rsi;
};

export const calculateMACD = (data: LineData[], config: IndicatorConfig): {
  macd: LineData[];
  signal: LineData[];
  histogram: LineData[];
} => {
  const fastPeriod = 12;
  const slowPeriod = 26;
  const signalPeriod = config.signalPeriod || 9;

  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine: LineData[] = [];
  for (let i = 0; i < fastEMA.length; i++) {
    if (i < slowEMA.length) {
      macdLine.push({
        time: fastEMA[i].time,
        value: (fastEMA[i].value as number) - (slowEMA[i].value as number),
      });
    }
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram: LineData[] = [];

  for (let i = 0; i < macdLine.length; i++) {
    if (i < signalLine.length) {
      histogram.push({
        time: macdLine[i].time,
        value: (macdLine[i].value as number) - (signalLine[i].value as number),
      });
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram,
  };
};

export const calculateBollingerBands = (data: LineData[], config: IndicatorConfig): {
  upper: LineData[];
  middle: LineData[];
  lower: LineData[];
} => {
  const period = config.period || 20;
  const stdDev = config.stdDev || 2;
  const sma = calculateSMA(data, period);
  const upper: LineData[] = [];
  const lower: LineData[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = sma[i - (period - 1)].value as number;
    
    const squaredDiffs = slice.map(d => Math.pow((d.value as number) - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / period;
    const standardDeviation = Math.sqrt(variance);

    upper.push({
      time: data[i].time,
      value: mean + (standardDeviation * stdDev),
    });

    lower.push({
      time: data[i].time,
      value: mean - (standardDeviation * stdDev),
    });
  }

  return {
    upper,
    middle: sma,
    lower,
  };
};

export const calculateIchimokuCloud = (data: LineData[]): {
  conversion: LineData[];
  base: LineData[];
  spanA: LineData[];
  spanB: LineData[];
  laggingSpan: LineData[];
} => {
  const conversionPeriod = 9;
  const basePeriod = 26;
  const spanBPeriod = 52;
  const displacement = 26;

  const calculateHighLow = (slice: LineData[], period: number) => {
    const high = Math.max(...slice.map(d => d.value as number));
    const low = Math.min(...slice.map(d => d.value as number));
    return (high + low) / 2;
  };

  const conversion: LineData[] = [];
  const base: LineData[] = [];
  const spanA: LineData[] = [];
  const spanB: LineData[] = [];
  const laggingSpan: LineData[] = [];

  for (let i = spanBPeriod - 1; i < data.length; i++) {
    // Conversion Line (Tenkan-sen)
    conversion.push({
      time: data[i].time,
      value: calculateHighLow(data.slice(i - conversionPeriod + 1, i + 1), conversionPeriod),
    });

    // Base Line (Kijun-sen)
    base.push({
      time: data[i].time,
      value: calculateHighLow(data.slice(i - basePeriod + 1, i + 1), basePeriod),
    });

    // Span A (Senkou Span A)
    if (i - displacement >= 0) {
      spanA.push({
        time: data[i - displacement].time,
        value: (conversion[conversion.length - 1].value as number + base[base.length - 1].value as number) / 2,
      });
    }

    // Span B (Senkou Span B)
    if (i - displacement >= 0) {
      spanB.push({
        time: data[i - displacement].time,
        value: calculateHighLow(data.slice(i - spanBPeriod + 1, i + 1), spanBPeriod),
      });
    }

    // Lagging Span (Chikou Span)
    if (i + displacement < data.length) {
      laggingSpan.push({
        time: data[i + displacement].time,
        value: data[i].value,
      });
    }
  }

  return {
    conversion,
    base,
    spanA,
    spanB,
    laggingSpan,
  };
};
