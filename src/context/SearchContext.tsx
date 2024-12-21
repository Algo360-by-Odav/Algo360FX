import React, { createContext, useContext, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { SearchResult, SearchFilter, searchService } from '../services/search/SearchService';
import { debounce } from '../utils/debounce';
import { useNavigate } from 'react-router-dom';

interface SearchContextType {
  searchTerm: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  selectedResult: SearchResult | null;
  loading: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  clearHistory: () => void;
  selectResult: (result: SearchResult) => void;
  performSearch: (query: string, filters?: SearchFilter) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, filters?: SearchFilter) => {
      if (query.trim()) {
        const results = await searchService.search(query, filters);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const performSearch = useCallback(async (query: string, filters?: SearchFilter) => {
    setSearchTerm(query);
    await debouncedSearch(query, filters);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedResult(null);
  }, []);

  const clearHistory = useCallback(() => {
    searchService.clearSearchHistory();
  }, []);

  const selectResult = useCallback((result: SearchResult) => {
    setSelectedResult(result);
    navigate(result.url);
    clearSearch();
  }, [navigate]);

  const value = {
    searchTerm,
    searchResults,
    recentSearches: searchService.getSearchHistory(),
    selectedResult,
    loading: searchService.loading,
    error: searchService.searchError,
    setSearchTerm,
    clearSearch,
    clearHistory,
    selectResult,
    performSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
});
