
import { ThumbsUp, ThumbsDown, Link } from "lucide-react";
import { QueryResult } from "@/types";
import { parseCitations } from "@/utils/helpers";
import SourceCitation from "./SourceCitation";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  query: QueryResult;
  onFeedback: (id: string, feedback: 'upvote' | 'downvote' | null) => void;
}

const ChatBubble = ({ query, onFeedback }: ChatBubbleProps) => {
  const { id, question, answer, sources, feedback } = query;
  const parsedAnswer = parseCitations(answer);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-4 sm:px-0">
      {/* Question header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl sm:text-3xl font-normal text-white/90 text-center mb-6">
          {question}
        </h1>
        
        <div className="flex items-center justify-center space-x-8 mb-4">
          <button className="flex items-center space-x-2 text-sm text-white/70 hover:text-white/90">
            <span>Search</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-white/70 hover:text-white/90">
            <span>Sources</span>
            <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
              {sources.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sources grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {sources.slice(0, 3).map((source, index) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 mr-2">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 font-medium truncate mb-1">
                {source.title}
              </p>
              <p className="text-xs text-white/50 flex items-center">
                {source.domain}
                <Link className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Answer text */}
      <div className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed max-w-none text-base sm:text-lg">
        {parsedAnswer.map((part, index) => (
          <span 
            key={index} 
            className={part.citationIndex ? "font-medium text-perplexity hover:underline cursor-pointer" : ""}
          >
            {part.citationIndex ? (
              part.text
            ) : (
              <ReactMarkdown className="inline">
                {part.text}
              </ReactMarkdown>
            )}
          </span>
        ))}
      </div>

      {/* Feedback buttons */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/10">
        <button 
          onClick={() => onFeedback(id, feedback === 'upvote' ? null : 'upvote')}
          className={`p-1.5 rounded-lg hover:bg-white/5 ${
            feedback === 'upvote' ? 'text-perplexity' : 'text-white/50'
          }`}
          aria-label="Helpful"
        >
          <ThumbsUp className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onFeedback(id, feedback === 'downvote' ? null : 'downvote')}
          className={`p-1.5 rounded-lg hover:bg-white/5 ${
            feedback === 'downvote' ? 'text-red-500' : 'text-white/50'
          }`}
          aria-label="Not helpful"
        >
          <ThumbsDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBubble;
