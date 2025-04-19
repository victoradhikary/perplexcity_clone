
import { QueryResult, Source } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.substring(4) : domain;
  } catch (e) {
    return url;
  }
}

/**
 * Parse citations from text
 * Preserves markdown formatting while extracting citations
 * Example: "This is a **fact** [1] and another fact [2]"
 * Returns: [{text: "This is a **fact** ", citationIndex: 1}, {text: " and another fact ", citationIndex: 2}]
 */
export function parseCitations(text: string): { text: string; citationIndex?: number }[] {
  const citationRegex = /\[(\d+)\]/g;
  const parts: { text: string; citationIndex?: number }[] = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = citationRegex.exec(text)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index)
      });
    }
    
    // Add the citation
    parts.push({
      text: match[0],
      citationIndex: parseInt(match[1], 10)
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last citation
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex)
    });
  }
  
  return parts;
}

/**
 * Save query to local storage
 */
export function saveQueryToHistory(query: QueryResult): void {
  try {
    const historyString = localStorage.getItem('queryHistory');
    const history: QueryResult[] = historyString ? JSON.parse(historyString) : [];
    
    // Add to beginning of array (most recent first)
    history.unshift(query);
    
    // Limit to 50 items
    const limitedHistory = history.slice(0, 50);
    
    localStorage.setItem('queryHistory', JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving query to history:', error);
  }
}

/**
 * Get query history from local storage
 */
export function getQueryHistory(): QueryResult[] {
  try {
    const historyString = localStorage.getItem('queryHistory');
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting query history:', error);
    return [];
  }
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
}

/**
 * Generate a new query result with a unique ID
 */
export function createQueryResult(question: string, answer: string, sources: Source[]): QueryResult {
  return {
    id: uuidv4(),
    question,
    answer,
    sources,
    timestamp: new Date(),
    feedback: null
  };
}
