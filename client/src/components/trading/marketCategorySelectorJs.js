// marketCategorySelectorJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

// Market categories data
const MARKET_CATEGORIES = [
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

const MarketCategorySelector = ({
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState(
    MARKET_CATEGORIES.find(cat => cat.id === selectedCategory) || null
  );

  const handleClick = (category) => {
    setActiveCategory(category);
    if (category.subCategories) {
      onCategoryChange(category.id, category.subCategories[0]);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    if (activeCategory) {
      onCategoryChange(activeCategory.id, subCategory);
    }
    setAnchorEl(null);
  };

  // Create category buttons
  const createCategoryButtons = () => {
    return MARKET_CATEGORIES.map((category) => {
      return React.createElement(ButtonGroup, {
        key: category.id,
        size: "small",
        variant: "outlined",
        sx: { mb: 0.5 }
      }, [
        // Main category button
        React.createElement(Button, {
          key: "main-button",
          onClick: () => handleClick(category),
          sx: {
            minWidth: 'auto',
            px: 1.5,
            backgroundColor: activeCategory?.id === category.id ? 'primary.dark' : 'transparent',
            '&:hover': {
              backgroundColor: activeCategory?.id === category.id ? 'primary.dark' : 'rgba(255,255,255,0.05)',
            },
          }
        }, category.name),
        
        // Dropdown button for subcategories
        category.subCategories ? 
          React.createElement(IconButton, {
            key: "dropdown-button",
            size: "small",
            onClick: (e) => setAnchorEl(e.currentTarget),
            sx: {
              borderLeft: '1px solid',
              borderColor: 'divider',
              borderRadius: '0 4px 4px 0',
            }
          }, React.createElement(KeyboardArrowDownIcon, { fontSize: "small" })) 
          : null
      ]);
    });
  };

  // Create subcategory menu
  const createSubCategoryMenu = () => {
    return React.createElement(Menu, {
      anchorEl: anchorEl,
      open: Boolean(anchorEl),
      onClose: () => setAnchorEl(null),
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      }
    }, activeCategory?.subCategories?.map((subCategory, index) => 
      React.createElement(MenuItem, {
        key: `${activeCategory.id}-${subCategory}-${index}`,
        onClick: () => handleSubCategoryClick(subCategory),
        selected: selectedSubCategory === subCategory
      }, subCategory)
    ));
  };

  // Main render
  return React.createElement(Box, { 
    sx: { display: 'flex', flexDirection: 'column', gap: 1 }
  }, [
    // Main Categories container
    React.createElement(Box, { 
      key: "categories-container",
      sx: { display: 'flex', gap: 0.5, flexWrap: 'wrap' }
    }, createCategoryButtons()),
    
    // Sub-Categories Menu
    React.createElement('div', { key: "subcategories-menu-container" }, createSubCategoryMenu())
  ]);
};

export default MarketCategorySelector;
