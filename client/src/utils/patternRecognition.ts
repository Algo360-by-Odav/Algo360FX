interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface Pattern {
  type: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
  description: string;
}

export class PatternRecognition {
  static findPatterns(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Check for various patterns
    patterns.push(...this.findDoubleTop(data));
    patterns.push(...this.findDoubleBottom(data));
    patterns.push(...this.findHeadAndShoulders(data));
    patterns.push(...this.findBullishEngulfing(data));
    patterns.push(...this.findBearishEngulfing(data));
    patterns.push(...this.findDoji(data));
    
    return patterns;
  }

  private static findDoubleTop(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];
    const lookbackPeriod = 20;

    for (let i = lookbackPeriod; i < data.length - 5; i++) {
      const segment = data.slice(i - lookbackPeriod, i + 1);
      const highs = segment.map(d => d.high);
      
      // Find local maxima
      const peaks = this.findPeaks(highs);
      
      if (peaks.length >= 2) {
        const [peak1, peak2] = peaks.slice(-2);
        const peak1Value = highs[peak1];
        const peak2Value = highs[peak2];
        
        // Check if peaks are within 2% of each other
        if (Math.abs(peak1Value - peak2Value) / peak1Value < 0.02) {
          patterns.push({
            type: 'Double Top',
            confidence: 0.8,
            startIndex: i - lookbackPeriod + peak1,
            endIndex: i - lookbackPeriod + peak2,
            description: 'Potential reversal pattern indicating a bearish trend',
          });
        }
      }
    }

    return patterns;
  }

  private static findDoubleBottom(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];
    const lookbackPeriod = 20;

    for (let i = lookbackPeriod; i < data.length - 5; i++) {
      const segment = data.slice(i - lookbackPeriod, i + 1);
      const lows = segment.map(d => d.low);
      
      // Find local minima
      const troughs = this.findTroughs(lows);
      
      if (troughs.length >= 2) {
        const [trough1, trough2] = troughs.slice(-2);
        const trough1Value = lows[trough1];
        const trough2Value = lows[trough2];
        
        // Check if troughs are within 2% of each other
        if (Math.abs(trough1Value - trough2Value) / trough1Value < 0.02) {
          patterns.push({
            type: 'Double Bottom',
            confidence: 0.8,
            startIndex: i - lookbackPeriod + trough1,
            endIndex: i - lookbackPeriod + trough2,
            description: 'Potential reversal pattern indicating a bullish trend',
          });
        }
      }
    }

    return patterns;
  }

  private static findHeadAndShoulders(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];
    const lookbackPeriod = 30;

    for (let i = lookbackPeriod; i < data.length - 5; i++) {
      const segment = data.slice(i - lookbackPeriod, i + 1);
      const highs = segment.map(d => d.high);
      
      // Find local maxima
      const peaks = this.findPeaks(highs);
      
      if (peaks.length >= 3) {
        const [shoulder1, head, shoulder2] = peaks.slice(-3);
        const shoulder1Value = highs[shoulder1];
        const headValue = highs[head];
        const shoulder2Value = highs[shoulder2];
        
        // Check if head is higher than shoulders and shoulders are at similar levels
        if (headValue > shoulder1Value && 
            headValue > shoulder2Value && 
            Math.abs(shoulder1Value - shoulder2Value) / shoulder1Value < 0.03) {
          patterns.push({
            type: 'Head and Shoulders',
            confidence: 0.7,
            startIndex: i - lookbackPeriod + shoulder1,
            endIndex: i - lookbackPeriod + shoulder2,
            description: 'Classic reversal pattern indicating potential trend change from bullish to bearish',
          });
        }
      }
    }

    return patterns;
  }

  private static findBullishEngulfing(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];

    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];

      if (previous.close < previous.open && // Previous candle is bearish
          current.close > current.open &&   // Current candle is bullish
          current.open < previous.close &&  // Current opens below previous close
          current.close > previous.open) {  // Current closes above previous open
        patterns.push({
          type: 'Bullish Engulfing',
          confidence: 0.6,
          startIndex: i - 1,
          endIndex: i,
          description: 'Bullish reversal pattern indicating potential upward movement',
        });
      }
    }

    return patterns;
  }

  private static findBearishEngulfing(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];

    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];

      if (previous.close > previous.open && // Previous candle is bullish
          current.close < current.open &&   // Current candle is bearish
          current.open > previous.close &&  // Current opens above previous close
          current.close < previous.open) {  // Current closes below previous open
        patterns.push({
          type: 'Bearish Engulfing',
          confidence: 0.6,
          startIndex: i - 1,
          endIndex: i,
          description: 'Bearish reversal pattern indicating potential downward movement',
        });
      }
    }

    return patterns;
  }

  private static findDoji(data: CandleData[]): Pattern[] {
    const patterns: Pattern[] = [];

    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      const bodySize = Math.abs(candle.open - candle.close);
      const totalSize = candle.high - candle.low;
      
      // Check if body is very small compared to total size
      if (bodySize / totalSize < 0.1) {
        patterns.push({
          type: 'Doji',
          confidence: 0.5,
          startIndex: i,
          endIndex: i,
          description: 'Indicates market indecision, potential reversal when appearing after a trend',
        });
      }
    }

    return patterns;
  }

  private static findPeaks(values: number[]): number[] {
    const peaks: number[] = [];
    
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
        peaks.push(i);
      }
    }
    
    return peaks;
  }

  private static findTroughs(values: number[]): number[] {
    const troughs: number[] = [];
    
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] < values[i - 1] && values[i] < values[i + 1]) {
        troughs.push(i);
      }
    }
    
    return troughs;
  }
}
