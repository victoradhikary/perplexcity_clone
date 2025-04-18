
import { TavilyEmbedParams, TavilyEmbedResult, TavilySearchParams, TavilySearchResult } from "@/types";

const TAVILY_API_KEY = "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";
const TAVILY_API_BASE_URL = "https://api.tavily.com/v1";

/**
 * Search the web with Tavily AI
 */
export const tavilySearch = async (params: TavilySearchParams): Promise<TavilySearchResult> => {
  try {
    const response = await fetch(`${TAVILY_API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        ...params,
        include_answer: params.include_answer ?? true,
        search_depth: params.search_depth ?? "advanced",
        max_results: params.max_results ?? 5
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily search API returned ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in tavilySearch:", error);
    throw error;
  }
};

/**
 * Get embeddings from Tavily AI
 */
export const tavilyEmbed = async (params: TavilyEmbedParams): Promise<TavilyEmbedResult> => {
  try {
    const response = await fetch(`${TAVILY_API_BASE_URL}/embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: params.query
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily embed API returned ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in tavilyEmbed:", error);
    throw error;
  }
};

/**
 * Get search suggestions based on partial query
 */
export const getSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
  // This is a mock implementation - in a real app, we could use Tavily's embedding 
  // to find similar queries or implement a custom suggestion algorithm
  if (!partialQuery.trim()) return [];
  
  const mockSuggestions = [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "What are the ethics of AI?",
    "Who invented the internet?",
    "How to learn programming?",
    "What is quantum computing?",
    "How do neural networks function?",
    "What are the best AI tools in 2023?",
  ];
  
  return mockSuggestions
    .filter(s => s.toLowerCase().includes(partialQuery.toLowerCase()))
    .slice(0, 5);
};
