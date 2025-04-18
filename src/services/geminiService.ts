
import { GeminiParams, GeminiResult } from "@/types";

const GOOGLE_GEMINI_API_KEY = "AIzaSyA2p-IW_M5H1aJ-ZNOjK5VxowzC3rP0o1A";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Generate text with Google Gemini API
 */
export const generateWithGemini = async (params: GeminiParams): Promise<GeminiResult> => {
  try {
    const url = `${GEMINI_API_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;
    
    console.log("Gemini API request to:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: params.prompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return { 
        text: "I'm sorry, but I couldn't generate a response right now. This could be due to API rate limits or service availability." 
      };
    }

    const result = await response.json();
    
    // Check if the expected response structure exists
    if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected Gemini API response structure:", result);
      return { 
        text: "I received an unexpected response format. I'll work on improving this." 
      };
    }
    
    // Extract text from Gemini API response
    const text = result.candidates[0].content.parts[0].text;
    
    return { text };
  } catch (error) {
    console.error("Error in generateWithGemini:", error);
    return { 
      text: "I encountered an error when trying to generate a response. This might be due to network issues or service availability." 
    };
  }
};

/**
 * Combines user question with context from search results to create a prompt for Gemini
 */
export const createGeminiPrompt = (
  question: string, 
  searchResults: { title: string; content: string; url: string }[]
): string => {
  // Format the context from search results
  const formattedContext = searchResults.map((result, index) => (
    `Source ${index + 1}: "${result.title}"
${result.content}
URL: ${result.url}`
  )).join('\n\n');
  
  // Create the full prompt with instructions
  return `Answer the following question based on the provided search results. Include relevant information from the sources, and cite the sources using [1], [2], etc.

Question: ${question}

Search Results:
${formattedContext}

Instructions:
1. Answer directly and clearly
2. Cite sources using numbers in square brackets [1], [2], etc.
3. Be factual and precise
4. If the sources don't contain enough information to fully answer the question, acknowledge this
5. Use a conversational, helpful tone

Your answer:`;
};
