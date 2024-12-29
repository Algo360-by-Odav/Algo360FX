export type SearchResultType = 'strategy' | 'portfolio' | 'documentation' | 'analysis' | 'news';
export interface SearchFilter {
    categories?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
}
export interface SearchResult {
    id: string;
    type: string;
    title: string;
    description: string;
    score: number;
}
