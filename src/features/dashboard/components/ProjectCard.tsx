import { Card } from "../../../components/ui/Card";
import { Site } from "../types";
import { Pencil, Eye, Zap } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ProjectCardProps {
  site: Site;
  onEditClick: (site: Site) => void;
}

const LogoPlaceholder = ({
  name,
  isActive,
}: {
  name: string;
  isActive: boolean;
}) => (
  <div className="relative h-12 w-12 flex-shrink-0">
    <div className="h-full w-full rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xl">
      {name.charAt(0).toUpperCase()}
    </div>
    <div
      className={cn(
        "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white",
        isActive ? "bg-green-500" : "bg-gray-400"
      )}
    ></div>
  </div>
);

export function ProjectCard({  site, onEditClick  }: ProjectCardProps) {
  const mockVisits = Math.floor(Math.random() * 25) + 1;

  return (
    <Card className="flex flex-col p-4 gap-4">
      <div className="flex items-start justify-between">
        <LogoPlaceholder name={site.websiteName} isActive={site.is_active} />
        <div className="flex items-center gap-3 text-gray-400">
            <button 
            onClick={() => onEditClick(site)} 
            className="cursor-pointer hover:text-brand-primary"
            title="Edit with Elementor"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <a
            href={`https://${site.host}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-primary"
          >
            <Eye className="h-4 w-4 cursor-pointer" />
          </a>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-brand-text-primary">
          {site.websiteName}
        </h3>
        <a
          href={`http://${site.host}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-brand-primary"
        >
          {site.host}
        </a>
      </div>
      <div className="mt-auto pt-">
        {site.is_active ? (
          <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-100 rounded-full px-2.5 py-1 w-fit">
            <Zap className="h-3.5 w-3.5" />
            <span>{mockVisits}K Visits in last 24 hrs.</span>
          </div>
        ) : (
          <div className="text-sm text-red-600">Site is currently inactive</div>
        )}
      </div>
    </Card>
  );
}
