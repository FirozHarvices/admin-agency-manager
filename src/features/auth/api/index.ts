import axiosClient from '../../../api/axiosClient';
import { LoginCredentials, LoginResponse } from '../types'; // Assuming types are defined

export const loginWithPasswordApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/user/adminLogin', credentials);
  if (!response.data || response.data.status === false) {
    throw new Error(response.data.message || 'Login failed. Please check your credentials.');
  }
  return response.data;
};