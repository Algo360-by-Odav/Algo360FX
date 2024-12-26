import React, { useState } from 'react';
import { TradingChart } from '../components/TradingChart/TradingChart';
import { ChartComparisonService } from '../services/ChartComparisonService';
import { 
  DrawingTool, 
  ChartAnnotation, 
  ComparisonSeries,
  ExtendedChartOptions 
} from '../types/trading';

const ChartExample: React.FC = () => {
  // State for drawing tools
  const [drawingTool, setDrawingTool] = useState<DrawingTool | null>(null);
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  
  // State for comparisons
  const [comparisons, setComparisons] = useState<ComparisonSeries[]>([]);
  
  // State for chart options
  const [chartOptions, setChartOptions] = useState<Partial<ExtendedChartOptions>>({
    showVolume: true,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    theme: 'dark',
    enableZoom: true,
    enablePan: true,
    timeFormat: 'HH:mm',
    priceFormat: {
      precision: 2,
      minMove: 0.01
    }
  });

  // Drawing tool options
  const drawingTools: DrawingTool[] = [
    {
      type: 'line',
      mode: 'draw',
      style: { color: '#FF0000', lineWidth: 2 }
    },
    {
      type: 'fibonacci',
      mode: 'draw',
      style: { color: '#FFD700', lineWidth: 1 }
    },
    // Add more tools as needed
  ];

  // Handle drawing tool selection
  const handleToolSelect = (tool: DrawingTool | null) => {
    setDrawingTool(tool);
  };

  // Handle new annotations
  const handleAnnotationAdd = (annotation: ChartAnnotation) => {
    setAnnotations(prev => [...prev, annotation]);
  };

  // Handle comparison symbol addition
  const handleAddComparison = async (symbol: string) => {
    try {
      const data = await ChartComparisonService.fetchComparisonData(
        symbol,
        '1h',
        Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        Date.now()
      );

      const newComparison: ComparisonSeries = {
        id: `${symbol}-${Date.now()}`,
        symbol,
        data,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        visible: true,
        type: 'percentage'
      };

      setComparisons(prev => [...prev, newComparison]);
    } catch (error) {
      console.error('Error adding comparison:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Drawing Tools */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Drawing Tools</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleToolSelect(null)}
            className={`px-3 py-1 rounded ${!drawingTool ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            None
          </button>
          {drawingTools.map(tool => (
            <button
              key={tool.type}
              onClick={() => handleToolSelect(tool)}
              className={`px-3 py-1 rounded ${
                drawingTool?.type === tool.type ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {tool.type}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Tools */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Compare With</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter symbol (e.g., EURUSD)"
            className="px-3 py-1 border rounded"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                handleAddComparison(input.value.toUpperCase());
                input.value = '';
              }
            }}
          />
        </div>
        {/* Active Comparisons */}
        <div className="flex gap-2 mt-2">
          {comparisons.map(comparison => (
            <div
              key={comparison.id}
              className="flex items-center bg-gray-200 px-2 py-1 rounded"
            >
              <span>{comparison.symbol}</span>
              <button
                onClick={() => setComparisons(prev => 
                  prev.filter(c => c.id !== comparison.id)
                )}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Options */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Chart Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chartOptions.showVolume}
              onChange={e => setChartOptions(prev => ({
                ...prev,
                showVolume: e.target.checked
              }))}
              className="mr-2"
            />
            Show Volume
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chartOptions.showGrid}
              onChange={e => setChartOptions(prev => ({
                ...prev,
                showGrid: e.target.checked
              }))}
              className="mr-2"
            />
            Show Grid
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chartOptions.enableZoom}
              onChange={e => setChartOptions(prev => ({
                ...prev,
                enableZoom: e.target.checked
              }))}
              className="mr-2"
            />
            Enable Zoom
          </label>
        </div>
      </div>

      {/* Trading Chart */}
      <TradingChart
        data={[]} // Add your market data here
        chartType="candlestick"
        drawingTool={drawingTool}
        annotations={annotations}
        comparisons={comparisons}
        chartOptions={chartOptions}
        onAnnotationAdd={handleAnnotationAdd}
        onAnnotationUpdate={(id, updates) => {
          setAnnotations(prev =>
            prev.map(ann => (ann.id === id ? { ...ann, ...updates } : ann))
          );
        }}
        onAnnotationDelete={id => {
          setAnnotations(prev => prev.filter(ann => ann.id !== id));
        }}
        height={600}
      />
    </div>
  );
};

export default ChartExample;
