import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgency, topUpAgency } from '../api';
import { CreateAgencyPayload, TopUpAgencyPayload } from '../types';
import toast from 'react-hot-toast';


export const useCreateAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAgencyPayload) => createAgency(payload),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success('Agency created successfully')

    },
    onError: (error) => {
      toast.error(`${error} Error Creating Agency`)
    },
  });
};

export const useTopUpAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TopUpAgencyPayload) => topUpAgency(payload),
    onSuccess: (data) => {
      // Invalidate multiple queries that depend on this data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['topUpHistory'] });

      toast.success(`Top-up successful for ${data.name}`);
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error topping up agency'}`);

    },
  });
};