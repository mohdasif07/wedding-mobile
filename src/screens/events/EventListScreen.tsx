import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { SearchBar } from '../../components/SearchBar';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { FilterChip } from '../../components/ui/FilterChip';
import { AppCard } from '../../components/ui/AppCard';
import { formatDate } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';
import { EventsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventList'>;

const STATUS_LABELS: Record<string, string> = {
  '': 'All',
  planned: 'Planned',
  confirmed: 'Confirmed',
  completed: 'Completed',
};

const FILTERS = ['', 'planned', 'confirmed', 'completed'];

export const EventListScreen: React.FC<Props> = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading, fetchNextPage, hasNextPage, refetch, isRefetching } = useEvents(search, status);

  const events = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headline}>Your Wedding Events</Text>
      </LinearGradient>

      <View style={styles.body}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search events..." />

        <View style={styles.filters}>
          {FILTERS.map((s, i) => (
            <FilterChip
              key={s || 'all'}
              label={STATUS_LABELS[s] ?? s}
              selected={status === s}
              onPress={() => setStatus(s)}
              colorIndex={i}
            />
          ))}
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No events found"
              actionLabel={isAdmin ? 'Create Event' : undefined}
              onAction={isAdmin ? () => navigation.navigate('EventForm', {}) : undefined}
            />
          }
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.cardIcon, { backgroundColor: palette.light }]}>
                    <MaterialCommunityIcons name="map-marker-radius" size={24} color={palette.main} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.meta}>{formatDate(item.event_date)} · {item.venue}</Text>
                    <View style={styles.badges}>
                      <View style={[styles.badge, { backgroundColor: palette.light }]}>
                        <MaterialCommunityIcons name="account" size={14} color={palette.main} />
                        <Text style={[styles.badgeText, { color: palette.dark }]}>
                          {item.guests_count ?? 0} guests
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: getPalette(index + 2).light }]}>
                        <Text style={[styles.statusText, { color: getPalette(index + 2).dark }]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={palette.main} />
                </View>
              </AppCard>
            );
          }}
        />
      </View>

      {isAdmin ? (
        <FAB icon="plus" style={styles.fab} color={COLORS.white} onPress={() => navigation.navigate('EventForm', {})} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headline: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: '#FFFFFF',
  },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  list: { paddingBottom: 80 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.text,
  },
  meta: {
    fontFamily: FONTS.body,
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 13,
  },
  badges: { flexDirection: 'row', marginTop: 10, gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
  },
  statusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
});
