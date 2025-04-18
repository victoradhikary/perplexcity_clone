export interface QueryResult {
  id: string;
  question: string;
  answer: string;
  sources: Source[];
  timestamp: Date;
  feedback?: 'upvote' | 'downvote' | null;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
}

export interface TavilySearchParams {
  query: string;
  search_depth?: "basic" | "advanced";
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
  include_answer?: boolean;
  topic?: "general" | "academic" | "news";
  chunks_per_source?: number;
  time_range?: string | null;
  days?: number;
}

export interface TavilySearchResult {
  query: string;
  answer?: string;
  results: {
    title: string;
    url: string;
    content: string;
    score: number;
    domain: string;
  }[];
}

export interface TavilyEmbedParams {
  query: string;
}

export interface TavilyEmbedResult {
  embedding: number[];
}

export interface GeminiParams {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export interface GeminiResult {
  text: string;
}
