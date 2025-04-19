"use client"

import { useEffect, useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/sonner"

import ChatBubble from "@/components/ChatBubble"
import Header from "@/components/Header"
import SearchBar from "@/components/SearchBar"
import Sidebar from "@/components/Sidebar"
import { createGeminiPrompt, generateWithGemini } from "@/services/geminiService"
import { tavilySearch } from "@/services/tavilyService"
import type { QueryResult, Source } from "@/types"
import { createQueryResult, getQueryHistory, saveQueryToHistory } from "@/utils/helpers"

const SearchInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [history, setHistory] = useState<QueryResult[]>([])
  const [currentQuery, setCurrentQuery] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedHistory = getQueryHistory()
    setHistory(savedHistory)
  }, [])

  // Scroll to bottom when new content is added
  useEffect(() => {
    if (chatContainerRef.current && !isLoading && currentQuery) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [currentQuery, isLoading])

  const handleSearch = async (question: string) => {
    setIsLoading(true)
    setHasSearched(true)

    try {
      const searchResult = await tavilySearch({
        query: question,
        search_depth: "advanced",
        max_results: 5,
      })

      const sources: Source[] = searchResult.results.map((result) => ({
        id: uuidv4(),
        title: result.title,
        url: result.url,
        domain: result.domain,
        snippet: result.content,
      }))

      const prompt = createGeminiPrompt(
        question,
        searchResult.results.map((r) => ({
          title: r.title,
          content: r.content,
          url: r.url,
        })),
      )

      const geminiResult = await generateWithGemini({
        prompt,
        temperature: 0.2,
      })

      const newQuery = createQueryResult(question, geminiResult.text, sources)

      setCurrentQuery(newQuery)
      setHistory((prev) => {
        const updated = [newQuery, ...prev]
        saveQueryToHistory(newQuery)
        return updated
      })
    } catch (error) {
      console.error("Error processing search:", error)

      toast.error("Something went wrong", {
        description: "Could not process your search request. Please try again.",
      })

      const errorQuery = createQueryResult(
        question,
        "I'm sorry, but I encountered an error while processing your request. Please try again later.",
        [],
      )

      setCurrentQuery(errorQuery)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = (id: string, feedback: "upvote" | "downvote" | null) => {
    setHistory((prev) => {
      const updated = prev.map((query) => (query.id === id ? { ...query, feedback } : query))

      const queryToUpdate = updated.find((q) => q.id === id)
      if (queryToUpdate) {
        saveQueryToHistory(queryToUpdate)
      }

      return updated
    })

    if (currentQuery?.id === id) {
      setCurrentQuery((prev) => (prev ? { ...prev, feedback } : null))
    }
  }

  const handleSelectQuery = (queryId: string) => {
    const selected = history.find((q) => q.id === queryId)
    if (selected) {
      setCurrentQuery(selected)
      setHasSearched(true)
      setIsSidebarOpen(false)
    }
  }

  const handleNewChat = () => {
    setCurrentQuery(null)
    setHasSearched(false)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
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

      {/* Main content area with proper height calculation */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 relative overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          {!hasSearched ? (
            <div className="w-full mt-8 sm:mt-16">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">What do you want to know?</h1>
                <SearchBar onSearch={handleSearch} className="max-w-2xl mx-auto" placeholder="Ask anything..." />
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable chat container with hidden scrollbar */}
              <div
                ref={chatContainerRef}
                className="flex-1 w-full space-y-6 overflow-y-auto pb-24 scrollbar-hide"
                style={{
                  height: "calc(100vh - 180px)", // Adjust based on header and search bar height
                  maxHeight: "calc(100vh - 180px)",
                }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-curiosity border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Searching for answers...</p>
                  </div>
                ) : (
                  currentQuery && <ChatBubble query={currentQuery} onFeedback={handleFeedback} />
                )}
              </div>

              {/* Fixed search bar at bottom with proper z-index */}
              <div className="fixed bottom-4 left-0 right-0 z-10 px-4 sm:px-0 mx-auto" style={{ maxWidth: "64rem" }}>
                <div className="max-w-4xl mx-auto">
                  <SearchBar onSearch={handleSearch} className="shadow-lg" placeholder="Ask a follow-up question..." />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}

export default SearchInterface
