import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestPortalApi } from '../../api/guestPortal';
import { LoadingView } from '../../components/LoadingView';
import { FilterChip } from '../../components/ui/FilterChip';
import { GradientHero } from '../../components/ui/GradientHero';
import { formatDate, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'GuestRsvp'>;

export const GuestRsvpScreen: React.FC<Props> = ({ route }) => {
  const { token } = route.params;
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['guest-portal', token],
    queryFn: async () => {
      const { data: res } = await guestPortalApi.getByToken(token);
      return res;
    },
  });

  const updateRsvp = useMutation({
    mutationFn: (status: string) => guestPortalApi.updateRsvp(token, status),
    onSuccess: () => {
      setMessage('Thank you! Your RSVP has been recorded.');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['guest-portal', token] });
    },
    onError: () => setMessage('Could not update RSVP. Please try again.'),
  });

  if (isLoading || !data) return <LoadingView message="Loading invitation..." />;

  const { guest, event } = data;

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        style={styles.hero}
      >
        <Text style={styles.invite}>You're Invited!</Text>
        <Text style={styles.guestName}>{guest.full_name}</Text>
      </LinearGradient>

      <GradientHero
        label="Wedding Event"
        title={event.title}
        subtitle={`${formatDate(event.event_date)} · ${event.venue || 'TBD'}`}
        highlight={titleCase(guest.rsvp_status)}
      />

      <Text style={sharedStyles.sectionTitle}>Please RSVP</Text>
      <View style={styles.rsvpRow}>
        {['accepted', 'declined', 'maybe'].map((status, i) => (
          <FilterChip
            key={status}
            label={titleCase(status)}
            selected={guest.rsvp_status === status}
            onPress={() => updateRsvp.mutate(status)}
            colorIndex={i}
          />
        ))}
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    borderRadius: RADIUS.xl,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  invite: {
    fontFamily: FONTS.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  guestName: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.white,
    marginTop: 8,
    textAlign: 'center',
  },
  rsvpRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  message: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.success,
    textAlign: 'center',
    marginTop: 8,
  },
});
