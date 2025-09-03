import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgency, topUpAgency, deleteAgency, suspendAgency, reactivateAgency, updateAgency, UpdateAgencyPayload, verifyOtp, VerifyOtpPayload, deleteWebsite, suspendWebsite, reactivateWebsite } from '../api';
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

export const useReactivateAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agencyId: number) => reactivateAgency(agencyId),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success('Agency reactivated successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error reactivating agency'}`);
    },
  });
};

export const useSuspendAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agencyId: number) => suspendAgency(agencyId),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success('Agency suspended successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error suspending agency'}`);
    },
  });
};

export const useDeleteAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agencyId: number) => deleteAgency(agencyId),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success('Agency deleted successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error deleting agency'}`);
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: Error) => {
      throw error;
    },
  });
};

export const useUpdateAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAgencyPayload) => updateAgency(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`Agency updated successfully`);
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error updating agency'}`);
    },
  });
};

// Website Management Hooks
export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (websiteId: number) => deleteWebsite(websiteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Website deleted successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error deleting website'}`);
    },
  });
};

export const useSuspendWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (websiteId: number) => suspendWebsite(websiteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Website suspended successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error suspending website'}`);
    },
  });
};

export const useReactivateWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (websiteId: number) => reactivateWebsite(websiteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Website reactivated successfully');
    },
    onError: (error) => {
      toast.error(`${error.message || 'Error reactivating website'}`);
    },
  });
};