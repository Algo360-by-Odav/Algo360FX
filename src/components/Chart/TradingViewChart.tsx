import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC = observer(() => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { tradingStore } = useRootStore();

  useEffect(() => {
    console.log('TradingView chart mounting...'); 
    let scriptElement: HTMLScriptElement | null = null;
    let widget: any = null;

    const initializeWidget = () => {
      console.log('Initializing TradingView widget...'); 
      if (containerRef.current && window.TradingView) {
        console.log('Creating widget with container:', containerRef.current); 
        try {
          widget = new window.TradingView.widget({
            container: containerRef.current,
            autosize: true,
            symbol: "EURUSD",
            interval: "1",
            timezone: "exchange",
            theme: theme.palette.mode,
            style: "1",
            locale: "en",
            toolbar_bg: theme.palette.background.paper,
            enable_publishing: false,
            allow_symbol_change: true,
            hide_side_toolbar: false,
            details: true,
            hotlist: true,
            calendar: true,
            studies: [
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies"
            ],
            container_id: containerRef.current.id,
            library_path: '/charting_library/',
            width: '100%',
            height: '100%',
          });
          console.log('Widget created successfully'); 
        } catch (error) {
          console.error('Error creating TradingView widget:', error); 
        }
      } else {
        console.log('Container or TradingView not available:', {
          container: containerRef.current,
          tradingView: window.TradingView
        }); 
      }
    };

    const loadScript = () => {
      console.log('Loading TradingView script...'); 
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        console.log('TradingView script loaded'); 
        initializeWidget();
      };
      script.onerror = (error) => {
        console.error('Error loading TradingView script:', error); 
      };
      document.head.appendChild(script);
      scriptElement = script;
    };

    loadScript();

    return () => {
      console.log('Cleaning up TradingView chart...'); 
      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement);
      }
      if (widget) {
        widget.remove();
      }
    };
  }, [theme.palette.mode]);

  console.log('Rendering TradingView container'); 
  return (
    <Box
      ref={containerRef}
      id="tradingview_chart"
      sx={{
        width: '100%',
        height: '100%',
        '& iframe': {
          border: 'none',
        },
      }}
    />
  );
});

export default TradingViewChart;

