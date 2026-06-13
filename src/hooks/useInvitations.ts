import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations';

export const useSendInvite = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guestId, channel }: { guestId: number; channel?: 'email' | 'whatsapp' }) =>
      invitationsApi.send(eventId, guestId, channel).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useBulkInvite = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guestIds?: number[]) =>
      invitationsApi.bulkSend(eventId, guestIds).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
