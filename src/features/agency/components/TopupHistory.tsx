import { useState, useMemo } from "react";

import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  User,
} from "lucide-react";

import { Skeleton } from "../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Agency, TopUpHistoryItem } from "../types";
import { useGetAgencyHistory } from "../hooks/useAgencyData";

// --- Props Interface ---
interface TopUpHistoryProps {
  agencies: Agency[]; // We still need this to map agency names to the history items
  isLoading: boolean; // Loading state for the agencies list
}

// --- Helper Functions ---
const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    CAD: "C$",
  };
  return symbols[currency] || currency;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Main Component ---
export function TopUpHistory({
  agencies,
  isLoading: isLoadingAgencies,
}: TopUpHistoryProps) {
  // --- State for Filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // --- Data Fetching ---
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error,
  } = useGetAgencyHistory();

  // --- Data Transformation and Filtering ---
  const enhancedAndFilteredHistory = useMemo(() => {
    if (!historyData) return [];

    console.log("History Data:", historyData);

    // Enhance history with agency names
    const enhancedHistory = historyData.map((item) => {
      const agency = agencies.find((a) => a.id === item.user_mst_id);
      console.log("Agency:", agency);
      return {
        ...item,
        is_active: true,
        agency_name: agency?.name || `ID: ${item.user_mst_id}`, 
        admin: "Admin User",
      };
    });


    // Apply filters
    return enhancedHistory.filter((item) => {
      const matchesSearch = item.agency_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesAgency =
        selectedAgencyId === "all" ||
        item.user_mst_id.toString() === selectedAgencyId;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        const diff = now.getTime() - itemDate.getTime();
        if (dateFilter === "7days")
          matchesDate = diff <= 7 * 24 * 60 * 60 * 1000;
        if (dateFilter === "30days")
          matchesDate = diff <= 30 * 24 * 60 * 60 * 1000;
        if (dateFilter === "90days")
          matchesDate = diff <= 90 * 24 * 60 * 60 * 1000;
      }
      console.log("Matches:",matchesAgency)

      return matchesSearch && matchesAgency && matchesDate;
    });
  }, [historyData, agencies, searchTerm, selectedAgencyId, dateFilter]);



  // --- Derived Summary Stats ---
  const summaryStats = useMemo(() => {
    // Note: These stats are based on the *filtered* history.
    const totalTopUps = enhancedAndFilteredHistory.length;
    const totalValue = enhancedAndFilteredHistory.reduce((sum, item) => {
      const conversionRate = item.currency === "INR" ? 0.012 : 1; // Simplified
      return sum + item.amount * conversionRate;
    }, 0);
    return { totalTopUps, totalValue };
  }, [enhancedAndFilteredHistory]);

  const formatResources = (item: TopUpHistoryItem) => {
    const parts: string[] = [];
    if (item.storage) parts.push(`+${(item.storage / 1000).toFixed(1)}GB`);
    if (item.token_count)
      parts.push(`+${(item.token_count / 1000).toFixed(0)}K tokens`);
    if (item.website_count) parts.push(`+${item.website_count} sites`);
    if (item.image_count) parts.push(`+${item.image_count} images`);
    return parts;
  };

  const isLoading = isLoadingAgencies || isLoadingHistory;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Top-Ups</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-20 h-8" />
            ) : (
              <div className="text-2xl font-bold">
                {summaryStats.totalTopUps}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Value (USD Est.)
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-24 h-8" />
            ) : (
              <div className="text-2xl font-bold">
                ${summaryStats.totalValue.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Agencies
            </CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-12 h-8" />
            ) : (
              <div className="text-2xl font-bold">{agencies.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Top-Up History</CardTitle>
          <CardDescription>
            Track all resource top-ups and billing transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 top-3 left-3 text-muted-foreground" />
              <Input
                placeholder="Search by agency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedAgencyId}
              onValueChange={setSelectedAgencyId}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id.toString()}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F3F2FF]">
                <TableRow>
                  <TableHead className="text-[#1A202C] font-medium">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-[#1A202C] font-medium">
                    Agency
                  </TableHead>
                  <TableHead className="text-[#1A202C] font-medium">
                    Resources Added
                  </TableHead>
                  <TableHead className="text-[#1A202C] font-medium">
                    Amount
                  </TableHead>
                  <TableHead className="text-[#1A202C] font-medium">
                    Admin
                  </TableHead>
                  <TableHead className="text-[#1A202C] font-medium">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="hover:bg-[#FBFCFF]">
                      <TableCell colSpan={5} className="text-[#1A202C]">
                        <Skeleton className="w-full h-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  enhancedAndFilteredHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-[#FBFCFF]">
                      <TableCell className="text-[#1A202C]">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#5D50FE]" />
                          <span className="text-[#1A202C] font-medium">
                            {item.agency_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {formatResources(item).map((r, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-[#F3F2FF] text-[#5D50FE] border-[#5D50FE] text-xs mr-1"
                            >
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-[#1A202C] font-medium">
                            {getCurrencySymbol(item.currency)}
                            {item.amount.toFixed(2)}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs text-[#718096] border-[#E2E8F0]"
                          >
                            {item.currency}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#718096]" />
                          <span className="text-[#718096]">{item.admin}</span>
                        </div>
                        {console.log("Admin:", item)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.is_active === true
                              ? "default"
                              : "secondary"
                          }
                          className={
                            item.is_active === true
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {item.is_active === true
                            ? "completed" : "In Comlplete"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && enhancedAndFilteredHistory.length === 0 && (
            <div className="text-center py-8 text-[#718096]">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No top-up history found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
