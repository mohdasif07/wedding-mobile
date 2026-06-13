import apiClient from './client';
import { Guest } from '../types';

export const guestsApi = {
  list: (
    eventId: number,
    params?: { q?: string; rsvp_status?: string; side?: string; page?: number }
  ) => apiClient.get<Guest[]>(`/events/${eventId}/guests`, { params }),

  get: (eventId: number, id: number) =>
    apiClient.get<Guest>(`/events/${eventId}/guests/${id}`),

  create: (eventId: number, payload: Partial<Guest>) =>
    apiClient.post<Guest>(`/events/${eventId}/guests`, payload),

  update: (eventId: number, id: number, payload: Partial<Guest>) =>
    apiClient.put<Guest>(`/events/${eventId}/guests/${id}`, payload),

  remove: (eventId: number, id: number) =>
    apiClient.delete(`/events/${eventId}/guests/${id}`),

  updateRsvp: (eventId: number, guestId: number, status: string) =>
    apiClient.patch(`/events/${eventId}/rsvp/${guestId}`, { status }),
};
