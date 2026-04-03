import { createContext, useContext, useEffect, useState } from 'react';
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

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

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
      queryClient.setQueryData<Ticket[]>(TICKET_KEYS.all, (old) => {
        if (!old) return old;
        return old.map((t) => {
          const count = data.unread_chats_count[t.id];
          return count !== undefined ? { ...t, unread_count: count } : t;
        });
      });
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
      {children}
    </SocketContext.Provider>
  );
}
