import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import './TradingView.css';

interface TradingViewProps {
  data?: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  symbol?: string;
  interval?: string;
}

const TradingView: React.FC<TradingViewProps> = ({
  data = [],
  symbol = 'EURUSD',
  interval = '1D'
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#1e222d' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2b2b43' },
          horzLines: { color: '#2b2b43' },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: '#2b2b43',
        },
        timeScale: {
          borderColor: '#2b2b43',
          timeVisible: true,
        },
        watermark: {
          color: 'rgba(255, 255, 255, 0.1)',
          visible: true,
          text: 'ALGO360',
          fontSize: 18,
          horzAlign: 'right',
          vertAlign: 'bottom',
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      if (data.length > 0) {
        candlestickSeries.setData(data);
      }

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [data]);

  return (
    <div className="trading-view">
      <div className="trading-view__header">
        <h2>{symbol}</h2>
        <span className="trading-view__interval">{interval}</span>
      </div>
      <div className="trading-view__chart" ref={chartContainerRef} />
      <div className="trading-view__toolbar">
        {/* Add toolbar buttons here */}
      </div>
    </div>
  );
};

export default TradingView;
