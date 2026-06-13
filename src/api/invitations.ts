import apiClient from './client';
import { Guest } from '../types';

export const invitationsApi = {
  send: (eventId: number, guestId: number, channel: 'email' | 'whatsapp' = 'email') =>
    apiClient.post<{ message: string; guest: Guest }>(
      `/events/${eventId}/guests/${guestId}/invite`,
      { channel }
    ),

  bulkSend: (eventId: number, guestIds?: number[], channel: 'email' | 'whatsapp' = 'email') =>
    apiClient.post<{ sent: number; failed: number; errors: string[] }>(
      `/events/${eventId}/guests/bulk_invite`,
      { guest_ids: guestIds, channel }
    ),
};
