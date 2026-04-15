import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { RootState } from '@/store';
import { useSocket } from '../providers/SocketProvider';
import { useMessages } from '../hooks/useMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { compressImageIfPossible } from '../utils/compressImage';
import { Ticket } from '@/features/tickets/types';
import { TICKET_KEYS } from '@/features/tickets/hooks';

interface ChatPanelProps {
  ticketId: number;
  ticketStatus: string;
}

/** Reads a File as base64 (without the `data:<mime>;base64,` prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ChatPanel({ ticketId, ticketStatus }: ChatPanelProps) {
  const socket = useSocket();
  const adminUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useMessages(ticketId);
  const sendMutation = useSendMessage(ticketId);

  const [sending, setSending] = useState(false);
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

  const handleSend = async (msg: string, files: File[]) => {
    if (!adminUser) return;

    let attachments: { filename: string; content_type: string; content: string }[] = [];

    if (files.length > 0) {
      try {
        setSending(true);
        // Compress images client-side (~90% reduction) before base64-encoding
        const processed = await Promise.all(files.map(compressImageIfPossible));
        const contents = await Promise.all(processed.map(fileToBase64));
        attachments = processed.map((file, i) => ({
          filename: file.name,
          content_type: file.type || 'application/octet-stream',
          content: contents[i],
        }));
      } catch {
        toast.error('Failed to read file(s)');
        setSending(false);
        return;
      } finally {
        setSending(false);
      }
    }

    sendMutation.mutate({
      ticket_id: ticketId,
      sender_id: Number(adminUser.id),
      msg,
      sender_type: 'ADMIN',
      attachments,
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
      <MessageInput onSend={handleSend} disabled={isClosed} sending={sending} />
    </div>
  );
}
