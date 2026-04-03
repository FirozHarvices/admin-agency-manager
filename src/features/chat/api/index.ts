import axiosClient from '@/api/axiosClient';
import { ChatHistoryResponse } from '../types';

export const chatApi = {
  getHistory(ticketId: number): Promise<{ data: ChatHistoryResponse }> {
    return axiosClient.get(`/chat/history/${ticketId}`);
  },
};
