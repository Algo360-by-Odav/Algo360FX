import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { createChart, IChartApi } from 'lightweight-charts';
import { DeepPartial } from 'lightweight-charts';

interface VolumeProfileProps {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

interface CustomPriceFormat {
  type: 'volume';
  precision?: number;
  minMove?: number;
}

interface VolumeHistogramOptions {
  color: string;
  priceFormat: CustomPriceFormat;
  priceScaleId: string;
  base?: number;
  scaleMargins?: {
    top: number;
    bottom: number;
  };
  visible?: boolean;
}

const VolumeProfile: React.FC<VolumeProfileProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: {
          color: '#253248',
        },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Calculate volume profile
    const pricePoints = new Map<number, number>();
    const priceStep = calculatePriceStep(data);

    data.forEach((candle) => {
      const volumePerPrice = candle.volume / ((candle.high - candle.low) / priceStep);
      for (let price = candle.low; price <= candle.high; price += priceStep) {
        const roundedPrice = Math.round(price / priceStep) * priceStep;
        pricePoints.set(
          roundedPrice,
          (pricePoints.get(roundedPrice) || 0) + volumePerPrice
        );
      }
    });

    // Convert to histogram data
    const histogramData = Array.from(pricePoints.entries())
      .map(([price, volume]) => ({
        time: data[0].time,
        value: volume,
        price,
      }))
      .sort((a, b) => a.price - b.price);

    // Add histogram series
    const series = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
        precision: 0,
        minMove: 1,
      },
      priceScaleId: 'volume',
      base: 0,
      scaleMargins: {
        top: 0.7,
        bottom: 0
      },
      visible: true
    } as DeepPartial<VolumeHistogramOptions>);

    series.setData(histogramData);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [data]);

  // Helper function to calculate appropriate price step
  const calculatePriceStep = (data: VolumeProfileProps['data']) => {
    const prices = data.flatMap((candle) => [candle.high, candle.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    return range / 100; // Divide range into 100 price levels
  };

  return (
    <Box
      ref={chartContainerRef}
      sx={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default VolumeProfile;
