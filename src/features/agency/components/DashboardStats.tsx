import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Building2, Plus, CreditCard, History } from "lucide-react";
import { DashboardStats as Stats } from "../types";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
        <Building2  className="w-4 h-4 text-[#5D50FE]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalAgencies}</div>
        <p className="text-xs text-muted-foreground">+2 from last month</p>
      </CardContent>
    </Card>
    {/* ... other 3 stat cards are identical to your original code ... */}
    <Card>
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
);