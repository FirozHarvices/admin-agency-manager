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

      // Skip messages sent by the current admin — they are already
      // added optimistically in useSendMessage
      if (
        adminUser &&
        message.sender_type === 'ADMIN' &&
        message.sender_id === Number(adminUser.id)
      ) {
        return;
      }

      // Server may not include created_at — fall back to now
      const enriched: ChatMessage = {
        ...message,
        created_at: message.created_at || new Date().toISOString(),
      };

      queryClient.setQueryData<ChatMessage[]>(
        MESSAGE_KEYS.history(ticketId),
        (old) => (old ? [...old, enriched] : [enriched])
      );
    };

    socket.on('receive_message', handleNewMessage);
    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, ticketId, queryClient, adminUser]);

  return query;
}
