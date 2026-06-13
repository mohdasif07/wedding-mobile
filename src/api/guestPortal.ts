import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { Event, Guest } from '../types';

const publicClient = axios.create({
  baseURL: API_BASE_URL.replace('/api/v1', '/api/v1/public'),
  timeout: 15000,
});

export const guestPortalApi = {
  getByToken: (token: string) =>
    publicClient.get<{ guest: Guest; event: Event }>(`/guest/${token}`),

  updateRsvp: (token: string, status: string) =>
    publicClient.patch<Guest>(`/guest/${token}/rsvp`, { status }),
};
