import { TavilyEmbedParams, TavilyEmbedResult, TavilySearchParams, TavilySearchResult } from "@/types";

const TAVILY_API_KEY = "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";
const TAVILY_API_BASE_URL = "https://api.tavily.com/v1";

/**
 * Search the web with Tavily AI
 */
export const tavilySearch = async (params: TavilySearchParams): Promise<TavilySearchResult> => {
  try {
    console.log("Tavily search request:", `${TAVILY_API_BASE_URL}/search`);
    
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
      const errorText = await response.text();
      console.error(`Tavily API error: ${response.status} - ${errorText}`);
      
      // Return fallback data if API fails
      return {
        query: params.query,
        answer: "I couldn't search for information at this time.",
        results: [
          {
            title: "Search temporarily unavailable",
            url: "https://example.com",
            content: "The search service is currently unavailable. This might be due to API rate limits, connection issues, or service maintenance.",
            score: 1,
            domain: "example.com"
          }
        ]
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error in tavilySearch:", error);
    
    // Return fallback data on any error
    return {
      query: params.query,
      answer: "I encountered an error while searching for information.",
      results: [
        {
          title: "Search error occurred",
          url: "https://example.com",
          content: "There was a problem with the search service. This might be due to network issues, API rate limits, or service maintenance.",
          score: 1,
          domain: "example.com"
        }
      ]
    };
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
