import apiClient from './client';
import { Event } from '../types';

export const eventsApi = {
  list: (params?: { q?: string; status?: string; page?: number; per_page?: number }) =>
    apiClient.get<Event[]>('/events', { params }),

  get: (id: number) => apiClient.get<Event>(`/events/${id}`),

  create: (payload: Partial<Event>) => apiClient.post<Event>('/events', payload),

  update: (id: number, payload: Partial<Event>) =>
    apiClient.put<Event>(`/events/${id}`, payload),

  remove: (id: number) => apiClient.delete(`/events/${id}`),
};
