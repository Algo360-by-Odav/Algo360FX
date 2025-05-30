import { IChartApi, LineStyle, LineType, Time, DeepPartial, SeriesOptionsCommon, LineStyleOptions, HistogramStyleOptions } from 'lightweight-charts';

export interface DrawingObject {
  id: string;
  type: string;
  points: { x: number; y: number }[];
  style?: {
    color: string;
    lineWidth: DeepPartial<LineStyleOptions['lineWidth']>;
    lineStyle: LineStyle;
    lineType?: LineType;
  };
}

export class DrawingManager {
  private chart: IChartApi;
  private drawings: DrawingObject[] = [];
  private isDrawing = false;
  private currentDrawing: DrawingObject | null = null;
  private drawingType: string = 'line';

  constructor(chart: IChartApi) {
    this.chart = chart;
    this.setupEventListeners();
  }

  setDrawingType(type: string) {
    this.drawingType = type;
  }

  private setupEventListeners() {
    const container = this.chart.chartElement();
    
    container.addEventListener('mousedown', this.handleMouseDown);
    container.addEventListener('mousemove', this.handleMouseMove);
    container.addEventListener('mouseup', this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.isDrawing) {
      const point = this.getChartCoordinates(e);
      this.isDrawing = true;
      this.currentDrawing = {
        id: `drawing-${Date.now()}`,
        type: this.drawingType,
        points: [point],
        style: {
          color: '#2962FF',
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
        },
      };
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isDrawing && this.currentDrawing) {
      const point = this.getChartCoordinates(e);
      if (this.currentDrawing.points.length > 1) {
        this.currentDrawing.points[this.currentDrawing.points.length - 1] = point;
      } else {
        this.currentDrawing.points.push(point);
      }
      this.redrawCurrentObject();
    }
  };

  private handleMouseUp = () => {
    if (this.isDrawing && this.currentDrawing) {
      this.drawings.push(this.currentDrawing);
      this.isDrawing = false;
      this.currentDrawing = null;
    }
  };

  private getChartCoordinates(e: MouseEvent) {
    const rect = this.chart.chartElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  private redrawCurrentObject() {
    if (!this.currentDrawing) return;

    switch (this.currentDrawing.type) {
      case 'line':
        this.drawLine();
        break;
      case 'horizontalLine':
        this.drawHorizontalLine();
        break;
      case 'verticalLine':
        this.drawVerticalLine();
        break;
      case 'rectangle':
        this.drawRectangle();
        break;
      case 'fibonacci':
        this.drawFibonacci();
        break;
    }
  }

  private drawLine() {
    if (!this.currentDrawing || this.currentDrawing.points.length < 2) return;

    const [start, end] = this.currentDrawing.points;
    const lineSeries = this.chart.addLineSeries({
      color: this.currentDrawing.style?.color,
      lineWidth: this.currentDrawing.style?.lineWidth as DeepPartial<LineStyleOptions['lineWidth']>,
      lineStyle: this.currentDrawing.style?.lineStyle,
    });

    const startTime = this.chart.timeScale().coordinateToTime(start.x);
    const endTime = this.chart.timeScale().coordinateToTime(end.x);
    
    if (startTime && endTime) {
      lineSeries.setData([
        { time: startTime as Time, value: start.y },
        { time: endTime as Time, value: end.y },
      ]);
    }
  }

  private drawHorizontalLine() {
    if (!this.currentDrawing || !this.currentDrawing.points[0]) return;

    const point = this.currentDrawing.points[0];
    const series = this.chart.addLineSeries({
      color: this.currentDrawing.style?.color,
      lineWidth: this.currentDrawing.style?.lineWidth as DeepPartial<LineStyleOptions['lineWidth']>,
      lineStyle: this.currentDrawing.style?.lineStyle,
    });

    const timeRange = this.chart.timeScale().getVisibleLogicalRange();
    if (timeRange) {
      const visibleRange = {
        from: Math.floor(timeRange.from) as Time,
        to: Math.ceil(timeRange.to) as Time
      };
      series.setData([
        { time: visibleRange.from, value: point.y },
        { time: visibleRange.to, value: point.y },
      ]);
    }
  }

  private drawVerticalLine() {
    if (!this.currentDrawing || !this.currentDrawing.points[0]) return;

    const point = this.currentDrawing.points[0];
    const time = this.chart.timeScale().coordinateToTime(point.x);
    
    if (!time) return;

    const series = this.chart.addLineSeries({
      color: this.currentDrawing.style?.color,
      lineWidth: this.currentDrawing.style?.lineWidth as DeepPartial<LineStyleOptions['lineWidth']>,
      lineStyle: this.currentDrawing.style?.lineStyle,
    });

    const priceScale = this.chart.priceScale('right');
    const visiblePriceRange = priceScale.getVisibleRange();
    if (visiblePriceRange) {
      series.setData([
        { time: time as Time, value: visiblePriceRange.from },
        { time: time as Time, value: visiblePriceRange.to },
      ]);
    }
  }

  private drawRectangle() {
    if (!this.currentDrawing || this.currentDrawing.points.length < 2) return;

    const [start, end] = this.currentDrawing.points;
    const series = this.chart.addLineSeries({
      color: this.currentDrawing.style?.color,
      lineWidth: this.currentDrawing.style?.lineWidth as DeepPartial<LineStyleOptions['lineWidth']>,
      lineStyle: this.currentDrawing.style?.lineStyle,
    });

    const startTime = this.chart.timeScale().coordinateToTime(start.x);
    const endTime = this.chart.timeScale().coordinateToTime(end.x);
    
    if (startTime && endTime) {
      series.setData([
        { time: startTime as Time, value: start.y },
        { time: startTime as Time, value: end.y },
        { time: endTime as Time, value: end.y },
        { time: endTime as Time, value: start.y },
        { time: startTime as Time, value: start.y },
      ]);
    }
  }

  private drawFibonacci() {
    if (!this.currentDrawing || this.currentDrawing.points.length < 2) return;

    const [start, end] = this.currentDrawing.points;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const priceRange = Math.abs(end.y - start.y);
    const startPrice = Math.min(start.y, end.y);

    levels.forEach(level => {
      const series = this.chart.addLineSeries({
        color: this.currentDrawing?.style?.color || '#2962FF',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
      });

      const price = startPrice + priceRange * level;
      const timeRange = this.chart.timeScale().getVisibleRange();
      if (timeRange) {
        series.setData([
          { time: timeRange.from, value: price },
          { time: timeRange.to, value: price },
        ]);
      }
    });
  }

  clearDrawings() {
    this.drawings = [];
    // Need to implement actual clearing of drawings from chart
  }

  removeDrawing(id: string) {
    this.drawings = this.drawings.filter(d => d.id !== id);
    // Need to implement actual removal of specific drawing
  }

  cleanup() {
    const container = this.chart.chartElement();
    container.removeEventListener('mousedown', this.handleMouseDown);
    container.removeEventListener('mousemove', this.handleMouseMove);
    container.removeEventListener('mouseup', this.handleMouseUp);
  }
}
