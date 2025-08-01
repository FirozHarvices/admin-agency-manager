"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { Separator } from "../../../components/ui/separator"
import { TopUpModal } from "./top-up-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"

import { Building2, Mail, Phone, Database, Cpu, Globe, ImageIcon, Plus, MoreHorizontal, TrendingUp } from "lucide-react"
import { Agency } from "../../UserMaster/types"
interface AgencyDashboardProps {
  agencies: Agency[]
  onAgencySelect: (id: string) => void
  onAgencyUpdate: (agencies: Agency[]) => void
}

export function AgencyDashboard({ agencies, onAgencySelect, onAgencyUpdate }: AgencyDashboardProps) {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  const handleTopUp = (agencyId: string, resources: any) => {
    const updatedAgencies = agencies.map((agency) => {
      if (agency.id === agencyId) {
        return {
          ...agency,
          storage: agency.storage + (resources.storage || 0),
          token_count: agency.token_count + (resources.tokens || 0),
          website_count: agency.website_count + (resources.websites || 0),
          image_count: agency.image_count + (resources.images || 0),
        }
      }
      return agency
    })
    onAgencyUpdate(updatedAgencies)
    setIsTopUpModalOpen(false)

    console.log("Top-up completed:", {
      agencyId,
      resources,
      amount: resources.amount,
      currency: resources.currency,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-6">
      {/* Agency Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agencies.map((agency) => (
          <Card key={agency.id} className="border-[#E2E8F0] hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-[#1A202C] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#5D50FE]" />
                    {agency.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-[#718096]">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {agency.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {agency.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={agency.status === "active" ? "default" : "secondary"}
                    className={agency.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {agency.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAgency(agency)
                          setIsTopUpModalOpen(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Top Up Resources
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
                      className={`text-sm font-medium ${getUsageColor(getUsagePercentage(agency.storage_used, agency.storage))}`}
                    >
                      {getUsagePercentage(agency.storage_used, agency.storage)}%
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(agency.storage_used, agency.storage)} className="h-2" />
                  <p className="text-xs text-[#718096]">
                    {(agency.storage_used / 1000).toFixed(1)}GB / {(agency.storage / 1000).toFixed(1)}GB
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
                      className={`text-sm font-medium ${getUsageColor(getUsagePercentage(agency.token_used, agency.token_count))}`}
                    >
                      {getUsagePercentage(agency.token_used, agency.token_count)}%
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(agency.token_used, agency.token_count)} className="h-2" />
                  <p className="text-xs text-[#718096]">
                    {(agency.token_used / 1000).toFixed(0)}K / {(agency.token_count / 1000).toFixed(0)}K
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
                      className={`text-sm font-medium ${getUsageColor(getUsagePercentage(agency.website_used, agency.website_count))}`}
                    >
                      {getUsagePercentage(agency.website_used, agency.website_count)}%
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(agency.website_used, agency.website_count)} className="h-2" />
                  <p className="text-xs text-[#718096]">
                    {agency.website_used} / {agency.website_count} sites
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
                      className={`text-sm font-medium ${getUsageColor(getUsagePercentage(agency.image_used, agency.image_count))}`}
                    >
                      {getUsagePercentage(agency.image_used, agency.image_count)}%
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(agency.image_used, agency.image_count)} className="h-2" />
                  <p className="text-xs text-[#718096]">
                    {agency.image_used} / {agency.image_count} credits
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
                    setSelectedAgency(agency)
                    setIsTopUpModalOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Up Modal */}
      {selectedAgency && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          agency={selectedAgency}
          onTopUp={handleTopUp}
        />
      )}
    </div>
  )
}
