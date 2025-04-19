import { TavilyEmbedParams, TavilyEmbedResult, TavilySearchParams, TavilySearchResult } from "@/types";
import { toast } from "@/components/ui/sonner";

const TAVILY_API_KEY      = import.meta.env.VITE_TAVILY_API_KEY!;
const TAVILY_API_BASE_URL = "https://api.tavily.com";

/**
 * Search the web with Tavily AI
 */
export const tavilySearch = async (params: TavilySearchParams): Promise<TavilySearchResult> => {
  try {
    console.log("Tavily search request:", `${TAVILY_API_BASE_URL}/search`);
    
    const searchParams = {
      query: params.query,
      search_depth: params.search_depth || "basic",
      max_results: params.max_results || 5,
      include_answer: params.include_answer ?? true,
      include_domains: params.include_domains || [],
      exclude_domains: params.exclude_domains || [],
      include_raw_content: false,
      include_images: false,
      topic: "general",
      chunks_per_source: 3
    };

    const response = await fetch(`${TAVILY_API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TAVILY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tavily API error: ${response.status} - ${errorText}`);
      toast.error("Search error", {
        description: "Could not fetch search results. Please try again later."
      });
      
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
    toast.error("Search error", {
      description: "An unexpected error occurred. Please try again."
    });
    
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

/**
 * Extract content from URLs using Tavily AI
 */
export const tavilyExtract = async (urls: string | string[]): Promise<any> => {
  try {
    const response = await fetch(`${TAVILY_API_BASE_URL}/extract`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TAVILY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        urls: Array.isArray(urls) ? urls.join(",") : urls,
        include_images: false,
        extract_depth: "basic"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tavily extract API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to extract content: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in tavilyExtract:", error);
    throw error;
  }
};
