import axiosClient from '../../../api/axiosClient';
import {
  TicketsListResponse,
  TicketDetailResponse,
  UpdateTicketPayload,
} from '../types';

export const ticketApi = {
  getAll(): Promise<{ data: TicketsListResponse }> {
    return axiosClient.get('/ticket-mst/all');
  },

  getById(id: number): Promise<{ data: TicketDetailResponse }> {
    return axiosClient.get(`/ticket-mst/${id}`);
  },

  update(
    id: number,
    payload: UpdateTicketPayload
  ): Promise<{ data: TicketDetailResponse }> {
    return axiosClient.put(`/ticket-mst/${id}`, payload);
  },
};
