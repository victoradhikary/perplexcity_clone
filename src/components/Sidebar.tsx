
import { Clock, X, PlusCircle } from "lucide-react";
import { QueryResult } from "@/types";
import { formatRelativeTime } from "@/utils/helpers";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryResult[];
  onSelectQuery: (queryId: string) => void;
  onNewChat: () => void;
  currentQueryId: string | null;
}

const Sidebar = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectQuery, 
  onNewChat,
  currentQueryId
}: SidebarProps) => {
  return (
    <aside className={`
      fixed top-0 left-0 z-20 h-full w-72 bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      overflow-hidden flex flex-col
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">History</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 perplexity-button"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No history yet</p>
            <p className="text-sm">Start a new chat to see it here</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {history.map((query) => (
              <li key={query.id}>
                <button
                  onClick={() => onSelectQuery(query.id)}
                  className={`w-full text-left sidebar-item ${query.id === currentQueryId ? 'sidebar-item-active' : ''}`}
                >
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <p className="line-clamp-2 font-medium">{query.question}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(new Date(query.timestamp))}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
