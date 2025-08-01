import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getAgencies, getAgencyHistory, getDashboardStats } from '../api';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const AGENCY_QUERY_KEYS = {
  agencies: (adminId: number | undefined) => ['agencies', adminId],
  stats: (adminId: number | undefined) => ['dashboardStats', adminId],
  history: (adminId: number | undefined) => ['agencyHistory', adminId],
};

export const useGetAgencies = () => {
  const currentUser = useSelector(selectCurrentUser);
  const adminId = currentUser?.id;

  return useQuery({
    queryKey: AGENCY_QUERY_KEYS.agencies(adminId),
    queryFn: () => getAgencies(adminId!),
    enabled: !!adminId,
  });
};

// The stats hook should also depend on the adminId
export const useGetDashboardStats = () => {
    const currentUser = useSelector(selectCurrentUser);
    const adminId = currentUser?.id;

    return useQuery({
      queryKey: AGENCY_QUERY_KEYS.stats(adminId),
      queryFn: () => getDashboardStats(adminId!),
      enabled: !!adminId,
    });
};


export const useGetAgencyHistory = () => {
  const currentUser = useSelector(selectCurrentUser);
  const adminId = currentUser?.id;

  return useQuery({
    queryKey: AGENCY_QUERY_KEYS.history(adminId),
    queryFn: () => getAgencyHistory(adminId!),
    enabled: !!adminId,
  });
};