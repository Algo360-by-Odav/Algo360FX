import { SearchResult } from '../types/search';
import { searchAnalytics } from './analyticsService';
import { searchDocumentation } from './documentationService';
import { searchPortfolios } from './portfolioService';
import { searchStrategies } from './strategyService';

export async function search(query: string): Promise<SearchResult[]> {
  try {
    // Execute all searches in parallel
    const [analytics, docs, portfolios, strategies] = await Promise.all([
      searchAnalytics(query),
      searchDocumentation(query),
      searchPortfolios(query),
      searchStrategies(query)
    ]);

    // Combine and sort results
    const results = [...analytics, ...docs, ...portfolios, ...strategies];
    return results.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
