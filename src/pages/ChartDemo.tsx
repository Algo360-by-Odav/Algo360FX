import React, { useState, useEffect } from 'react';
import TradingChart from '../components/TradingChart/TradingChart';
import { CandleData, IndicatorOptions, ChartStyle, ChartType, AreaChartOptions, ScatterChartOptions, ChartAnnotation, ComparisonSeries, DrawingTool } from '../types/trading';

const AVAILABLE_INDICATORS = [
  'sma',
  'ema',
  'bollinger',
  'macd',
  'rsi',
  'ichimoku'
] as const;

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

const CHART_TYPES: ChartType[] = [
  'candlestick',
  'line',
  'area',
  'scatter',
  'bubble',
  'heikinAshi',
  'renko',
  'kagi'
];

const ChartDemo: React.FC = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['sma', 'bollinger']);
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [indicatorOptions, setIndicatorOptions] = useState<IndicatorOptions>({
    period: 20,
    stdDev: 2,
  });
  const [chartOptions, setChartOptions] = useState<AreaChartOptions & ScatterChartOptions>({
    fillOpacity: 0.2,
    showPoints: true,
    curved: true,
    pointSize: 5,
    pointStyle: 'circle',
  });
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonSeries[]>([]);
  const [drawingTool, setDrawingTool] = useState<DrawingTool | null>(null);

  // Drawing tools configuration
  const DRAWING_TOOLS: DrawingTool[] = [
    {
      type: 'line',
      mode: 'draw',
      style: { color: '#ff0000', lineWidth: 2 }
    },
    {
      type: 'arrow',
      mode: 'draw',
      style: { color: '#00ff00', lineWidth: 2 }
    },
    {
      type: 'rectangle',
      mode: 'draw',
      style: { color: '#0000ff', lineWidth: 2, fillColor: 'rgba(0,0,255,0.1)' }
    },
    {
      type: 'circle',
      mode: 'draw',
      style: { color: '#ff00ff', lineWidth: 2, fillColor: 'rgba(255,0,255,0.1)' }
    },
    {
      type: 'text',
      mode: 'draw',
      style: { color: '#ffffff', fontSize: 14, fontFamily: 'Arial' }
    },
    {
      type: 'fibonacci',
      mode: 'draw',
      style: { color: '#ffd700', lineWidth: 1 }
    },
    {
      type: 'pitchfork',
      mode: 'draw',
      style: { color: '#00ffff', lineWidth: 1 }
    }
  ];

  const chartStyle: Partial<ChartStyle> = {
    backgroundColor: '#1a1a1a',
    textColor: '#e0e0e0',
    gridColor: '#333333',
    candleUpColor: '#26a69a',
    candleDownColor: '#ef5350',
  };

  // Fetch candle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/market-data?timeframe=${timeframe}`);
        const data = await response.json();
        setCandleData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
    // Set up real-time updates
    const ws = new WebSocket('ws://your-websocket-endpoint');
    ws.onmessage = (event) => {
      const newCandle = JSON.parse(event.data);
      setCandleData(prev => [...prev, newCandle]);
    };

    return () => ws.close();
  }, [timeframe]);

  const handleIndicatorChange = (indicator: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleOptionChange = (key: keyof IndicatorOptions, value: number) => {
    setIndicatorOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle comparison symbol additions
  const handleAddComparison = async (symbol: string) => {
    try {
      const comparisonData = await ChartComparisonService.fetchComparisonData(
        symbol,
        timeframe,
        candleData[0]?.timestamp,
        candleData[candleData.length - 1]?.timestamp
      );

      const normalizedData = ChartComparisonService.normalizeTimeframes(
        candleData,
        comparisonData
      );

      const newSeries: ComparisonSeries = {
        id: `${symbol}-${Date.now()}`,
        symbol,
        data: normalizedData,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        visible: true,
        type: 'percentage'
      };

      setComparisons(prev => [...prev, newSeries]);
    } catch (error) {
      console.error('Error adding comparison:', error);
    }
  };

  // Handle annotation events
  const handleAnnotationAdd = (annotation: ChartAnnotation) => {
    setAnnotations(prev => [...prev, annotation]);
  };

  const handleAnnotationUpdate = (id: string, updates: Partial<ChartAnnotation>) => {
    setAnnotations(prev =>
      prev.map(ann => (ann.id === id ? { ...ann, ...updates } : ann))
    );
  };

  const handleAnnotationDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Trading Chart Demo</h2>
        
        {/* Timeframe Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Timeframe</label>
          <div className="flex gap-2">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded ${
                  timeframe === tf
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Chart Type</label>
          <div className="flex gap-2 flex-wrap">
            {CHART_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded ${
                  chartType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Indicators</label>
          <div className="flex gap-2 flex-wrap">
            {AVAILABLE_INDICATORS.map(indicator => (
              <button
                key={indicator}
                onClick={() => handleIndicatorChange(indicator)}
                className={`px-3 py-1 rounded ${
                  selectedIndicators.includes(indicator)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {indicator.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator Options */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Options</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Period</label>
              <input
                type="number"
                value={indicatorOptions.period || 20}
                onChange={(e) => handleOptionChange('period', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm">Standard Deviation</label>
              <input
                type="number"
                value={indicatorOptions.stdDev || 2}
                onChange={(e) => handleOptionChange('stdDev', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0.1"
                max="5"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Chart-specific Options */}
        {(chartType === 'area' || chartType === 'scatter') && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Chart Options</label>
            <div className="grid grid-cols-2 gap-4">
              {chartType === 'area' && (
                <>
                  <div>
                    <label className="block text-sm">Fill Opacity</label>
                    <input
                      type="number"
                      value={chartOptions.fillOpacity || 0.2}
                      onChange={(e) => setChartOptions(prev => ({
                        ...prev,
                        fillOpacity: parseFloat(e.target.value)
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      min="0"
                      max="1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Show Points</label>
                    <input
                      type="checkbox"
                      checked={chartOptions.showPoints}
                      onChange={(e) => setChartOptions(prev => ({
                        ...prev,
                        showPoints: e.target.checked
                      }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Curved Line</label>
                    <input
                      type="checkbox"
                      checked={chartOptions.curved}
                      onChange={(e) => setChartOptions(prev => ({
                        ...prev,
                        curved: e.target.checked
                      }))}
                      className="mt-2"
                    />
                  </div>
                </>
              )}
              {chartType === 'scatter' && (
                <>
                  <div>
                    <label className="block text-sm">Point Size</label>
                    <input
                      type="number"
                      value={chartOptions.pointSize || 5}
                      onChange={(e) => setChartOptions(prev => ({
                        ...prev,
                        pointSize: parseInt(e.target.value)
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      min="1"
                      max="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Point Style</label>
                    <select
                      value={chartOptions.pointStyle}
                      onChange={(e) => setChartOptions(prev => ({
                        ...prev,
                        pointStyle: e.target.value as any
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="circle">Circle</option>
                      <option value="cross">Cross</option>
                      <option value="crossRot">Cross Rotated</option>
                      <option value="dash">Dash</option>
                      <option value="line">Line</option>
                      <option value="rect">Rectangle</option>
                      <option value="star">Star</option>
                      <option value="triangle">Triangle</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Drawing Tools */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Drawing Tools</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setDrawingTool(null)}
              className={`px-3 py-1 rounded ${
                !drawingTool ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              None
            </button>
            {DRAWING_TOOLS.map(tool => (
              <button
                key={tool.type}
                onClick={() => setDrawingTool(tool)}
                className={`px-3 py-1 rounded ${
                  drawingTool?.type === tool.type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tool.type.charAt(0).toUpperCase() + tool.type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Tools */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Compare With</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter symbol"
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
          <div className="flex gap-2 mt-2 flex-wrap">
            {comparisons.map(series => (
              <div
                key={series.id}
                className="flex items-center bg-gray-700 px-2 py-1 rounded"
              >
                <span className="text-sm text-white">{series.symbol}</span>
                <button
                  onClick={() => setComparisons(prev => prev.filter(s => s.id !== series.id))}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Trading Chart */}
      <div className="border rounded-lg overflow-hidden">
        <TradingChart
          data={candleData}
          chartType={chartType}
          indicators={selectedIndicators}
          indicatorOptions={indicatorOptions}
          chartOptions={chartOptions}
          style={chartStyle}
          height={600}
          annotations={annotations}
          comparisons={comparisons}
          drawingTool={drawingTool}
          onAnnotationAdd={handleAnnotationAdd}
          onAnnotationUpdate={handleAnnotationUpdate}
          onAnnotationDelete={handleAnnotationDelete}
          onChartReady={(chart) => {
            console.log('Chart is ready:', chart);
          }}
        />
      </div>
    </div>
  );
};

export default ChartDemo;
