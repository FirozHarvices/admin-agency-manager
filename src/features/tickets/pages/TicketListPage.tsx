import { useState, useMemo, useEffect } from 'react';
import { useSetPageMeta } from '@/hooks/useSetPageMeta';
import { useNavigate } from 'react-router-dom';
import { useNewTickets } from '@/features/chat/providers/SocketProvider';
import { Ticket as TicketIcon, Search, Star, Phone, Mail, ChevronDown } from 'lucide-react';
import { useTickets } from '../hooks';
import {
  TICKET_CATEGORY_CONFIG,
  TICKET_PRIORITY_CONFIG,
  CATEGORY_OPTIONS,
  KANBAN_COLUMNS,
} from '../constants';
import { TicketCategory, Ticket } from '../types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

const REOPENED_OPTION = { key: 'REOPENED' as const, label: 'Reopened', color: '#EF4444' };
const STATUS_OPTIONS = [REOPENED_OPTION, ...KANBAN_COLUMNS];
const DEFAULT_STATUSES = new Set([
  'REOPENED',
  'OPEN',
  'IN_PROGRESS',
  'WAITING_ON_CUSTOMER',
  'WAITING_ON_3RD_PARTY',
]);

const SkeletonCard = () => (
  <div role="status" className="animate-pulse bg-white rounded-[10px] border border-[#E4E6EF] p-3.5 space-y-2">
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

const SkeletonColumn = () => (
  <div className="flex-shrink-0 w-[270px] bg-[#ECEEF4] rounded-[10px] p-2.5">
    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#DDE0EC]">
      <div className="bg-gray-300/50 rounded h-3 w-20" />
      <div className="bg-white rounded-full h-5 w-8" />
    </div>
    <div className="space-y-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[10px] border border-[#E4E6EF] p-3.5 cursor-pointer transition-all hover:border-brand-primary hover:shadow-[0_4px_16px_rgba(93,80,254,0.12)]"
    >
      {/* Row 1: Ticket code + Rating + Unread + Status */}
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#9A9CB8]">
            {ticket.ticket_code}
          </span>
          {ticket.rating != null && (
            <span className="flex items-center gap-0.5 text-[11px] text-[#9A9CB8]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {ticket.rating}/5
            </span>
          )}
          {ticket.unread_count > 0 && (
            <span className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold">
              {ticket.unread_count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold ${TICKET_PRIORITY_CONFIG[ticket.priority].color}`}>
            {TICKET_PRIORITY_CONFIG[ticket.priority].label}
          </span>
        </div>
      </div>

      {/* Row 2: Subject */}
      <p className="text-sm font-bold text-[#1B1D29] leading-snug line-clamp-2 mb-2">
        {ticket.subject}
      </p>

      {/* Row 3: Agency tag */}
      <div className="mb-2">
        <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEEDFF] text-[#5B52E0]">
          {ticket.agency?.name ?? `Agency #${ticket.agency_id}`}
        </span>
      </div>

      {/* Row 4: Contact info */}
      <div className="flex items-center gap-3 flex-wrap mb-2">
        {ticket.agency?.phone && (
          <span className="flex items-center gap-1 text-[11px] text-[#6E7191]">
            <Phone className="h-[11px] w-[11px]" />
            {ticket.agency.phone}
          </span>
        )}
        {ticket.agency?.email && (
          <span className="flex items-center gap-1 text-[11px] text-[#6E7191] truncate max-w-[160px]">
            <Mail className="h-[11px] w-[11px]" />
            {ticket.agency.email}
          </span>
        )}
      </div>

      {/* Row 5: Category + Date */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F0F1F8]">
        <span className="text-[11px] text-[#6E7191] bg-[#F4F6FA] border border-[#E4E6EF] rounded-md px-2 py-0.5">
          {TICKET_CATEGORY_CONFIG[ticket.category].label}
        </span>
        <span className="text-[11px] text-[#6E7191]">
          {new Date(ticket.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

export function TicketListPage() {
  useSetPageMeta('Support Tickets', 'Manage and resolve agency support requests');
  const navigate = useNavigate();
  const { data: tickets, isLoading, error, refetch } = useTickets();
  const { newTicketCount, clearNewTickets } = useNewTickets();

  useEffect(() => {
    if (newTicketCount > 0) clearNewTickets();
  }, [newTicketCount, clearNewTickets]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(() => new Set(DEFAULT_STATUSES));
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'ALL'>('ALL');
  const [agencyFilter, setAgencyFilter] = useState('ALL');

  const toggleStatus = (key: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const statusLabel = selectedStatuses.size === STATUS_OPTIONS.length
    ? 'All Statuses'
    : `${selectedStatuses.size} Statuses`;

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
      const statusKey = t.is_reopen ? 'REOPENED' : t.ticket_status;
      if (!selectedStatuses.has(statusKey)) return false;
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
          t.is_reopen ? 'reopened' : '',
        ];
        if (!fields.some((f) => f?.toLowerCase().includes(q))) return false;
      }
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (agencyFilter !== 'ALL' && t.agency_id.toString() !== agencyFilter) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [tickets, searchQuery, selectedStatuses, categoryFilter, agencyFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatuses(new Set(DEFAULT_STATUSES));
    setCategoryFilter('ALL');
    setAgencyFilter('ALL');
  };

  return (
    <div className="bg-[#F4F6FA] rounded-xl p-3 lg:p-5">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 flex-wrap mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9A9CB8]" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="pl-9 pr-3 w-[220px] text-[13px] h-9 bg-white border-[#E4E6EF]"
          />
        </div>

        {!isLoading && tickets && (
          <span className="text-[13px] text-[#9A9CB8] font-medium ml-1 whitespace-nowrap">
            Total: <span className="text-[#1B1D29] font-bold">{tickets.length}</span> tickets
          </span>
        )}

        <div className="flex-1" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center justify-between gap-2 h-9 px-3 w-[160px] rounded-md border border-[#E4E6EF] bg-white text-[13px] text-[#1B1D29] hover:bg-gray-50 transition-colors">
              <span>{statusLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#9A9CB8]" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[220px] p-2">
            {STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedStatuses.has(opt.key)}
                  onCheckedChange={() => toggleStatus(opt.key)}
                />
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="text-[13px] text-[#1B1D29]">{opt.label}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        <Select
          value={categoryFilter}
          onValueChange={(val) => setCategoryFilter(val as TicketCategory | 'ALL')}
        >
          <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-[#E4E6EF]">
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
          <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-[#E4E6EF]">
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
        <div className="flex gap-3.5 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <SkeletonColumn key={i} />
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

      {/* Kanban Board */}
      {!isLoading && !error && tickets && (
        <>
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <TicketIcon className="w-12 h-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-[#1B1D29]">No tickets yet</h3>
              <p className="text-sm text-[#9A9CB8] mt-1">
                All agency support tickets will appear here
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-[#9A9CB8]">No tickets match your filters</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-brand-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex gap-3.5 overflow-x-auto pb-2 items-start">
              {/* Reopened column — only visible when reopened tickets exist */}
              {(() => {
                if (!selectedStatuses.has('REOPENED')) return null;
                const reopenedTickets = filteredTickets.filter((t) => t.is_reopen);
                if (reopenedTickets.length === 0) return null;
                return (
                  <div className="flex-shrink-0 w-[270px] bg-[#ECEEF4] rounded-[10px] p-2.5">
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#DDE0EC]">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: '#EF4444' }}
                      >
                        Reopened
                      </span>
                      <span className="text-[11px] font-semibold bg-white border border-[#E4E6EF] rounded-full px-2 py-px text-[#9A9CB8]">
                        {reopenedTickets.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {reopenedTickets.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Status columns */}
              {KANBAN_COLUMNS.filter((col) => selectedStatuses.has(col.key)).map((col) => {
                const colTickets = filteredTickets.filter(
                  (t) => t.ticket_status === col.key && !t.is_reopen
                );
                return (
                  <div
                    key={col.key}
                    className="flex-shrink-0 w-[270px] bg-[#ECEEF4] rounded-[10px] p-2.5"
                  >
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#DDE0EC]">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: col.color }}
                      >
                        {col.label}
                      </span>
                      <span className="text-[11px] font-semibold bg-white border border-[#E4E6EF] rounded-full px-2 py-px text-[#9A9CB8]">
                        {colTickets.length}
                      </span>
                    </div>

                    {/* Cards */}
                    {colTickets.length === 0 ? (
                      <p className="text-center text-[12px] text-[#9A9CB8] py-5">
                        No tickets
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {colTickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
