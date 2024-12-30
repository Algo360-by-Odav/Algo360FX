import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

interface SearchResult {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, total }) => {
  if (total === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">No results found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Found {total} results
      </Typography>
      <Grid container spacing={2}>
        {results.map((result) => (
          <Grid item xs={12} key={result.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {result.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {result.type} • {result.category}
                </Typography>
                <Typography variant="body2">
                  {result.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(result.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResults;
