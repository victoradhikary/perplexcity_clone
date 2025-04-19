
import { Search, Globe, Link, Download } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, className = "", placeholder = "Ask anything..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="search-bar flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm sm:text-base md:text-lg min-w-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center gap-1 sm:gap-2 ml-2">
          <button 
            type="button" 
            className="p-1 sm:p-1.5 md:p-2 hover:bg-perplexity-bg-lighter rounded-lg hidden sm:block"
            aria-label="Web search"
          >
            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </button>
          <button 
            type="button" 
            className="p-1 sm:p-1.5 md:p-2 hover:bg-perplexity-bg-lighter rounded-lg hidden sm:block"
            aria-label="Link to resource"
          >
            <Link className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </button>
          <button
            type="submit"
            className="p-1 sm:p-1.5 md:p-2 bg-perplexity hover:bg-perplexity-dark rounded-lg text-white"
            aria-label="Submit question"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
