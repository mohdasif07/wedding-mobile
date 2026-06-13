import apiClient from './client';
import { Message } from '../types';

export const messagesApi = {
  list: (params?: { event_id?: number; page?: number }) =>
    apiClient.get<Message[]>('/messages', { params }),

  get: (id: number) => apiClient.get<Message>(`/messages/${id}`),

  send: (payload: {
    subject: string;
    body: string;
    guest_ids: number[];
    event_id?: number;
    message_type?: string;
    channel?: string;
  }) => apiClient.post('/messages', payload),
};
