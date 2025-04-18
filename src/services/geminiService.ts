
import { GeminiParams, GeminiResult } from "@/types";

const GOOGLE_GEMINI_API_KEY = "AIzaSyA2p-IW_M5H1aJ-ZNOjK5VxowzC3rP0o1A";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1/models";
const GEMINI_MODEL = "gemini-pro";

/**
 * Generate text with Google Gemini API
 */
export const generateWithGemini = async (params: GeminiParams): Promise<GeminiResult> => {
  try {
    const url = `${GEMINI_API_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;
    
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
        ],
        generationConfig: {
          temperature: params.temperature || 0.7,
          topK: params.top_k || 40,
          topP: params.top_p || 0.95,
          maxOutputTokens: params.max_tokens || 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    
    // Extract text from Gemini API response
    const text = result.candidates[0].content.parts[0].text;
    
    return { text };
  } catch (error) {
    console.error("Error in generateWithGemini:", error);
    throw error;
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
