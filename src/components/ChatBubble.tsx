
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { QueryResult } from "@/types";
import { parseCitations } from "@/utils/helpers";
import SourceCitation from "./SourceCitation";

interface ChatBubbleProps {
  query: QueryResult;
  onFeedback: (id: string, feedback: 'upvote' | 'downvote' | null) => void;
}

const ChatBubble = ({ query, onFeedback }: ChatBubbleProps) => {
  const { id, question, answer, sources, feedback } = query;
  
  // Parse the answer text to identify citations
  const parsedAnswer = parseCitations(answer);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* User question */}
      <div className="flex justify-end mb-4">
        <div className="chat-bubble-user">
          <p>{question}</p>
        </div>
      </div>
      
      {/* AI answer */}
      <div className="flex flex-col mb-2">
        <div className="chat-bubble-ai mb-2">
          <div className="prose dark:prose-invert">
            {parsedAnswer.map((part, index) => (
              <span key={index} className={part.citationIndex ? "font-medium text-perplexity hover:underline cursor-pointer" : ""}>
                {part.text}
              </span>
            ))}
          </div>
          
          {/* Feedback buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button 
              onClick={() => onFeedback(id, feedback === 'upvote' ? null : 'upvote')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                feedback === 'upvote' ? 'text-green-500' : 'text-gray-400'
              }`}
              aria-label="Helpful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onFeedback(id, feedback === 'downvote' ? null : 'downvote')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                feedback === 'downvote' ? 'text-red-500' : 'text-gray-400'
              }`}
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Sources section */}
        {sources.length > 0 && (
          <div className="ml-2">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sources:</h3>
            <div className="flex flex-col gap-1">
              {sources.map((source, index) => (
                <SourceCitation key={source.id} source={source} index={index + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
