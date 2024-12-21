import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { useTradingStore } from '../../hooks/useTradingStore';

const POPULAR_PAIRS = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'NZDUSD',
  'USDCHF',
  'EURJPY',
  'GBPJPY',
  'EURGBP',
];

interface SymbolSelectorProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = observer(({
  selectedSymbol,
  onSymbolChange,
}) => {
  const theme = useTheme();
  const tradingStore = useTradingStore();

  React.useEffect(() => {
    tradingStore.subscribeToMarketData(POPULAR_PAIRS);
  }, [tradingStore]);

  const handleSymbolChange = (event: SelectChangeEvent<string>) => {
    const newSymbol = event.target.value;
    onSymbolChange(newSymbol);
    tradingStore.subscribeToMarketData([newSymbol]);
  };

  const getMarketPrice = (symbol: string) => {
    const data = tradingStore.marketData.get(symbol);
    return data ? data.bid : null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Symbol</InputLabel>
          <Select
            value={selectedSymbol}
            label="Symbol"
            onChange={handleSymbolChange}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {POPULAR_PAIRS.map((symbol) => (
              <MenuItem key={symbol} value={symbol}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography>{symbol}</Typography>
                  {getMarketPrice(symbol) && (
                    <Typography color="text.secondary">
                      {getMarketPrice(symbol)?.toFixed(5)}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {POPULAR_PAIRS.map((symbol) => {
          const price = getMarketPrice(symbol);
          const isSelected = symbol === selectedSymbol;

          return (
            <Chip
              key={symbol}
              label={
                <Box>
                  <Typography variant="caption" display="block">
                    {symbol}
                  </Typography>
                  {price && (
                    <Typography variant="caption" color="text.secondary">
                      {price.toFixed(5)}
                    </Typography>
                  )}
                </Box>
              }
              onClick={() => onSymbolChange(symbol)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                minWidth: 100,
                height: 'auto',
                padding: '4px 0',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
});

export default SymbolSelector;
