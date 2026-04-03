export interface ChatMessage {
  id: number;
  ticket_id: number;
  sender_id: number;
  sender_type: 'ADMIN' | 'AGENCY';
  msg: string;
  attachment: string | null;
  created_at: string;
}

export interface ChatHistoryResponse {
  status: boolean;
  data: ChatMessage[];
}
