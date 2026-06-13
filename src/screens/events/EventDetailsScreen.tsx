import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvent } from '../../hooks/useEvents';
import { usePhotos } from '../../hooks/usePhotos';
import { LoadingView } from '../../components/LoadingView';
import { GradientHero } from '../../components/ui/GradientHero';
import { AppCard } from '../../components/ui/AppCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { formatDate, formatTime, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { EventsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetails'>;

export const EventDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { isAdmin } = useAuth();
  const { data: event, isLoading } = useEvent(eventId);
  const { data: photosData } = usePhotos({ event_id: eventId });
  const photos = useMemo(() => photosData?.pages.flatMap((p) => p.items).slice(0, 6) ?? [], [photosData]);

  if (isLoading || !event) return <LoadingView />;

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <GradientHero
        label={titleCase(event.status)}
        title={event.title}
        subtitle={`${formatDate(event.event_date)} · ${event.venue || 'TBD'}`}
        highlight={`${event.guests_count ?? 0} guests`}
      />

      <AppCard colorIndex={0}>
        <Text style={sharedStyles.sectionTitle}>Event Details</Text>
        <InfoRow icon="map-marker-radius" label="Venue" value={event.venue || 'TBD'} color={getPalette(0).main} />
        <InfoRow icon="calendar" label="Date" value={formatDate(event.event_date)} color={getPalette(1).main} />
        <InfoRow
          icon="clock-outline"
          label="Time"
          value={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
          color={getPalette(2).main}
        />
        {event.description ? (
          <InfoRow icon="text" label="Description" value={event.description} color={getPalette(3).main} />
        ) : null}
      </AppCard>

      {photos.length > 0 ? (
        <AppCard colorIndex={1}>
          <Text style={sharedStyles.sectionTitle}>Event Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
            {photos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                onPress={() =>
                  navigation.navigate('PhotoViewer', {
                    url: photo.image_url ?? photo.thumbnail_url ?? '',
                    caption: photo.caption,
                  })
                }
              >
                <Image
                  source={{ uri: photo.thumbnail_url ?? photo.image_url }}
                  style={styles.thumb}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AppCard>
      ) : null}

      <PrimaryButton onPress={() => navigation.navigate('GuestList', { eventId, eventTitle: event.title })}>
        View Guests ({event.guests_count ?? 0})
      </PrimaryButton>

      <View style={styles.gap} />
      <PrimaryButton mode="outlined" onPress={() => navigation.navigate('AttendanceList', { eventId, eventTitle: event.title })}>
        Check-in List
      </PrimaryButton>

      {isAdmin ? (
        <View style={styles.adminActions}>
          <PrimaryButton onPress={() => navigation.navigate('EventForm', { eventId })}>
            Edit Event
          </PrimaryButton>
          <View style={styles.gap} />
          <PrimaryButton mode="outlined" onPress={() => navigation.navigate('QrScanner', { eventId })}>
            Scan QR Check-in
          </PrimaryButton>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adminActions: { marginTop: 12 },
  gap: { height: 10 },
  photoRow: { gap: 10, paddingVertical: 4 },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
  },
});
