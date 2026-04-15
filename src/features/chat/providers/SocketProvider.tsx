import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { RootState } from '@/store';
import { Ticket } from '@/features/tickets/types';
import { TICKET_KEYS } from '@/features/tickets/hooks';

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

const NewTicketContext = createContext<{
  newTicketCount: number;
  clearNewTickets: () => void;
}>({ newTicketCount: 0, clearNewTickets: () => {} });

export function useNewTickets() {
  return useContext(NewTicketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newTicketCount, setNewTicketCount] = useState(0);
  const clearNewTickets = useCallback(() => setNewTicketCount(0), []);

  useEffect(() => {
    if (!user) return;

    const s = getSocket();

    s.on('connect', () => {
      console.log('[Socket] Connected:', s.id);
    });

    s.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    s.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    s.on('increase_count', (data: { sender_id: number; unread_chats_count: Record<string, number> }) => {
      // Ignore unread bumps caused by the admin's own messages
      if (data.sender_id === Number(user.id)) return;

      queryClient.setQueryData<Ticket[]>(TICKET_KEYS.all, (old) => {
        if (!old) return old;
        return old.map((t) => {
          const count = data.unread_chats_count[t.id];
          return count !== undefined ? { ...t, unread_count: count } : t;
        });
      });
    });

    s.on('create_ticket', (_data: { ticket_id: number }) => {
      setNewTicketCount((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    });

    if (!s.connected) {
      s.connect();
    }

    setSocket(s);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [user, queryClient]);

  return (
    <SocketContext.Provider value={socket}>
      <NewTicketContext.Provider value={{ newTicketCount, clearNewTickets }}>
        {children}
      </NewTicketContext.Provider>
    </SocketContext.Provider>
  );
}
