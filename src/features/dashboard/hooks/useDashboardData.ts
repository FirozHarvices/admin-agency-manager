import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchDashboardData } from '../api';
import { RootState } from '../../../store';

export const useDashboardData = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

   return useQuery({
    queryKey: ['dashboardData', userId],
    queryFn: () => fetchDashboardData(userId!),
    enabled: !!userId,
    retry: false, 
  });
};