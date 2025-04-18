import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatBubble from "@/components/ChatBubble";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import { tavilySearch } from "@/services/tavilyService";
import { createGeminiPrompt, generateWithGemini } from "@/services/geminiService";
import { QueryResult, Source } from "@/types";
import { createQueryResult, getQueryHistory, saveQueryToHistory } from "@/utils/helpers";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = getQueryHistory();
    setHistory(savedHistory);
  }, []);

  // Handle search/question submission
  const handleSearch = async (question: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Step 1: Search with Tavily
      const searchResult = await tavilySearch({
        query: question,
        search_depth: "advanced",
        max_results: 5
      });
      
      // Extract sources from search results
      const sources: Source[] = searchResult.results.map(result => ({
        id: uuidv4(),
        title: result.title,
        url: result.url,
        domain: result.domain,
        snippet: result.content
      }));
      
      // Step 2: Generate answer with Gemini
      const prompt = createGeminiPrompt(
        question, 
        searchResult.results.map(r => ({
          title: r.title,
          content: r.content,
          url: r.url
        }))
      );
      
      const geminiResult = await generateWithGemini({
        prompt,
        temperature: 0.2
      });
      
      // Create and save the query result
      const newQuery = createQueryResult(question, geminiResult.text, sources);
      
      setCurrentQuery(newQuery);
      setHistory(prev => {
        const updated = [newQuery, ...prev];
        saveQueryToHistory(newQuery);
        return updated;
      });
    } catch (error) {
      console.error("Error processing search:", error);
      
      // Create an error result
      const errorQuery = createQueryResult(
        question,
        "I'm sorry, but I encountered an error while processing your request. Please try again later.",
        []
      );
      
      setCurrentQuery(errorQuery);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback (upvote/downvote)
  const handleFeedback = (id: string, feedback: 'upvote' | 'downvote' | null) => {
    setHistory(prev => {
      const updated = prev.map(query => 
        query.id === id ? { ...query, feedback } : query
      );
      
      // Update in localStorage
      const queryToUpdate = updated.find(q => q.id === id);
      if (queryToUpdate) {
        saveQueryToHistory(queryToUpdate);
      }
      
      return updated;
    });
    
    if (currentQuery?.id === id) {
      setCurrentQuery(prev => prev ? { ...prev, feedback } : null);
    }
  };

  // Handle selecting a query from history
  const handleSelectQuery = (queryId: string) => {
    const selected = history.find(q => q.id === queryId);
    if (selected) {
      setCurrentQuery(selected);
      setHasSearched(true);
      setIsSidebarOpen(false);
    }
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setCurrentQuery(null);
    setHasSearched(false);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        onSearch={handleSearch}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onSelectQuery={handleSelectQuery}
        onNewChat={handleNewChat}
        currentQueryId={currentQuery?.id || null}
      />
      
      <main className="flex-1 flex flex-col items-center px-4 py-6 overflow-hidden">
        {!hasSearched ? (
          // Landing page content when no search has been made
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mt-16 mb-12">
              <h1 className="text-4xl font-bold mb-4 perplexity-gradient">
                QuerySpark
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Your AI-powered search assistant
              </p>
              
              <SearchBar 
                onSearch={handleSearch}
                className="max-w-2xl mx-auto"
                placeholder="Ask me anything..."
              />
            </div>
            
            <HowItWorks />
          </div>
        ) : (
          // Chat interface when a search has been made
          <div className="w-full max-w-4xl mx-auto overflow-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-perplexity border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Searching for answers...</p>
              </div>
            ) : (
              currentQuery && (
                <ChatBubble 
                  query={currentQuery}
                  onFeedback={handleFeedback}
                />
              )
            )}
            
            {/* Search box at the bottom for follow-up questions */}
            <div className="sticky bottom-4 mt-4">
              <SearchBar 
                onSearch={handleSearch}
                className="shadow-lg"
                placeholder="Ask a follow-up question..."
              />
            </div>
          </div>
        )}
      </main>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
