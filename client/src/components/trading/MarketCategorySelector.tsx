import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

interface MarketCategory {
  id: string;
  name: string;
  subCategories?: string[];
}

const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: 'forex',
    name: 'Forex',
    subCategories: ['Major', 'Minor', 'Exotic'],
  },
  {
    id: 'crypto',
    name: 'Crypto CFDs',
    subCategories: ['Bitcoin', 'Ethereum', 'Altcoins'],
  },
  {
    id: 'shares',
    name: 'Share CFDs',
    subCategories: ['US', 'EU', 'Asia'],
  },
  {
    id: 'commodities',
    name: 'Commodities',
    subCategories: ['Agriculture', 'Industrial'],
  },
  {
    id: 'metals',
    name: 'Spot Metals',
    subCategories: ['Gold', 'Silver', 'Platinum'],
  },
  {
    id: 'energies',
    name: 'Energies',
    subCategories: ['Oil', 'Natural Gas'],
  },
  {
    id: 'indices',
    name: 'Indices',
    subCategories: ['US', 'EU', 'Asia'],
  },
];

interface MarketCategorySelectorProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onCategoryChange: (category: string, subCategory: string) => void;
}

const MarketCategorySelector: React.FC<MarketCategorySelectorProps> = ({
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeCategory, setActiveCategory] = React.useState<MarketCategory | null>(
    MARKET_CATEGORIES.find(cat => cat.id === selectedCategory) || null
  );

  const handleClick = (category: MarketCategory) => {
    setActiveCategory(category);
    if (category.subCategories) {
      onCategoryChange(category.id, category.subCategories[0]);
    }
  };

  const handleSubCategoryClick = (subCategory: string) => {
    if (activeCategory) {
      onCategoryChange(activeCategory.id, subCategory);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Main Categories */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {MARKET_CATEGORIES.map((category) => (
          <ButtonGroup 
            key={category.id}
            size="small"
            variant="outlined"
            sx={{ mb: 0.5 }}
          >
            <Button
              onClick={() => handleClick(category)}
              sx={{
                minWidth: 'auto',
                px: 1.5,
                backgroundColor: activeCategory?.id === category.id ? 'primary.dark' : 'transparent',
                '&:hover': {
                  backgroundColor: activeCategory?.id === category.id ? 'primary.dark' : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              {category.name}
            </Button>
            {category.subCategories && (
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            )}
          </ButtonGroup>
        ))}
      </Box>

      {/* Sub-Categories Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {activeCategory?.subCategories?.map((subCategory) => (
          <MenuItem
            key={subCategory}
            onClick={() => handleSubCategoryClick(subCategory)}
            selected={selectedSubCategory === subCategory}
          >
            {subCategory}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MarketCategorySelector;
