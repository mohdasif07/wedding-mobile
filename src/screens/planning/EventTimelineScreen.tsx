import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { LoadingView } from '../../components/LoadingView';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatDate, formatTime, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { DashboardStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Timeline'>;

export const EventTimelineScreen: React.FC<Props> = () => {
  const { data, isLoading } = useEvents();
  const events = useMemo(
    () =>
      [...(data?.pages.flatMap((p) => p.items) ?? [])].sort(
        (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ),
    [data]
  );

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Wedding Timeline" subtitle="Your celebration schedule" />
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const palette = getPalette(index);
          const isLast = index === events.length - 1;
          return (
            <View style={styles.row}>
              <View style={styles.lineCol}>
                <View style={[styles.dot, { backgroundColor: palette.main }]} />
                {!isLast ? <View style={[styles.line, { backgroundColor: palette.light }]} /> : null}
              </View>
              <View style={[styles.card, { borderColor: palette.light }]}>
                <Text style={[styles.date, { color: palette.main }]}>{formatDate(item.event_date)}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.muted} />
                  <Text style={styles.meta}>{item.venue || 'TBD'}</Text>
                </View>
                {item.start_time ? (
                  <Text style={styles.time}>
                    {formatTime(item.start_time)}
                    {item.end_time ? ` – ${formatTime(item.end_time)}` : ''}
                  </Text>
                ) : null}
                <View style={[styles.badge, { backgroundColor: palette.light }]}>
                  <Text style={[styles.badgeText, { color: palette.dark }]}>{titleCase(item.status)}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 32 },
  row: { flexDirection: 'row', marginBottom: 8 },
  lineCol: { width: 24, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 6 },
  line: { width: 3, flex: 1, minHeight: 80, marginTop: 4, borderRadius: 2 },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginLeft: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  date: { fontFamily: FONTS.bodyBold, fontSize: 13 },
  title: { fontFamily: FONTS.headingMedium, fontSize: 18, color: COLORS.text, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  meta: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted },
  time: { fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.textSoft, marginTop: 4 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 10,
  },
  badgeText: { fontFamily: FONTS.bodyMedium, fontSize: 12 },
});
