import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  InputAdornment,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  LocalOffer,
  Category,
  Style,
  Palette,
} from '@mui/icons-material';

interface FilterOption {
  label: string;
  value: string;
  count: number;
}

interface FilterSection {
  title: string;
  type: 'checkbox' | 'range' | 'color';
  icon: React.ReactNode;
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

interface NFTFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFilters: string[];
  onClearFilters: () => void;
}

const NFTFilters: React.FC<NFTFiltersProps> = ({
  onFilterChange,
  activeFilters,
  onClearFilters,
}) => {
  const theme = useTheme();
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 10]);
  const [expanded, setExpanded] = React.useState<string | false>('price');

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const filterSections: FilterSection[] = [
    {
      title: 'Price Range',
      type: 'range',
      icon: <LocalOffer />,
      range: {
        min: 0,
        max: 100,
        step: 0.1,
        unit: 'ETH',
      },
    },
    {
      title: 'Categories',
      type: 'checkbox',
      icon: <Category />,
      options: [
        { label: 'Art', value: 'art', count: 1234 },
        { label: 'Collectibles', value: 'collectibles', count: 856 },
        { label: 'Domain Names', value: 'domains', count: 432 },
        { label: 'Music', value: 'music', count: 321 },
        { label: 'Photography', value: 'photography', count: 654 },
        { label: 'Sports', value: 'sports', count: 234 },
        { label: 'Trading Cards', value: 'trading-cards', count: 567 },
        { label: 'Utility', value: 'utility', count: 123 },
        { label: 'Virtual Worlds', value: 'virtual-worlds', count: 345 },
      ],
    },
    {
      title: 'Properties',
      type: 'checkbox',
      icon: <Style />,
      options: [
        { label: 'Background', value: 'background', count: 987 },
        { label: 'Eyes', value: 'eyes', count: 876 },
        { label: 'Mouth', value: 'mouth', count: 765 },
        { label: 'Clothing', value: 'clothing', count: 654 },
        { label: 'Hat', value: 'hat', count: 543 },
        { label: 'Accessory', value: 'accessory', count: 432 },
      ],
    },
    {
      title: 'Colors',
      type: 'color',
      icon: <Palette />,
      options: [
        { label: 'Red', value: '#ff0000', count: 234 },
        { label: 'Blue', value: '#0000ff', count: 345 },
        { label: 'Green', value: '#00ff00', count: 456 },
        { label: 'Yellow', value: '#ffff00', count: 567 },
        { label: 'Purple', value: '#800080', count: 678 },
        { label: 'Orange', value: '#ffa500', count: 789 },
      ],
    },
  ];

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} />
          Filters
        </Typography>
        {activeFilters.length > 0 && (
          <Button
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
            color="inherit"
          >
            Clear All
          </Button>
        )}
      </Box>

      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => {
                // Handle filter removal
              }}
              size="small"
            />
          ))}
        </Box>
      )}

      {filterSections.map((section) => (
        <Accordion
          key={section.title}
          expanded={expanded === section.title.toLowerCase()}
          onChange={handleAccordionChange(section.title.toLowerCase())}
          sx={{
            '&:before': { display: 'none' },
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ px: 0 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {section.icon}
              <Typography sx={{ ml: 1 }}>{section.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            {section.type === 'range' && section.range && (
              <Box>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={section.range.min}
                  max={section.range.max}
                  step={section.range.step}
                  sx={{ mt: 2, mb: 1 }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <TextField
                    size="small"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {section.range.unit}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    size="small"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {section.range.unit}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            )}
            {section.type === 'checkbox' &&
              section.options &&
              section.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={<Checkbox size="small" />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.count}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
              ))}
            {section.type === 'color' &&
              section.options &&
              section.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      size="small"
                      icon={
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: option.value,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: option.value,
                            border: `2px solid ${theme.palette.primary.main}`,
                          }}
                        />
                      }
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.count}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default NFTFilters;
