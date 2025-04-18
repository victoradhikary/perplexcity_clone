
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
      <div className="search-bar flex items-center px-4 py-3 bg-perplexity-bg-light rounded-xl border border-gray-700">
        <Search className="h-5 w-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center gap-2 ml-2">
          <button type="button" className="p-2 hover:bg-perplexity-bg-lighter rounded-lg">
            <Globe className="h-5 w-5 text-gray-400" />
          </button>
          <button type="button" className="p-2 hover:bg-perplexity-bg-lighter rounded-lg">
            <Link className="h-5 w-5 text-gray-400" />
          </button>
          <button
            type="submit"
            className="p-2 bg-perplexity hover:bg-perplexity-dark rounded-lg text-white"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
