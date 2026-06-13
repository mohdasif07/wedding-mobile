import apiClient from './client';
import { Attendance } from '../types';

export const attendanceApi = {
  checkIn: (eventId: number, qrCodeToken: string) =>
    apiClient.post('/attendances/check_in', {
      event_id: eventId,
      qr_code_token: qrCodeToken,
    }),

  list: (eventId: number) =>
    apiClient.get<Attendance[]>(`/events/${eventId}/attendances`),
};
