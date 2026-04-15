type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_ON_CUSTOMER'
  | 'WAITING_ON_3RD_PARTY'
  | 'RESOLVED'
  | 'CLOSED';

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

type TicketCategory = 'BUG' | 'TOPUP' | 'GENERAL' | 'FEATURE_REQUEST';

type TicketSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const TICKET_STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; badgeBg: string; badgeText: string; borderColor: string }
> = {
  OPEN: {
    label: 'Open',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    borderColor: 'border-green-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  WAITING_ON_CUSTOMER: {
    label: 'Waiting on Customer',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
  WAITING_ON_3RD_PARTY: {
    label: 'Waiting on 3rd Party',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
  RESOLVED: {
    label: 'Resolved',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  CLOSED: {
    label: 'Closed',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-600',
    borderColor: 'border-gray-300',
  },
};

export const TICKET_PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; color: string }
> = {
  LOW: { label: 'Low', color: 'text-gray-500' },
  MEDIUM: { label: 'Medium', color: 'text-amber-600' },
  HIGH: { label: 'High', color: 'text-red-600' },
};

export const TICKET_CATEGORY_CONFIG: Record<
  TicketCategory,
  { label: string }
> = {
  BUG: { label: 'Technical Issue' },
  TOPUP: { label: 'Top-up / Credits' },
  GENERAL: { label: 'General Question' },
  FEATURE_REQUEST: { label: 'Feature Request' },
};

export const TICKET_SEVERITY_CONFIG: Record<
  TicketSeverity,
  { label: string; badgeBg: string; badgeText: string }
> = {
  LOW: { label: 'Low', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' },
  MEDIUM: { label: 'Medium', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700' },
  HIGH: { label: 'High', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' },
  CRITICAL: { label: 'Critical', badgeBg: 'bg-red-100', badgeText: 'text-red-700' },
};

export const STATUS_WORKFLOW: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['WAITING_ON_CUSTOMER', 'WAITING_ON_3RD_PARTY', 'RESOLVED'],
  WAITING_ON_CUSTOMER: ['IN_PROGRESS', 'RESOLVED'],
  WAITING_ON_3RD_PARTY: ['IN_PROGRESS', 'RESOLVED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
};

export const CATEGORY_OPTIONS = [
  { value: 'BUG', label: 'Technical Issue' },
  { value: 'TOPUP', label: 'Top-up / Credits' },
  { value: 'GENERAL', label: 'General Question' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] as const;

export const KANBAN_COLUMNS: {
  key: TicketStatus;
  label: string;
  color: string;
}[] = [
  { key: 'OPEN', label: 'Open', color: '#22C55E' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B' },
  { key: 'WAITING_ON_CUSTOMER', label: 'Waiting on Customer', color: '#EA580C' },
  { key: 'WAITING_ON_3RD_PARTY', label: 'Waiting on 3rd Party', color: '#7C3AED' },
  { key: 'RESOLVED', label: 'Resolved', color: '#3B82F6' },
  { key: 'CLOSED', label: 'Closed', color: '#94A3B8' },
];
