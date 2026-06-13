import { AxiosError } from 'axios';
import { API_BASE_URL } from './constants';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return `Cannot reach server at ${API_BASE_URL}. Is rails server running? Phone and PC must be on same Wi-Fi.`;
    }
    if (error.response.status === 401) {
      return 'Invalid email or password.';
    }
    const data = error.response.data as { errors?: string[]; error?: string };
    if (data?.errors?.length) return data.errors.join(', ');
    if (data?.error) return data.error;
    return `Server error (${error.response.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
