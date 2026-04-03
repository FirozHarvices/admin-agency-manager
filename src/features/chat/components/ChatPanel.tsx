import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { RootState } from '@/store';
import { useSocket } from '../providers/SocketProvider';
import { useMessages } from '../hooks/useMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Ticket } from '@/features/tickets/types';
import { TICKET_KEYS } from '@/features/tickets/hooks';

interface ChatPanelProps {
  ticketId: number;
  ticketStatus: string;
}

export function ChatPanel({ ticketId, ticketStatus }: ChatPanelProps) {
  const socket = useSocket();
  const adminUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useMessages(ticketId);
  const sendMutation = useSendMessage(ticketId);

  const isClosed = ticketStatus === 'CLOSED';

  const emitMarkRead = () => {
    if (!socket || !adminUser) return;
    socket.emit('mark_read', {
      ticket_id: ticketId,
      reader_id: Number(adminUser.id),
      token: localStorage.getItem('token') ?? '',
    });
  };

  // Join room + mark read on mount, leave room on unmount
  useEffect(() => {
    if (!socket || !adminUser) return;

    socket.emit('join_ticket', { ticket_id: ticketId });
    emitMarkRead();

    // Clear unread count in ticket list cache
    queryClient.setQueryData<Ticket[]>(TICKET_KEYS.all, (old) => {
      if (!old) return old;
      return old.map((t) =>
        t.id === ticketId ? { ...t, unread_count: 0 } : t
      );
    });

    // Mark read on every incoming message while chat is open
    const handleIncoming = (message: { ticket_id: number }) => {
      if (message.ticket_id === ticketId) {
        emitMarkRead();
      }
    };
    socket.on('receive_message', handleIncoming);

    return () => {
      socket.off('receive_message', handleIncoming);
      socket.emit('leave_ticket', { ticket_id: ticketId });
      // Refetch ticket list so counts are fresh when returning
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    };
  }, [socket, ticketId, adminUser, queryClient]);

  const handleSend = (msg: string) => {
    if (!adminUser) return;
    sendMutation.mutate({
      ticket_id: ticketId,
      sender_id: Number(adminUser.id),
      msg,
      sender_type: 'ADMIN',
      attachment: null,
    });
  };

  return (
    <div className="mt-4 bg-white rounded-xl border border-brand-border flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <MessageSquare className="h-4 w-4 text-brand-text-secondary" />
        <span className="text-sm font-medium text-brand-text-primary">Conversation</span>
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-400">Loading messages...</div>
        </div>
      ) : messages && messages.length > 0 ? (
        <MessageList messages={messages} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">No messages yet. Start the conversation.</p>
        </div>
      )}

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isClosed} />
    </div>
  );
}
