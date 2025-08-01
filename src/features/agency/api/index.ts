import axiosClient from "../../../api/axiosClient";
import { Agency, CreateAgencyPayload, TopUpAgencyPayload, DashboardStats, TopUpHistoryItem, ApiResponse } from "../types";

// NOTE: I've invented endpoint URLs based on common REST patterns.
// Replace '/agencies', '/agencies/stats', etc., with your actual API routes.

/**
 * Fetches the list of all agencies.
 */
export const getAgencies = async (adminId: number): Promise<Agency[]> => {
  const response = await axiosClient.get<ApiResponse<{ users: Agency[] }>>(`/user/getAgency/${adminId}`);
  if (!response.data || !response.data.status) { // Added a check for response.data itself
    throw new Error(response.data?.message || 'Failed to fetch agencies.');
  }
  console.log("Agencies fetched:", response.data.data    ); 
  return response.data.data;
};


/**
 * Fetches the dashboard stats.
 * In a real app, this would be a dedicated endpoint. Here we'll compute it.
 */
export const getDashboardStats = async (adminId: number): Promise<DashboardStats> => {
    const agencies: Agency[] = await getAgencies(adminId); 
    
     const stats: DashboardStats = {
        // Total number of agencies is simply the length of the array
        totalAgencies: agencies.length,
        
        // Sum the 'website_count' from each agency object
        totalWebsites: agencies.reduce((sum, agency) => sum + agency.website_count, 0),
        
        // Sum the 'storage' (in MB), then convert the total to GB and format it
        totalStorageGB: parseFloat(
            (agencies.reduce((sum, agency) => sum + agency.storage, 0) / 1000).toFixed(1)
        ),
        
        // Sum the 'token_count', then convert the total to thousands (K) and format it
        totalTokensK: parseFloat(
            (agencies.reduce((sum, agency) => sum + agency.token_count, 0) / 1000).toFixed(0)
        ),
    };
return stats;
  }

/**
 * Fetches the top-up history.
 */
export const getAgencyHistory = async (adminId: number): Promise<TopUpHistoryItem[]> => {
  const response = await axiosClient.get<ApiResponse<TopUpHistoryItem[]>>(`/user/getAgencyHistory/${adminId}`);
  
  if (!response.data || !response.data.status) {
    throw new Error(response.data?.message || 'Failed to fetch top-up history.');
  }
  return response.data.data; 
};
/**
 * Creates a new agency.
 */
export const createAgency = async (payload: CreateAgencyPayload): Promise<Agency> => {
  const response = await axiosClient.post<ApiResponse<Agency>>('/user/register', payload);
  if (!response.data.status) {
    throw new Error(response.data.message || 'Failed to create agency.');
  }
  return response.data.data;
};

/**
 * Tops up resources for an existing agency.
 */
export const topUpAgency = async (payload: TopUpAgencyPayload): Promise<Agency> => {
  const response = await axiosClient.put<ApiResponse<Agency>>(`/user/update`, payload);
  if (!response.data.status) {
    throw new Error(response.data.message || 'Failed to top up resources.');
  }
  return response.data.data;
};