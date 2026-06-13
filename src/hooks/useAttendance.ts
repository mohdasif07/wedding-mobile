import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance';

export const useAttendance = (eventId: number) =>
  useQuery({
    queryKey: ['attendances', eventId],
    queryFn: async () => {
      const { data } = await attendanceApi.list(eventId);
      return data;
    },
    enabled: !!eventId,
  });
