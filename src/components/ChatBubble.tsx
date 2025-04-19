
import { QueryResult } from "@/types";
import { parseCitations } from "@/utils/helpers";
import { Link, ThumbsDown, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  query: QueryResult;
  onFeedback: (id: string, feedback: 'upvote' | 'downvote' | null) => void;
}

const ChatBubble = ({ query, onFeedback }: ChatBubbleProps) => {
  const { id, question, answer, sources, feedback } = query;
  const parsedAnswer = parseCitations(answer);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-4 sm:px-0 animate-fade-in">
      {/* Question header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl sm:text-3xl font-medium text-white/90 text-center mb-6 tracking-tight animate-fade-up">
          {question}
        </h1>
        
        <div className="flex items-center justify-center space-x-8 mb-4">
          <button className="flex items-center space-x-2 text-sm font-medium text-white/70 hover:text-white/90 transition-colors">
            <span>Search</span>
          </button>
          <button className="flex items-center space-x-2 text-sm font-medium text-white/70 hover:text-white/90 transition-colors">
            <span>Sources</span>
            <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
              {sources.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sources grid with hover animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {sources.slice(0, 3).map((source, index) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start p-3.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 mr-2.5">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate mb-1">
                {source.title}
              </p>
              <p className="text-xs text-white/50 flex items-center">
                {source.domain}
                <Link className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Answer text with improved typography */}
      <div className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed max-w-none text-base sm:text-lg prose-p:font-normal">
        {parsedAnswer.map((part, index) => (
          <span 
            key={index} 
            className={part.citationIndex ? "font-medium text-curiosity hover:underline cursor-pointer transition-colors" : ""}
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

      {/* Feedback buttons with hover effects */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
        <button 
          onClick={() => onFeedback(id, feedback === 'upvote' ? null : 'upvote')}
          className={`p-2 rounded-lg hover:bg-white/5 transition-all duration-200 ${
            feedback === 'upvote' ? 'text-curiosity' : 'text-white/50'
          }`}
          aria-label="Helpful"
        >
          <ThumbsUp className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onFeedback(id, feedback === 'downvote' ? null : 'downvote')}
          className={`p-2 rounded-lg hover:bg-white/5 transition-all duration-200 ${
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
