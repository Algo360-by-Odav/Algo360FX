import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { ChartService } from '../../services/ChartService';
import { ChartAnnotationService } from '../../services/ChartAnnotationService';
import { ChartComparisonService } from '../../services/ChartComparisonService';
import { 
  CandleData, 
  ChartStyle, 
  IndicatorOptions, 
  ChartType,
  AreaChartOptions,
  ScatterChartOptions,
  ExtendedChartOptions,
  DrawingTool,
  ComparisonSeries,
  ChartAnnotation
} from '../../types/trading';

interface TradingChartProps {
  data: CandleData[];
  chartType?: ChartType;
  indicators?: string[];
  indicatorOptions?: IndicatorOptions;
  chartOptions?: AreaChartOptions & ScatterChartOptions & Partial<ExtendedChartOptions>;
  style?: Partial<ChartStyle>;
  height?: number;
  width?: string;
  onChartReady?: (chart: Chart) => void;
  annotations?: ChartAnnotation[];
  comparisons?: ComparisonSeries[];
  drawingTool?: DrawingTool | null;
  onAnnotationAdd?: (annotation: ChartAnnotation) => void;
  onAnnotationUpdate?: (id: string, annotation: Partial<ChartAnnotation>) => void;
  onAnnotationDelete?: (id: string) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  data,
  chartType = 'candlestick',
  indicators = ['sma', 'bollinger'],
  indicatorOptions = { period: 20, stdDev: 2 },
  chartOptions = {},
  style = {},
  height = 500,
  width = '100%',
  onChartReady,
  annotations = [],
  comparisons = [],
  drawingTool = null,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const [annotationService, setAnnotationService] = useState<ChartAnnotationService | null>(null);
  const [comparisonService, setComparisonService] = useState<ChartComparisonService | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chart) {
        chart.destroy();
      }

      const newChart = ChartService.createChart(
        chartRef.current,
        data,
        chartType,
        indicators,
        { ...indicatorOptions, ...chartOptions },
        style
      );

      const newAnnotationService = new ChartAnnotationService(newChart);
      const newComparisonService = new ChartComparisonService(newChart, data[0]?.symbol || '');

      setChart(newChart);
      setAnnotationService(newAnnotationService);
      setComparisonService(newComparisonService);

      if (onChartReady) {
        onChartReady(newChart);
      }
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [data, chartType, indicators, indicatorOptions, chartOptions, style]);

  useEffect(() => {
    if (annotationService) {
      annotationService.setDrawingTool(drawingTool);

      annotations.forEach(annotation => {
        annotationService.addAnnotation(annotation);
      });
    }
  }, [annotations, drawingTool, annotationService]);

  useEffect(() => {
    if (comparisonService) {
      comparisons.forEach(series => {
        comparisonService.addComparisonSeries(series);
      });
    }
  }, [comparisons, comparisonService]);

  useEffect(() => {
    if (annotationService) {
      const handleAnnotationAdd = (annotation: ChartAnnotation) => {
        if (onAnnotationAdd) {
          onAnnotationAdd(annotation);
        }
      };

      const handleAnnotationUpdate = (id: string, updates: Partial<ChartAnnotation>) => {
        if (onAnnotationUpdate) {
          onAnnotationUpdate(id, updates);
        }
      };

      const handleAnnotationDelete = (id: string) => {
        if (onAnnotationDelete) {
          onAnnotationDelete(id);
        }
      };

      // Add event listeners
      // Note: Implementation depends on your event system
    }
  }, [annotationService, onAnnotationAdd, onAnnotationUpdate, onAnnotationDelete]);

  return (
    <div style={{ width, height }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TradingChart;
