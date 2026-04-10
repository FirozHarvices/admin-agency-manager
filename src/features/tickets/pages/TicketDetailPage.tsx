import { useState, useEffect } from 'react';
import { useSetPageMeta } from '@/hooks/useSetPageMeta';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTicket, useUpdateTicket } from '../hooks';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import {
  TICKET_STATUS_CONFIG,
  TICKET_PRIORITY_CONFIG,
  TICKET_CATEGORY_CONFIG,
} from '../constants';
import type { TicketStatus, TicketPriority } from '../types';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import { ChevronLeft, Paperclip, Download, Eye, User, Star, RefreshCw } from 'lucide-react';
import { ChatPanel } from '@/features/chat/components/ChatPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200/70 rounded-md ${className}`} />
);

export function TicketDetailPage() {
  useSetPageMeta('Ticket Details', 'View and manage ticket information');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);

  const adminUser = useSelector((state: RootState) => state.auth.user);
  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId);
  const updateTicketMutation = useUpdateTicket();

  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | ''>('');

  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.ticket_status);
      setSelectedPriority(ticket.priority);
    }
  }, [ticket]);

  const isClosed = ticket?.ticket_status === 'CLOSED';
  const hasChanges =
    ticket &&
    (selectedStatus !== ticket.ticket_status || selectedPriority !== ticket.priority);

  const handleUpdate = async () => {
    if (!ticket || !selectedStatus || !selectedPriority) return;
    const payload = {
      subject: ticket.subject,
      description: ticket.description,
      ticket_status: selectedStatus,
      priority: selectedPriority,
      agency_id: ticket.agency_id,
      category: ticket.category,
      category_values: ticket.category_values,
      managed_by: adminUser ? Number(adminUser.id) : ticket.managed_by,
      attachments: ticket.attachments,
    };
    await updateTicketMutation.mutateAsync({ id: ticketId, payload });
  };

  const PREVIEWABLE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'txt', 'mp4', 'webm', 'ogg'];

  const getFileUrl = (path: string) =>
    `${import.meta.env.VITE_FILE_DOWNLOAD_URL}/${path}`;

  const isPreviewable = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase() ?? '';
    return PREVIEWABLE_EXTENSIONS.includes(ext);
  };

  const handleAttachmentClick = async (path: string) => {
    const url = getFileUrl(path);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (isPreviewable(path)) {
        window.open(blobUrl, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = path;
        a.click();
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      toast.error('Failed to open file.');
    }
  };

  const formatCamelCase = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() ?? path;
    const dotIndex = fileName.lastIndexOf('.');
    const name = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
    const ext = dotIndex > 0 ? fileName.slice(dotIndex) : '';
    const dashIndex = name.lastIndexOf('-');
    if (dashIndex > 0) {
      return name.slice(0, dashIndex) + ext;
    }
    return fileName;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-3 lg:p-4">
        <SkeletonBlock className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SkeletonBlock className="h-32 w-full" />
            <SkeletonBlock className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-36 w-full" />
            <SkeletonBlock className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (isError || !ticket) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-3 lg:p-4">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-red-500">Failed to load ticket.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 text-sm text-brand-primary hover:underline"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/tickets')}
            className="mt-2 text-sm text-brand-text-secondary hover:underline"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 lg:p-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-1 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Tickets
      </button>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-2 bg-gray-50/80 rounded-xl border border-gray-100 p-4">
          {/* Section 1 — Ticket header */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono text-brand-text-secondary">{ticket.ticket_code}</span>
              {ticket.is_reopen && (
                <span className="inline-flex items-center gap-1 pl-1 pr-1.5 py-[1px] rounded-md text-[9px] font-bold border border-red-200 bg-red-50 text-red-600 uppercase">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Reopened
                </span>
              )}
              <TicketStatusBadge status={ticket.ticket_status} />
              <span
                className={`text-xs font-medium ${TICKET_PRIORITY_CONFIG[ticket.priority].color}`}
              >
                {TICKET_PRIORITY_CONFIG[ticket.priority].label}
              </span>
              {ticket.rating != null && (
                <div className="flex items-center gap-1 ml-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-brand-text-secondary">{ticket.rating}/5</span>
                </div>
              )}
            </div>
            <h1 className="mt-2 text-lg font-bold text-brand-text-primary">{ticket.subject}</h1>
            <div className="mt-2 flex gap-4 text-xs text-brand-text-secondary">
              <span>{TICKET_CATEGORY_CONFIG[ticket.category].label}</span>
              <span>
                {new Date(ticket.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-brand-primary font-medium">{ticket.agency?.name ?? `Agency #${ticket.agency_id}`}</span>
            </div>
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Section 2 — Description */}
          <p className="text-sm text-brand-text-primary whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </p>

          {/* Section 3 — Additional details */}
          {Object.keys(ticket.category_values).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(ticket.category_values).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs"
                >
                  <span className="font-semibold text-brand-text-primary">{formatCamelCase(key)}:</span>
                  <span className="text-brand-text-secondary">{value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Section 4 — Attachments */}
          {ticket.attachments.length > 0 && (
            <>
              <hr className="my-3 border-gray-200" />
              <div>
                <p className="text-xs text-gray-500 mb-2">Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      onClick={() => handleAttachmentClick(attachment.attachment_path)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors group max-w-[220px]"
                      title={isPreviewable(attachment.attachment_path) ? 'Preview' : 'Download'}
                    >
                      <Paperclip className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-brand-text-primary truncate">
                        {getDisplayName(attachment.attachment_path)}
                      </span>
                      {isPreviewable(attachment.attachment_path) ? (
                        <Eye className="h-3.5 w-3.5 text-gray-400 group-hover:text-brand-primary flex-shrink-0" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-gray-400 group-hover:text-brand-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section 5 — Conversation */}
          <ChatPanel ticketId={ticketId} ticketStatus={ticket.ticket_status} />
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1 bg-gray-50/80 rounded-xl border border-gray-100 p-4 h-fit">
          {/* Panel 1 — Agency Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Agency
            </p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-text-secondary" />
              <span className="text-sm font-semibold text-brand-text-primary">
                {ticket.agency?.name ?? `Agency #${ticket.agency_id}`}
              </span>
            </div>
            {ticket.agency?.email && (
              <p className="text-xs text-brand-text-secondary mt-1">{ticket.agency.email}</p>
            )}
            {ticket.agency?.phone && (
              <p className="text-xs text-brand-text-secondary mt-0.5">{ticket.agency.phone}</p>
            )}
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Panel 2 — Update Status & Severity */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Update Ticket
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Select
                  value={selectedStatus}
                  onValueChange={(val) => setSelectedStatus(val as TicketStatus)}
                  disabled={isClosed || updateTicketMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TICKET_STATUS_CONFIG) as TicketStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {TICKET_STATUS_CONFIG[key].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Severity</p>
                <Select
                  value={selectedPriority}
                  onValueChange={(val) => setSelectedPriority(val as TicketPriority)}
                  disabled={isClosed || updateTicketMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TICKET_PRIORITY_CONFIG) as TicketPriority[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {TICKET_PRIORITY_CONFIG[key].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <button
                onClick={handleUpdate}
                disabled={isClosed || !hasChanges || updateTicketMutation.isPending}
                className="w-full py-2 px-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateTicketMutation.isPending ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
