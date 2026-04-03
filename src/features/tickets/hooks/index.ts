import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ticketApi } from '../api';
import { UpdateTicketPayload } from '../types';

export const TICKET_KEYS = {
  all: ['tickets'] as const,
  detail: (id: number) => ['tickets', id] as const,
};

export function useTickets() {
  return useQuery({
    queryKey: TICKET_KEYS.all,
    queryFn: async () => {
      const response = await ticketApi.getAll();
      return response.data.data;
    },
    staleTime: 10 * 1000,
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: TICKET_KEYS.detail(id),
    queryFn: async () => {
      const response = await ticketApi.getById(id);
      return response.data.data;
    },
    enabled: id > 0,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTicketPayload }) =>
      ticketApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(id) });
      toast.success('Ticket updated');
    },
    onError: () => {
      toast.error('Failed to update ticket. Please try again.');
    },
  });
}
