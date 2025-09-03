import { Trash2, Pause, Play } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Agency, Website } from "../types";
import { useState } from 'react';
import { WebsiteActionModal } from './WebsiteActionModal';
import { useDeleteWebsite, useSuspendWebsite, useReactivateWebsite } from '../hooks/useAgencyMutations';

interface AgencyProjectTableProps {
  agency: Agency;
}

export default function AgencyProjectTable({ agency }: AgencyProjectTableProps) {
  console.log(agency)
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    website: Website | null;
    actionType: 'delete' | 'suspend' | 'reactivate';
  }>({
    isOpen: false,
    website: null,
    actionType: 'delete',
  });

  // Website mutation hooks
  const deleteWebsiteMutation = useDeleteWebsite();
  const suspendWebsiteMutation = useSuspendWebsite();
  const reactivateWebsiteMutation = useReactivateWebsite();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to format storage
  const formatStorage = (storageReserved: number) => {
    if (storageReserved >= 1000) {
      return `${(storageReserved / 1000).toFixed(1)} GB`;
    }
    return `${storageReserved} MB`;
  };

  // Helper function to format tokens
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  // Get actual projects from agency data
  const projects: Website[] = agency.customers?.[0]?.sites ? agency.customers[0].sites.map((site) => ({
    id: site.id,
    name: site.websiteName || site.domain || 'Unnamed Website',
    createdOn: formatDate(site.created_at),
    url: site.host || `${site.domain}.magicpagez.com`,
    storage: formatStorage(site.storage_reserved),
    tokens: formatTokens(site.used_token),
    images: `${site.image_used || 0} Credits`,
    status: site.is_active ? 'active' as const : 'suspended' as const,
  })) : [];

  const handleAction = (website: Website, actionType: 'delete' | 'suspend' | 'reactivate') => {
    setActionModal({
      isOpen: true,
      website,
      actionType,
    });
  };

  const handleActionConfirm = async () => {
    if (!actionModal.website) return;

    try {
      switch (actionModal.actionType) {
        case 'delete':
          await deleteWebsiteMutation.mutateAsync(actionModal.website.id);
          break;
        case 'suspend':
          await suspendWebsiteMutation.mutateAsync(actionModal.website.id);
          break;
        case 'reactivate':
          await reactivateWebsiteMutation.mutateAsync(actionModal.website.id);
          break;
      }
      // Only close modal after successful API call
      setActionModal({ isOpen: false, website: null, actionType: 'delete' });
    } catch (error) {
      // Error handling is done in the hooks, modal stays open on error
      console.error('Website action failed:', error);
    }
  };

  const closeActionModal = () => {
    setActionModal({ isOpen: false, website: null, actionType: 'delete' });
  };

  const isLoading = 
    deleteWebsiteMutation.isPending || 
    suspendWebsiteMutation.isPending || 
    reactivateWebsiteMutation.isPending;

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No projects created yet for this agency.</p>
      </div>
    );
  }

  return (
    <>
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
              <th className="text-left py-3 font-semibold text-gray-700 text-sm">Status</th>
              <th className="text-left py-3 font-semibold text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-100">
                <td className="py-4">
                  <div className="font-medium text-gray-900 text-sm">{project.name}</div>
                </td>
                <td className="py-4">
                  <div className="text-gray-600 text-sm">{project.createdOn}</div>
                </td>
                <td className="py-4">
                  <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                    {project.url}
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
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {project.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {/* Suspend/Reactivate Toggle */}
                    {project.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-yellow-100 rounded-full"
                        title="Suspend Website"
                        onClick={() => handleAction(project, 'suspend')}
                        disabled={isLoading}
                      >
                        <Pause className="w-4 h-4 text-yellow-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-100 rounded-full"
                        title="Reactivate Website"
                        onClick={() => handleAction(project, 'reactivate')}
                        disabled={isLoading}
                      >
                        <Play className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    
                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 rounded-full"
                      title="Delete Website"
                      onClick={() => handleAction(project, 'delete')}
                      disabled={isLoading}
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

      {/* Website Action Modal */}
      <WebsiteActionModal
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        onConfirm={handleActionConfirm}
        website={actionModal.website}
        actionType={actionModal.actionType}
        isLoading={isLoading}
      />
    </>
  );
}