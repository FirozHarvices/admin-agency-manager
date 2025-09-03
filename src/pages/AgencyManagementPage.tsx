import { useState } from "react";
import { Button } from "../components/ui/button";
import { useGetAgencies } from "../features/agency/hooks/useAgencyData";
import AgencyCard from "../features/agency/components/AgencyCard";
import { CreateAgencyModal } from "../features/agency/components/CreateAgencyModal";
import { TopUpHistoryModal } from "../features/agency/components/TopUpHistoryModal";

export default function AgencyManagementPage() {
  const { data: agencies, isLoading: isLoadingAgencies, error: agenciesError } = useGetAgencies();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  if (agenciesError) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-red-500">Error: {agenciesError.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agency Management</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsHistoryModalOpen(true)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Top-Up history
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#5D50FE] hover:bg-[#4A3FE7] text-white rounded-full px-6"
          >
            Create Agency
            <span className="ml-2 bg-white bg-opacity-20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              +
            </span>
          </Button>
        </div>
      </div>

      {/* Agency Cards */}
      <div className="space-y-6">
        {isLoadingAgencies ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !agencies || agencies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Agencies Found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first agency.</p>
            <Button 
              className="bg-[#5D50FE] hover:bg-[#4A3FE7] text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Agency
            </Button>
          </div>
        ) : (
          agencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))
        )}
      </div>

      {/* Modals */}
      <CreateAgencyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <TopUpHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        agencies={agencies || []}
        isLoadingAgencies={isLoadingAgencies}
      />
    </div>
  );
}