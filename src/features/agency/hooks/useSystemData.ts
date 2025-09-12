import { useQuery } from "@tanstack/react-query";
import { getSystemData } from "../api";

export const useSystemData = () => {
  return useQuery({
    queryKey: ["systemData"],
    queryFn: () => getSystemData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};