import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Description,
  Article,
  History as HistoryIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { SearchResultType } from '../../services/search/SearchService';
import './SearchResults.css';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: any[];
  isSearching: boolean;
  selectedResultIndex: number;
  setSelectedResultIndex: (index: number) => void;
  searchHistory: string[];
  clearSearchHistory: () => void;
  performSearch: (term: string) => void;
  clearSearch: () => void;
}

const getIconByType = (type: SearchResultType) => {
  switch (type) {
    case 'strategy':
      return <TrendingUp />;
    case 'analysis':
      return <Assessment />;
    case 'documentation':
      return <Description />;
    default:
      return <Article />;
  }
};

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    searchResults = [], // Provide default empty array
    isSearching,
    selectedResultIndex,
    setSelectedResultIndex,
    searchHistory = [], // Provide default empty array
    clearSearchHistory,
    clearSearch,
    setSearchTerm,
    performSearch,
  } = useSearch() as SearchContextType;

  const handleResultClick = (url: string) => {
    navigate(url);
    clearSearch();
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  if (!searchTerm && !searchHistory?.length) {
    return null;
  }

  return (
    <Box className="search-results-container">
      <Paper className="search-results-paper">
        {isSearching ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : searchTerm ? (
          <>
            {searchResults?.length > 0 ? (
              <>
                <Box px={2} py={1} display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="textSecondary">
                    {searchResults.length} results
                  </Typography>
                  <Tooltip title="Filter results">
                    <IconButton size="small">
                      <FilterIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider />
                <List>
                  {searchResults.map((result, index) => (
                    <ListItem
                      key={result.id}
                      button
                      selected={index === selectedResultIndex}
                      onClick={() => handleResultClick(result.url)}
                      onMouseEnter={() => setSelectedResultIndex(index)}
                    >
                      <ListItemIcon>{getIconByType(result.type)}</ListItemIcon>
                      <ListItemText
                        primary={result.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              {result.description}
                            </Typography>
                            <Box mt={0.5}>
                              <Chip
                                size="small"
                                label={result.type}
                                color="primary"
                                variant="outlined"
                                style={{ marginRight: 8 }}
                              />
                              {result.category && (
                                <Chip size="small" label={result.category} variant="outlined" />
                              )}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Box p={2} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  No results found for "{searchTerm}"
                </Typography>
              </Box>
            )}
          </>
        ) : searchHistory?.length > 0 ? (
          <>
            <Box px={2} py={1} display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" color="textSecondary">
                Recent Searches
              </Typography>
              <Tooltip title="Clear history">
                <IconButton size="small" onClick={clearSearchHistory}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
            <List>
              {searchHistory.map((term, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleHistoryClick(term)}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={term} />
                </ListItem>
              ))}
            </List>
          </>
        ) : null}
      </Paper>
    </Box>
  );
};

export default SearchResults;
