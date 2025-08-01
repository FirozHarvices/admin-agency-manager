"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Building2, CreditCard, History, Plus } from "lucide-react"
import { useDashboard } from "../features/AgancyMaster/hooks/useDashboard"
import { AgencyDashboard } from "../features/AgancyMaster/components/AgencyDashboard"
import { AgencyCreation } from "../features/AgancyMaster/components/AgencyCreation"
import { TopUpHistosssry } from "../features/AgancyMaster/components/top-up-history"

export default function AgancyMasterPage() {
  const { agencies, setAgencies, stats } = useDashboard()
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null)

  const handleAgencyCreated = (newAgency: any) => {
    setAgencies((prev) => [...prev, { ...newAgency, id: `agency-${Date.now()}` }])
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Website Builder Admin Portal</h1>
        <p className="text-[#718096]">Manage agencies, billing, and resource allocation</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-[#5D50FE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A202C]">{stats.totalAgencies}</div>
            <p className="text-xs text-[#718096]">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Active Websites</CardTitle>
            <Plus className="h-4 w-4 text-[#5D50FE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A202C]">{stats.totalWebsites}</div>
            <p className="text-xs text-[#718096]">Across all agencies</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Total Storage Used</CardTitle>
            <CreditCard className="h-4 w-4 text-[#5D50FE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A202C]">{stats.totalStorageGB}GB</div>
            <p className="text-xs text-[#718096]">Storage consumption</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">AI Tokens Used</CardTitle>
            <History className="h-4 w-4 text-[#5D50FE]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A202C]">{stats.totalTokensK}K</div>
            <p className="text-xs text-[#718096]">Token consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agencies" className="space-y-6">
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
          <AgencyDashboard agencies={agencies} onAgencySelect={setSelectedAgency} onAgencyUpdate={setAgencies} />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <AgencyCreation onAgencyCreated={handleAgencyCreated} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TopUpHistosssry agencies={agencies} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
