export interface MACDInput {
  values: number[];
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  SimpleMAOscillator: boolean;
  SimpleMASignal: boolean;
}

export interface TechnicalIndicator {
  name: string;
  value: number | number[];
  signal?: string;
}
