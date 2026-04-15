export interface ChatAttachment {
  id: number;
  attachment_path: string;
  is_active: boolean;
  ticket_support_chat_id: number;
  created_at?: string;
}

export interface ChatMessage {
  id: number;
  ticket_id: number;
  sender_id: number;
  sender_type: 'ADMIN' | 'AGENCY';
  msg: string;
  attachments: ChatAttachment[];
  created_at: string;
  /** Client-only flag: true while waiting for the server to echo back the real message. */
  __optimistic?: boolean;
}

export interface ChatHistoryResponse {
  status: boolean;
  data: ChatMessage[];
}
