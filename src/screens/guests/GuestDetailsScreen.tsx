import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvent } from '../../hooks/useEvents';
import { useGuest, useGuestMutations } from '../../hooks/useGuests';
import { useSendInvite } from '../../hooks/useInvitations';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { FilterChip } from '../../components/ui/FilterChip';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { InfoRow } from '../../components/ui/InfoRow';
import { formatDate, titleCase } from '../../utils/formatters';
import { buildInviteText, shareWhatsAppMessage } from '../../utils/whatsapp';
import { getApiErrorMessage } from '../../utils/apiError';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { EventsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<EventsStackParamList, 'GuestDetails'>;

export const GuestDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId, guestId } = route.params;
  const { isAdmin } = useAuth();
  const { data: guest, isLoading } = useGuest(eventId, guestId);
  const { data: event } = useEvent(eventId);
  const { updateRsvp } = useGuestMutations(eventId);
  const sendInvite = useSendInvite(eventId);
  const [snack, setSnack] = useState('');

  if (isLoading || !guest) return <LoadingView />;

  const palette = getPalette(guestId);
  const inviteText = buildInviteText(
    guest.full_name,
    event?.title ?? 'Wedding Event',
    event ? formatDate(event.event_date) : '',
    event?.venue ?? '',
    guest.qr_code_token
  );

  const handleEmailInvite = async () => {
    if (!guest.email) {
      Alert.alert('No email', 'Please add guest email first.');
      return;
    }
    try {
      const result = await sendInvite.mutateAsync({ guestId, channel: 'email' });
      setSnack(result.message || 'Invitation sent via email!');
    } catch (err) {
      Alert.alert('Failed', getApiErrorMessage(err));
    }
  };

  const handleWhatsAppInvite = async () => {
    try {
      await shareWhatsAppMessage(guest.phone, inviteText);
      await sendInvite.mutateAsync({ guestId, channel: 'whatsapp' });
      setSnack('WhatsApp invitation opened!');
    } catch (err) {
      Alert.alert('Failed', getApiErrorMessage(err));
    }
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <LinearGradient
        colors={[...palette.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {guest.first_name?.[0]}{guest.last_name?.[0]}
          </Text>
        </View>
        <Text style={styles.heroTitle}>{guest.full_name}</Text>
        <Text style={styles.heroMeta}>
          {titleCase(guest.side)} · {titleCase(guest.rsvp_status)}
          {guest.invited_at ? ` · Invited ${guest.invite_count ?? 1}x` : ''}
        </Text>
      </LinearGradient>

      <AppCard colorIndex={0}>
        <Text style={sharedStyles.sectionTitle}>Contact Info</Text>
        <InfoRow icon="email-outline" label="Email" value={guest.email || 'N/A'} color={getPalette(0).main} />
        <InfoRow icon="phone-outline" label="Phone" value={guest.phone || 'N/A'} color={getPalette(1).main} />
        <InfoRow icon="account-group-outline" label="Family" value={guest.family_name || 'N/A'} color={getPalette(2).main} />
        <InfoRow icon="map-marker-outline" label="Address" value={guest.address || 'N/A'} color={getPalette(3).main} />
      </AppCard>

      {isAdmin ? (
        <AppCard colorIndex={1}>
          <Text style={sharedStyles.sectionTitle}>Send Invitation</Text>
          <PrimaryButton onPress={handleEmailInvite} loading={sendInvite.isPending}>
            Send Email Invite
          </PrimaryButton>
          <View style={styles.btnGap} />
          <PrimaryButton mode="outlined" onPress={handleWhatsAppInvite}>
            Send WhatsApp Invite
          </PrimaryButton>
        </AppCard>
      ) : null}

      <AppCard colorIndex={4}>
        <Text style={[sharedStyles.sectionTitle, styles.qrTitle]}>QR Invitation</Text>
        <View style={styles.qrWrapper}>
          <QRCode value={guest.qr_code_token} size={180} />
        </View>
      </AppCard>

      <Text style={sharedStyles.sectionTitle}>Update RSVP</Text>
      <View style={styles.rsvpRow}>
        {['accepted', 'declined', 'maybe'].map((status, i) => (
          <FilterChip
            key={status}
            label={titleCase(status)}
            selected={guest.rsvp_status === status}
            onPress={() => updateRsvp.mutate({ guestId, status })}
            colorIndex={i}
          />
        ))}
      </View>

      {isAdmin ? (
        <PrimaryButton onPress={() => navigation.navigate('GuestForm', { eventId, guestId })}>
          Edit Guest
        </PrimaryButton>
      ) : null}

      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={3000}>
        {snack}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    borderRadius: RADIUS.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontFamily: FONTS.heading, fontSize: 28, color: COLORS.primary },
  heroTitle: { fontFamily: FONTS.heading, fontSize: 24, color: COLORS.white, textAlign: 'center' },
  heroMeta: { fontFamily: FONTS.body, color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: 'center' },
  qrTitle: { textAlign: 'center' },
  qrWrapper: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignSelf: 'center',
  },
  rsvpRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  btnGap: { height: 10 },
});
