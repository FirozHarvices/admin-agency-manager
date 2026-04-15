import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '../types';
import { MESSAGE_KEYS } from './useMessages';
import { useSocket } from '../providers/SocketProvider';

interface OutgoingAttachment {
  filename: string;
  content_type: string;
  content: string; // base64 without data URL prefix
}

export function useSendMessage(ticketId: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const mutate = (payload: {
    ticket_id: number;
    sender_id: number;
    msg: string;
    sender_type: string;
    attachments: OutgoingAttachment[];
  }) => {
    if (!socket) return;

    // Optimistically add message to cache. Attachments are left empty — the
    // server echoes back the real ChatAttachment shape ({ id, attachment_path,
    // ... }) shortly after, and useMessages will replace the optimistic entry.
    const optimistic: ChatMessage = {
      id: Date.now(),
      ticket_id: payload.ticket_id,
      sender_id: payload.sender_id,
      sender_type: payload.sender_type as 'ADMIN' | 'AGENCY',
      msg: payload.msg,
      attachments: [],
      created_at: new Date().toISOString(),
      __optimistic: true,
    };

    queryClient.setQueryData<ChatMessage[]>(
      MESSAGE_KEYS.history(ticketId),
      (old) => (old ? [...old, optimistic] : [optimistic])
    );

    // Emit via socket
    socket.emit('send_message', {
      ticket_id: payload.ticket_id,
      sender_id: payload.sender_id,
      msg: payload.msg,
      sender_type: payload.sender_type,
      attachments: payload.attachments,
      token: localStorage.getItem('token') ?? '',
    });
  };

  return { mutate };
}
