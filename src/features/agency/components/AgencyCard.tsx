import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, MoreHorizontal, Pause, Play } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { Agency } from "../types";
import AgencyStats from "./AgencyStats";
import AgencyProjectTable from "./AgencyProjectTable";
import { TopUpModal } from "./TopUpModal";
import { AgencyActionModal } from "./AgencyActionModal";
import { EditAgencyModal } from "./EditAgencyModal";
import { useDeleteAgency, useSuspendAgency, useReactivateAgency } from "../hooks/useAgencyMutations";

interface AgencyCardProps {
  agency: Agency;
}

export default function AgencyCard({ agency }: AgencyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'suspend' | 'reactivate'>('delete');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mutation hooks
  const deleteAgencyMutation = useDeleteAgency();
  const suspendAgencyMutation = useSuspendAgency();
  const reactivateAgencyMutation = useReactivateAgency();

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate usage data for stats
  const usedStorage = agency.total_storage - agency.storage;
  const usedWebsites = agency.total_website_count - agency.website_count;
  const usedImages = agency.total_image_count - agency.image_count;
  const usedTokens = agency.total_token_count - agency.token_count;

  const getUsagePercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const stats = {
    websites: {
      used: usedWebsites,
      total: agency.total_website_count,
      percentage: getUsagePercentage(usedWebsites, agency.total_website_count)
    },
    storage: {
      used: usedStorage,
      total: agency.total_storage,
      percentage: getUsagePercentage(usedStorage, agency.total_storage),
      usedDisplay: `${(usedStorage / 1000).toFixed(1)}GB`,
      totalDisplay: `${(agency.total_storage / 1000).toFixed(1)}GB`
    },
    tokens: {
      used: usedTokens,
      total: agency.total_token_count,
      percentage: getUsagePercentage(usedTokens, agency.total_token_count),
      usedDisplay: `${(usedTokens / 1000).toFixed(0)}K`,
      totalDisplay: `${(agency.total_token_count / 1000).toFixed(0)}K`
    },
    images: {
      used: usedImages,
      total: agency.total_image_count,
      percentage: getUsagePercentage(usedImages, agency.total_image_count)
    }
  };

  // Action handlers
  const handleActionClick = (type: 'delete' | 'suspend' | 'reactivate') => {
    setActionType(type);
    setIsActionModalOpen(true);
  };

  const handleActionConfirm = async () => {
    try {
      switch (actionType) {
        case 'delete':
          await deleteAgencyMutation.mutateAsync(agency.id);
          break;
        case 'suspend':
          await suspendAgencyMutation.mutateAsync(agency.id);
          break;
        case 'reactivate':
          await reactivateAgencyMutation.mutateAsync(agency.id);
          break;
      }
      setIsActionModalOpen(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
  };

  const handleCloseTopUp = () => {
    setIsTopUpModalOpen(false);
  };

  return (
    <>
      <Card className={`${expanded ? 'p-3' : 'p-5'} rounded-2xl border border-gray-200 bg-white transition-all duration-300 ease-in-out`}>
        {/* Main Content Row */}
        <div className="flex items-center justify-between">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-3">
            <div className={`${expanded ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-[#5D50FE] flex items-center justify-center text-white ${expanded ? 'text-xs' : 'text-lg'} font-semibold transition-all duration-300 ease-in-out`}>
              {getInitials(agency.name)}
            </div>
            <div>
              <h3 className={`font-semibold ${expanded ? 'text-sm' : 'text-base'} text-gray-900 transition-all duration-300 ease-in-out`}>{agency.name}</h3>
              <p className={`${expanded ? 'text-xs' : 'text-sm'} text-gray-500 transition-all duration-300 ease-in-out`}>
                {agency.email} • {agency.phone}
              </p>
            </div>
          </div>

          {/* Right side content - different layout based on expanded state */}
          <div className="flex items-center gap-4">
            {/* Agency Stats - always visible */}
            <AgencyStats stats={stats} />
            
            {/* Action Icons - only when expanded */}
            {expanded && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title="Add"
                  onClick={() => setIsTopUpModalOpen(true)}
                >
                  <span className="text-lg">+</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title={agency.is_active ? "Suspend Agency" : "Reactivate Agency"}
                  onClick={() => handleActionClick(agency.is_active ? 'suspend' : 'reactivate')}
                >
                  {agency.is_active ? (
                    <Pause className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Play className="w-4 h-4 text-green-500" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title="Edit Agency"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title="Delete"
                  onClick={() => handleActionClick('delete')}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            )}
            
            {/* Expand/Collapse Button - always visible */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
              onClick={() => setExpanded(prev => !prev)}
            >
              <div className="transition-transform duration-300 ease-in-out">
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </Button>
          </div>
        </div>

        {/* Expanded: Project Table */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
            <AgencyProjectTable agency={agency} />
          </div>
        )}
      </Card>

      {/* Modals */}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={handleCloseTopUp}
        agency={agency}
      />

      <AgencyActionModal
        isOpen={isActionModalOpen}
        onClose={handleCloseActionModal}
        onConfirm={handleActionConfirm}
        agency={agency}
        actionType={actionType}
        isLoading={
          deleteAgencyMutation.isPending ||
          suspendAgencyMutation.isPending ||
          reactivateAgencyMutation.isPending
        }
      />

      <EditAgencyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        agency={agency}
      />
    </>
  );
}
