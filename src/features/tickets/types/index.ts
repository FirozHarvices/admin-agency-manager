import {
  TICKET_STATUS_CONFIG,
  TICKET_PRIORITY_CONFIG,
  TICKET_CATEGORY_CONFIG,
  TICKET_SEVERITY_CONFIG,
} from '../constants';

export type TicketStatus = keyof typeof TICKET_STATUS_CONFIG;
export type TicketPriority = keyof typeof TICKET_PRIORITY_CONFIG;
export type TicketCategory = keyof typeof TICKET_CATEGORY_CONFIG;
export type TicketSeverity = keyof typeof TICKET_SEVERITY_CONFIG;

export interface TicketAttachment {
  id: number;
  attachment_path: string;
  is_active: boolean;
  ticket_id: number;
}

export interface TicketAgency {
  email: string;
  name: string;
  phone: string;
  user_role: string;
}

export interface Ticket {
  id: number;
  ticket_code: string;
  subject: string;
  description: string;
  ticket_status: TicketStatus;
  priority: TicketPriority;
  agency_id: number;
  agency: TicketAgency;
  category: TicketCategory;
  category_values: Record<string, string>;
  managed_by: number | null;
  attachments: TicketAttachment[];
  unread_count: number;
  rating: number | null;
  is_reopen?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateTicketPayload {
  subject: string;
  description: string;
  ticket_status: TicketStatus;
  priority: TicketPriority;
  agency_id: number;
  category: TicketCategory;
  category_values: Record<string, string>;
  managed_by: number | null;
  attachments: TicketAttachment[];
}

export interface TicketsListResponse {
  status: boolean;
  data: Ticket[];
}

export interface TicketDetailResponse {
  status: boolean;
  data: Ticket;
}
