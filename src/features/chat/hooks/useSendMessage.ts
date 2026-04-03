import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '../types';
import { MESSAGE_KEYS } from './useMessages';
import { useSocket } from '../providers/SocketProvider';

export function useSendMessage(ticketId: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const mutate = (payload: {
    ticket_id: number;
    sender_id: number;
    msg: string;
    sender_type: string;
    attachment: string | null;
  }) => {
    if (!socket) return;

    // Optimistically add message to cache (sender won't receive their own
    // message back from the server — it only echoes to other participants)
    const optimistic: ChatMessage = {
      id: Date.now(),
      ticket_id: payload.ticket_id,
      sender_id: payload.sender_id,
      sender_type: payload.sender_type as 'ADMIN' | 'AGENCY',
      msg: payload.msg,
      attachment: payload.attachment,
      created_at: new Date().toISOString(),
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
      attachment: payload.attachment,
      token: localStorage.getItem('token') ?? '',
    });
  };

  return { mutate };
}
