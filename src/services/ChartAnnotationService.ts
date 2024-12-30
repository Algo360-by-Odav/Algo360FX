import { Chart } from 'chart.js';
import { ChartAnnotation, DrawingTool } from '../types/trading';

export class ChartAnnotationService {
  private chart: Chart;
  private annotations: Map<string, ChartAnnotation>;
  private currentTool: DrawingTool | null;
  private isDrawing: boolean;
  private tempPoints: Array<{ x: number; y: number }>;

  constructor(chart: Chart) {
    this.chart = chart;
    this.annotations = new Map();
    this.currentTool = null;
    this.isDrawing = false;
    this.tempPoints = [];

    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    const canvas = this.chart.canvas;
    
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
  }

  setDrawingTool(tool: DrawingTool | null) {
    this.currentTool = tool;
    this.isDrawing = false;
    this.tempPoints = [];
  }

  private handleMouseDown(event: MouseEvent) {
    if (!this.currentTool || this.currentTool.mode !== 'draw') return;

    const point = this.getChartPoint(event);
    this.isDrawing = true;
    this.tempPoints = [point];

    if (this.currentTool.type === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        this.addAnnotation({
          id: Date.now().toString(),
          type: 'text',
          points: [point],
          text,
          style: this.currentTool.style,
          visible: true,
        });
      }
      this.isDrawing = false;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isDrawing || !this.currentTool) return;

    const point = this.getChartPoint(event);
    
    if (this.tempPoints.length > 0) {
      // Update temporary drawing
      this.drawTemporary(this.tempPoints[0], point);
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (!this.isDrawing || !this.currentTool) return;

    const point = this.getChartPoint(event);
    this.tempPoints.push(point);

    if (this.shouldCompleteDrawing()) {
      this.completeDrawing();
    }
  }

  private handleDoubleClick() {
    if (this.isDrawing && this.currentTool?.type === 'fibonacci' || this.currentTool?.type === 'pitchfork') {
      this.completeDrawing();
    }
  }

  private shouldCompleteDrawing(): boolean {
    if (!this.currentTool) return false;

    switch (this.currentTool.type) {
      case 'line':
      case 'arrow':
      case 'rectangle':
      case 'circle':
        return this.tempPoints.length === 2;
      case 'fibonacci':
      case 'pitchfork':
        return this.tempPoints.length === 3;
      default:
        return true;
    }
  }

  private completeDrawing() {
    if (!this.currentTool) return;

    const annotation: ChartAnnotation = {
      id: Date.now().toString(),
      type: this.currentTool.type,
      points: [...this.tempPoints],
      style: { ...this.currentTool.style },
      visible: true,
    };

    this.addAnnotation(annotation);
    this.isDrawing = false;
    this.tempPoints = [];
    this.chart.update();
  }

  addAnnotation(annotation: ChartAnnotation) {
    this.annotations.set(annotation.id, annotation);
    this.redrawAnnotations();
  }

  removeAnnotation(id: string) {
    this.annotations.delete(id);
    this.redrawAnnotations();
  }

  updateAnnotation(id: string, updates: Partial<ChartAnnotation>) {
    const annotation = this.annotations.get(id);
    if (annotation) {
      Object.assign(annotation, updates);
      this.redrawAnnotations();
    }
  }

  private getChartPoint(event: MouseEvent): { x: number; y: number } {
    const rect = this.chart.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xValue = this.chart.scales.x.getValueForPixel(x);
    const yValue = this.chart.scales.y.getValueForPixel(y);
    
    return { x: xValue, y: yValue };
  }

  private redrawAnnotations() {
    // Clear existing annotations
    const existingAnnotations = this.chart.options.plugins?.annotation?.annotations || {};
    Object.keys(existingAnnotations).forEach(key => {
      delete existingAnnotations[key];
    });

    // Add all current annotations
    this.annotations.forEach(annotation => {
      if (annotation.visible) {
        this.drawAnnotation(annotation);
      }
    });

    this.chart.update();
  }

  private drawTemporary(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (!this.currentTool) return;

    const tempAnnotation: ChartAnnotation = {
      id: 'temp',
      type: this.currentTool.type,
      points: [start, end],
      style: this.currentTool.style,
      visible: true,
    };

    this.drawAnnotation(tempAnnotation);
    this.chart.update();
  }

  private drawAnnotation(annotation: ChartAnnotation) {
    if (!this.chart.options.plugins) {
      this.chart.options.plugins = {};
    }
    if (!this.chart.options.plugins.annotation) {
      this.chart.options.plugins.annotation = {
        annotations: {},
      };
    }

    const annotationConfig = this.createAnnotationConfig(annotation);
    if (annotationConfig) {
      this.chart.options.plugins.annotation.annotations[annotation.id] = annotationConfig;
    }
  }

  private createAnnotationConfig(annotation: ChartAnnotation): any {
    const baseConfig = {
      borderColor: annotation.style.color,
      borderWidth: annotation.style.lineWidth,
      backgroundColor: annotation.style.fillColor,
    };

    switch (annotation.type) {
      case 'line':
        return {
          type: 'line',
          ...baseConfig,
          xMin: annotation.points[0].x,
          yMin: annotation.points[0].y,
          xMax: annotation.points[1].x,
          yMax: annotation.points[1].y,
        };

      case 'rectangle':
        return {
          type: 'box',
          ...baseConfig,
          xMin: Math.min(annotation.points[0].x, annotation.points[1].x),
          yMin: Math.min(annotation.points[0].y, annotation.points[1].y),
          xMax: Math.max(annotation.points[0].x, annotation.points[1].x),
          yMax: Math.max(annotation.points[0].y, annotation.points[1].y),
        };

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(annotation.points[1].x - annotation.points[0].x, 2) +
          Math.pow(annotation.points[1].y - annotation.points[0].y, 2)
        );
        return {
          type: 'circle',
          ...baseConfig,
          x: annotation.points[0].x,
          y: annotation.points[0].y,
          radius,
        };

      case 'text':
        return {
          type: 'label',
          ...baseConfig,
          content: annotation.text || '',
          position: {
            x: annotation.points[0].x,
            y: annotation.points[0].y,
          },
          font: {
            size: annotation.style.fontSize,
            family: annotation.style.fontFamily,
          },
        };

      case 'arrow':
        return {
          type: 'line',
          ...baseConfig,
          xMin: annotation.points[0].x,
          yMin: annotation.points[0].y,
          xMax: annotation.points[1].x,
          yMax: annotation.points[1].y,
          arrowHeads: {
            end: true,
          },
        };

      case 'fibonacci':
        return this.createFibonacciLevels(annotation);

      case 'pitchfork':
        return this.createPitchfork(annotation);

      default:
        return null;
    }
  }

  private createFibonacciLevels(annotation: ChartAnnotation) {
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const [start, end] = annotation.points;
    const height = end.y - start.y;

    return levels.map((level, index) => ({
      type: 'line',
      borderColor: annotation.style.color,
      borderWidth: annotation.style.lineWidth,
      xMin: start.x,
      xMax: end.x,
      yMin: start.y + height * level,
      yMax: start.y + height * level,
      label: {
        content: `${(level * 100).toFixed(1)}%`,
        position: 'left',
      },
    }));
  }

  private createPitchfork(annotation: ChartAnnotation) {
    if (annotation.points.length < 3) return null;

    const [p1, p2, p3] = annotation.points;
    const midpoint = {
      x: (p2.x + p3.x) / 2,
      y: (p2.y + p3.y) / 2,
    };

    return [
      // Handle
      {
        type: 'line',
        borderColor: annotation.style.color,
        borderWidth: annotation.style.lineWidth,
        xMin: p1.x,
        yMin: p1.y,
        xMax: midpoint.x,
        yMax: midpoint.y,
      },
      // Left prong
      {
        type: 'line',
        borderColor: annotation.style.color,
        borderWidth: annotation.style.lineWidth,
        xMin: p1.x,
        yMin: p1.y,
        xMax: p2.x,
        yMax: p2.y,
      },
      // Right prong
      {
        type: 'line',
        borderColor: annotation.style.color,
        borderWidth: annotation.style.lineWidth,
        xMin: p1.x,
        yMin: p1.y,
        xMax: p3.x,
        yMax: p3.y,
      },
    ];
  }
}
