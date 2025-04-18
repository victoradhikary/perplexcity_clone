
import { ExternalLink } from "lucide-react";
import { Source } from "@/types";
import { extractDomain } from "@/utils/helpers";

interface SourceCitationProps {
  source: Source;
  index: number;
}

const SourceCitation = ({ source, index }: SourceCitationProps) => {
  const { title, url, domain } = source;
  const formattedDomain = domain || extractDomain(url);
  
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="source-citation"
    >
      <span className="inline-flex items-center">
        <span className="rounded-full bg-gray-200 dark:bg-gray-700 h-4 w-4 flex items-center justify-center text-xs mr-1">
          {index}
        </span>
        <span className="truncate">{title}</span>
        <span className="mx-1 text-gray-400">·</span>
        <span className="text-gray-400">{formattedDomain}</span>
        <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
      </span>
    </a>
  );
};

export default SourceCitation;
