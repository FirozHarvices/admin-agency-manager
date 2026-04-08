import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket as TicketIcon, Search, Star, Phone, Mail } from 'lucide-react';
import { useTickets } from '../hooks';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import {
  TICKET_STATUS_CONFIG,
  TICKET_CATEGORY_CONFIG,
  TICKET_PRIORITY_CONFIG,
  CATEGORY_OPTIONS,
} from '../constants';
import { TicketStatus, TicketCategory } from '../types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

const SkeletonCard = () => (
  <div
    role="status"
    className="animate-pulse bg-white rounded-xl border border-brand-border p-4 space-y-3"
  >
    <div className="flex justify-between">
      <div className="bg-gray-200/70 rounded h-3 w-20" />
      <div className="bg-gray-200/70 rounded-full h-5 w-16" />
    </div>
    <div className="bg-gray-200/70 rounded h-4 w-3/4" />
    <div className="bg-gray-200/70 rounded h-3 w-1/2" />
    <div className="flex gap-2">
      <div className="bg-gray-200/70 rounded h-5 w-20" />
      <div className="bg-gray-200/70 rounded h-5 w-16" />
    </div>
  </div>
);

export function TicketListPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading, error, refetch } = useTickets();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'ALL'>('ALL');
  const [agencyFilter, setAgencyFilter] = useState('ALL');

  const agencies = useMemo(() => {
    if (!tickets) return [];
    const map = new Map<string, string>();
    tickets.forEach((t) => {
      const id = t.agency_id.toString();
      if (!map.has(id)) map.set(id, t.agency?.name ?? `Agency #${id}`);
    });
    return Array.from(map.entries());
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const fields = [
          t.ticket_code,
          t.subject,
          t.agency?.name,
          t.agency?.email,
          t.agency?.phone,
          TICKET_CATEGORY_CONFIG[t.category]?.label,
          TICKET_PRIORITY_CONFIG[t.priority]?.label,
        ];
        if (!fields.some((f) => f?.toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== 'ALL' && t.ticket_status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (agencyFilter !== 'ALL' && t.agency_id.toString() !== agencyFilter) return false;
      return true;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter, agencyFilter]);

  const stats = useMemo(() => {
    if (!tickets) return { open: 0, inProgress: 0, resolved: 0, total: 0 };
    return {
      open: tickets.filter((t) => t.ticket_status === 'OPEN')
        .length,
      inProgress: tickets.filter((t) => t.ticket_status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t) => t.ticket_status === 'RESOLVED').length,
      total: tickets.length,
    };
  }, [tickets]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setAgencyFilter('ALL');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 lg:p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-text-primary">Support Tickets</h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          Manage and resolve agency support requests
        </p>
      </div>

      {/* Stats */}
      {!isLoading && tickets && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-6">
          <div className="bg-white rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary">Open</span>
            <span className="text-2xl font-bold text-green-600">{stats.open}</span>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary">In Progress</span>
            <span className="text-2xl font-bold text-amber-600">{stats.inProgress}</span>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary">Resolved</span>
            <span className="text-2xl font-bold text-blue-600">{stats.resolved}</span>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary">Total</span>
            <span className="text-2xl font-bold text-brand-primary">{stats.total}</span>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-secondary" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="pl-9 pr-3 w-auto"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as TicketStatus | 'ALL')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {(Object.keys(TICKET_STATUS_CONFIG) as TicketStatus[]).map((key) => (
              <SelectItem key={key} value={key}>
                {TICKET_STATUS_CONFIG[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(val) => setCategoryFilter(val as TicketCategory | 'ALL')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={agencyFilter}
          onValueChange={setAgencyFilter}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Agencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Agencies</SelectItem>
            {agencies.map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-red-500">Failed to load tickets.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 text-sm text-brand-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && tickets && (
        <>
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <TicketIcon className="w-12 h-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-brand-text-primary">No tickets yet</h3>
              <p className="text-sm text-brand-text-secondary mt-1">
                All agency support tickets will appear here
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-brand-text-secondary">No tickets match your filters</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-brand-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="bg-white rounded-xl border border-brand-border p-4 hover:shadow-md cursor-pointer transition-shadow"
                >
                  {/* Row 1: Ticket code + Rating + Status + Unread */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-brand-text-secondary">
                        {ticket.ticket_code}
                      </span>
                      {ticket.rating != null && (
                        <span className="flex items-center gap-0.5 text-xs text-brand-text-secondary">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {ticket.rating}/5
                        </span>
                      )}
                      {ticket.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {ticket.unread_count}
                        </span>
                      )}
                    </div>
                    <TicketStatusBadge status={ticket.ticket_status} />
                  </div>

                  {/* Row 2: Subject */}
                  <p className="mt-2 text-sm font-semibold text-brand-text-primary line-clamp-2">
                    {ticket.subject}
                  </p>

                  {/* Row 4: Agency info */}
                  <div className="mt-2 space-y-1">
                    <span className="text-xs font-medium text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-full">
                      {ticket.agency?.name ?? `Agency #${ticket.agency_id}`}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      {ticket.agency?.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-text-secondary">
                          <Phone className="h-3 w-3" />
                          {ticket.agency.phone}
                        </span>
                      )}
                      {ticket.agency?.email && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-text-secondary truncate max-w-[180px]">
                          <Mail className="h-3 w-3" />
                          {ticket.agency.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Category + Priority + Date */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-brand-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
                      {TICKET_CATEGORY_CONFIG[ticket.category].label}
                    </span>
                    <span className="text-xs text-brand-text-secondary">
                      <span
                        className={`font-medium ${TICKET_PRIORITY_CONFIG[ticket.priority].color}`}
                      >
                        {TICKET_PRIORITY_CONFIG[ticket.priority].label}
                      </span>
                      {' · '}
                      {new Date(ticket.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
