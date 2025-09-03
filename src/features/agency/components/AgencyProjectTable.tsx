import { Copy, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Agency } from "../types";

interface AgencyProjectTableProps {
  agency: Agency;
}

export default function AgencyProjectTable({ agency }: AgencyProjectTableProps) {
  const usedStorage = agency.total_storage - agency.storage;
  const usedTokens = agency.total_token_count - agency.token_count;
  const usedImages = agency.total_image_count - agency.image_count;
  const usedWebsites = agency.total_website_count - agency.website_count;

  // Generate mock projects based on actual usage
  const mockProjects = [
    {
      name: "Byjus",
      createdOn: "12/12/2024",
      website: "www.magicpages.byj...",
      storage: "1.6 GB",
      tokens: "20K",
      images: "10 Credits",
    },
    {
      name: "Unacademy",
      createdOn: "22/08/2024", 
      website: "www.magicpages.una...",
      storage: "1.6 GB",
      tokens: "12K", 
      images: "10 Credits",
    },
    {
      name: "Udemy",
      createdOn: "08/02/2024",
      website: "www.magicpages.ude...",
      storage: "1.6 GB",
      tokens: "6K",
      images: "10 Credits",
    },
  ].slice(0, Math.max(usedWebsites, 1)); // Show at least 1 project or actual used websites

  if (mockProjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No projects created yet for this agency.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Project</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Created On</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Website</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Storage</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Tokens</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Images</th>
            <th className="text-left py-3 font-semibold text-gray-700 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockProjects.map((project, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4">
                <div className="font-medium text-gray-900 text-sm">{project.name}</div>
              </td>
              <td className="py-4">
                <div className="text-gray-600 text-sm">{project.createdOn}</div>
              </td>
              <td className="py-4">
                <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                  {project.website}
                </div>
              </td>
              <td className="py-4">
                <div className="text-gray-600 text-sm">{project.storage}</div>
              </td>
              <td className="py-4">
                <div className="text-gray-600 text-sm">{project.tokens}</div>
              </td>
              <td className="py-4">
                <div className="text-gray-600 text-sm">{project.images}</div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}