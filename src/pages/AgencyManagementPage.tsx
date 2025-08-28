import { Building2, Plus, History } from "lucide-react";
import { useState } from "react"; // Import useState

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton"; 

import { DashboardStats } from "../features/agency/components/DashboardStats";
import { AgencyList } from "../features/agency/components/AgencyList";
import { AgencyCreationForm } from "../features/agency/components/AgencyCreationForm";
import { useGetAgencies, useGetDashboardStats } from "../features/agency/hooks/useAgencyData";
import { TopUpHistory } from "../features/agency/components/TopupHistory";

export default function AgencyManagementPage() {
  const { data: agencies, isLoading: isLoadingAgencies, error: agenciesError } = useGetAgencies();
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useGetDashboardStats();

  const [activeTab, setActiveTab] = useState("agencies"); 

  const handleAgencyCreated = () => {
    setActiveTab("agencies");
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const mainContent = document.getElementById('agency-management-main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const combinedError = agenciesError || statsError;
  if (combinedError) {
    return (
        <div className="flex items-center justify-center h-full p-6">
            <p className="text-red-500">Error: {combinedError.message}</p>
        </div>
    );
  }

  return (
      <div id="agency-management-main-content"  className="container p-4 mx-auto sm:p-6 overflow-auto h-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Agency Management Portal</h1>
          <p className="text-muted-foreground">Manage agencies, billing, and resource allocation.</p>
        </header>

        {isLoadingStats ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          stats && <DashboardStats stats={stats} />
        )}

      {/* Main Content */}
      <Tabs defaultValue="agencies" value={activeTab} onValueChange={setActiveTab} className="mt-8 space-y-6"> {/* Control the tab */}
        <TabsList className="grid w-full grid-cols-3 bg-white border border-[#E2E8F0]">
          <TabsTrigger value="agencies" className="data-[state=active]:bg-[#5D50FE] data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Agency Management
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-[#5D50FE] data-[state=active]:text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Agency
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[#5D50FE] data-[state=active]:text-white">
            <History className="w-4 h-4 mr-2" />
            Top-Up History
          </TabsTrigger>
        </TabsList>

          <TabsContent value="agencies" className="space-y-6">
             <AgencyList agencies={agencies || []} isLoading={isLoadingAgencies} />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <AgencyCreationForm onAgencyCreated={handleAgencyCreated} /> 
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TopUpHistory agencies={agencies || []} isLoading={isLoadingAgencies} />
          </TabsContent>
        </Tabs>
      </div>
  );
}