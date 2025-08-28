import { useState } from "react";
import { Agency } from "../types";


import { TopUpModal } from "./TopUpModal";
import { AgencyActionModal } from "./AgencyActionModal";
import { useDeleteAgency, useSuspendAgency, useReactivateAgency } from "../hooks/useAgencyMutations";

import { Building2, Mail, Phone, Database, Cpu, Globe, ImageIcon, Plus, MoreHorizontal, TrendingUp, Search, Pause, Play, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Separator } from "../../../components/ui/separator";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";


// --- Props Interface ---
interface AgencyListProps {
  agencies: Agency[];
  isLoading: boolean;
}

// --- Helper Functions (can be inside or outside the component) ---
const getUsagePercentage = (used: number, total: number) => {
  if (total === 0) return 0; // Avoid division by zero
  return Math.round((used / total) * 100);
};


// --- Skeleton Component for Loading State ---
const AgencyListSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full" /><Skeleton className="h-3 w-20" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full" /><Skeleton className="h-3 w-20" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full" /><Skeleton className="h-3 w-20" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full" /><Skeleton className="h-3 w-20" /></div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// --- Main Component ---
export function AgencyList({ agencies, isLoading }: AgencyListProps) {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  
  // New state for action modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'suspend' | 'reactivate'>('delete');

  // Mutation hooks
  const deleteAgencyMutation = useDeleteAgency();
  const suspendAgencyMutation = useSuspendAgency();
  const reactivateAgencyMutation = useReactivateAgency();



  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-green-500"
  }
  
  const handleCloseTopUp = () => {
    setIsTopUpModalOpen(false);
    // Setting agency to null after a delay can make the modal closing animation smoother
    setTimeout(() => setSelectedAgency(null), 300);
  };

  // New handlers for agency actions
  const handleActionClick = (agency: Agency, type: 'delete' | 'suspend' | 'reactivate') => {
    setSelectedAgency(agency);
    setActionType(type);
    setIsActionModalOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedAgency) return;

    try {
      switch (actionType) {
        case 'delete':
          await deleteAgencyMutation.mutateAsync(selectedAgency.id);
          break;
        case 'suspend':
          await suspendAgencyMutation.mutateAsync(selectedAgency.id);
          break;
        case 'reactivate':
          await reactivateAgencyMutation.mutateAsync(selectedAgency.id);
          break;
      }
      setIsActionModalOpen(false);
      setSelectedAgency(null);
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Action failed:', error);
    }
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setTimeout(() => setSelectedAgency(null), 300);
  };

  // 1. Handle Loading State
  if (isLoading) {
    return <AgencyListSkeleton />;
  }

  // 2. Handle Empty State
  if (!agencies || agencies.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-slate-50 text-muted-foreground">
            <Search className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No Agencies Found</h3>
            <p>Get started by creating a new agency in the "Create Agency" tab.</p>
        </div>
    );
  }

  // 3. Render the List
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {agencies.map((agency) => {
    console.log("Agency Data:", agency);


    const usedStorage = agency.total_storage - agency.storage;
    const usedWebsites = agency.total_website_count - agency.website_count;
    const usedImages = agency.total_image_count - agency.image_count;
    const usedTokens = agency.total_token_count - agency.token_count;

    // Calculate percentages based on the USED amounts
    const storagePercent = getUsagePercentage(usedStorage, agency.total_storage);
    const tokenPercent = getUsagePercentage(usedTokens, agency.total_token_count);
    const websitePercent = getUsagePercentage(usedWebsites, agency.total_website_count);
    const imagePercent = getUsagePercentage(usedImages, agency.total_image_count);

    return (
      <Card key={agency.id} className="border-[#E2E8F0] hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            {/* Left section - flexible to grow */}
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-[#1A202C] flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-[#5D50FE] flex-shrink-0" />
                <span 
                  className="truncate cursor-default" 
                  title={agency.name}
                >
                  {agency.name}
                </span>
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-[#718096]">
                <div className="flex items-center gap-1 min-w-0">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span 
                    className="truncate cursor-default" 
                    title={agency.email}
                  >
                    {agency.email}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Phone className="w-3 h-3" />
                  <span title={agency.phone}>{agency.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Right section - fixed width elements */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant={agency.is_active === true ? "default" : "secondary"}
                className={agency.is_active === true ? "bg-green-100 text-green-800" : ""}
              >
                {agency.is_active ? "Active" : "Inactive"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedAgency(agency);
                      setIsTopUpModalOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Top Up Resources
                  </DropdownMenuItem>
                    
                    {/* New action items */}
                    {agency.is_active ? (
                      <DropdownMenuItem
                        onClick={() => handleActionClick(agency, 'suspend')}
                        className="text-yellow-600 focus:text-yellow-600"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Suspend Agency
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleActionClick(agency, 'reactivate')}
                        className="text-green-600 focus:text-green-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Reactivate Agency
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem
                      onClick={() => handleActionClick(agency, 'delete')}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Agency
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resource Usage */}
          <div className="grid grid-cols-2 gap-4">
            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#718096]" />
                  <span className="text-sm font-medium text-[#1A202C]">Storage</span>
                </div>
                <span
                  className={`text-sm font-medium ${getUsageColor(storagePercent)}`}
                >
                  {storagePercent}%
                </span>
              </div>
              <Progress value={storagePercent} className="h-2" />
              <p className="text-xs text-[#718096]">
                {/* --- CORRECTED DISPLAY: Show used / total --- */}
                {(usedStorage / 1000).toFixed(1)}GB / {(agency.total_storage / 1000).toFixed(1)}GB
              </p>
            </div>

            {/* Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#718096]" />
                  <span className="text-sm font-medium text-[#1A202C]">Tokens</span>
                </div>
                <span
                  className={`text-sm font-medium ${getUsageColor(tokenPercent)}`}
                >
                  {tokenPercent}%
                </span>
              </div>
              <Progress value={tokenPercent} className="h-2" />
              <p className="text-xs text-[#718096]">
                {/* --- CORRECTED DISPLAY: Show used / total --- */}
                {(usedTokens / 1000).toFixed(0)}K / {(agency.total_token_count / 1000).toFixed(0)}K
              </p>
            </div>

            {/* Websites */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#718096]" />
                  <span className="text-sm font-medium text-[#1A202C]">Websites</span>
                </div>
                <span
                  className={`text-sm font-medium ${getUsageColor(websitePercent)}`}
                >
                  {websitePercent}%
                </span>
              </div>
              <Progress value={websitePercent} className="h-2" />
              <p className="text-xs text-[#718096]">
                {/* --- CORRECTED DISPLAY: Show used / total --- */}
                {usedWebsites} / {agency.total_website_count} sites
              </p>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#718096]" />
                  <span className="text-sm font-medium text-[#1A202C]">Images</span>
                </div>
                <span
                  className={`text-sm font-medium ${getUsageColor(imagePercent)}`}
                >
                  {imagePercent}%
                </span>
              </div>
              <Progress value={imagePercent} className="h-2" />
              <p className="text-xs text-[#718096]">
                {/* --- CORRECTED DISPLAY: Show used / total --- */}
                {usedImages} / {agency.total_image_count} credits
              </p>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          <div className="flex items-center justify-between">
            <p className="text-sm text-[#718096]">Created: {new Date(agency.created_at).toLocaleDateString()}</p>
            <Button
              size="sm"
              className="bg-[#5D50FE] hover:bg-[#4A3FE7] text-white"
              onClick={() => {
                setSelectedAgency(agency);
                setIsTopUpModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  })}

      </div>

      {/* The Modal is only rendered when an agency is selected */}
      {selectedAgency && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={handleCloseTopUp}
          agency={selectedAgency}
        />
      )}

      {/* Action confirmation modal */}
      {selectedAgency && (
        <AgencyActionModal
          isOpen={isActionModalOpen}
          onClose={handleCloseActionModal}
          onConfirm={handleActionConfirm}
          agency={selectedAgency}
          actionType={actionType}
          isLoading={
            deleteAgencyMutation.isPending ||
            suspendAgencyMutation.isPending ||
            reactivateAgencyMutation.isPending
          }
        />
      )}
    </div>
  );
}