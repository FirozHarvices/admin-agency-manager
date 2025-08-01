import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgency, topUpAgency } from '../api';
import { CreateAgencyPayload, TopUpAgencyPayload } from '../types';
import { useToast } from '../../../components/ui/use-toast';


export const useCreateAgency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateAgencyPayload) => createAgency(payload),
    onSuccess: (data) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast({
        title: 'Agency Created Successfully',
        description: `${data.name} has been added to the system.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Creating Agency',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useTopUpAgency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: TopUpAgencyPayload) => topUpAgency(payload),
    onSuccess: (data) => {
      // Invalidate multiple queries that depend on this data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['topUpHistory'] });

      toast({
        title: 'Top-Up Successful',
        description: `Resources have been added to ${data.name}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Topping Up',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};