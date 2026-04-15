import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { chatApi } from '../api';
import { ChatMessage } from '../types';
import { useSocket } from '../providers/SocketProvider';
import { RootState } from '@/store';

export const MESSAGE_KEYS = {
  history: (ticketId: number) => ['chat', ticketId] as const,
};

export function useMessages(ticketId: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const adminUser = useSelector((state: RootState) => state.auth.user);

  const query = useQuery({
    queryKey: MESSAGE_KEYS.history(ticketId),
    queryFn: async () => {
      const response = await chatApi.getHistory(ticketId);
      return response.data.data;
    },
    enabled: ticketId > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      if (message.ticket_id !== ticketId) return;

      // Server may not include created_at — fall back to now
      const enriched: ChatMessage = {
        ...message,
        created_at: message.created_at || new Date().toISOString(),
      };

      const isOwnMessage =
        adminUser &&
        message.sender_type === 'ADMIN' &&
        Number(message.sender_id) === Number(adminUser.id);

      queryClient.setQueryData<ChatMessage[]>(
        MESSAGE_KEYS.history(ticketId),
        (old) => {
          if (!old) return [enriched];

          // Prevent duplicates (by ID) which can happen if replacement 
          // fails or socket fires twice.
          if (old.some((m) => m.id === enriched.id)) return old;

          // Own message: replace the oldest optimistic entry so the real
          // server-side attachments (attachment_path) render in place of the
          // empty optimistic attachments.
          if (isOwnMessage) {
            const idx = old.findIndex((m) => m.__optimistic);
            if (idx !== -1) {
              const next = [...old];
              next[idx] = enriched;
              return next;
            }
          }

          // Incoming from someone else (or a late own-echo with no pending
          // optimistic entry) — append normally.
          return [...old, enriched];
        }
      );
    };

    socket.on('receive_message', handleNewMessage);
    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, ticketId, queryClient, adminUser]);

  return query;
}
