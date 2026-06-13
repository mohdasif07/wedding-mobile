import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBulkInvite } from '../../hooks/useInvitations';
import { useGuests } from '../../hooks/useGuests';
import { SearchBar } from '../../components/SearchBar';
import { LoadingView } from '../../components/LoadingView';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { FilterChip } from '../../components/ui/FilterChip';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { getApiErrorMessage } from '../../utils/apiError';
import { titleCase } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { EventsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<EventsStackParamList, 'GuestList'>;

const RSVP_FILTERS = ['', 'pending', 'accepted', 'declined'];
const SIDE_FILTERS = ['', 'bride', 'groom'];

export const GuestListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId, eventTitle } = route.params;
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [rsvp, setRsvp] = useState('');
  const [side, setSide] = useState('');
  const bulkInvite = useBulkInvite(eventId);
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useGuests(eventId, {
    q: search,
    rsvp_status: rsvp,
    side,
  });

  const guests = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const handleBulkInvite = () => {
    Alert.alert(
      'Invite All Guests',
      `Send email invitations to all guests for ${eventTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const result = await bulkInvite.mutateAsync(undefined);
              Alert.alert(
                'Invitations Sent',
                `Sent: ${result.sent}\nFailed: ${result.failed}${result.errors?.length ? `\n\n${result.errors.slice(0, 3).join('\n')}` : ''}`
              );
              refetch();
            } catch (err) {
              Alert.alert('Failed', getApiErrorMessage(err));
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Guests" subtitle={eventTitle} />
      <View style={sharedStyles.body}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search guests..." />
        {isAdmin ? (
          <PrimaryButton onPress={handleBulkInvite} loading={bulkInvite.isPending}>
            Invite All Guests (Email)
          </PrimaryButton>
        ) : null}
        <View style={styles.filters}>
          {RSVP_FILTERS.map((s, i) => (
            <FilterChip
              key={s || 'all'}
              label={s ? titleCase(s) : 'All RSVP'}
              selected={rsvp === s}
              onPress={() => setRsvp(s)}
              colorIndex={i}
            />
          ))}
        </View>
        <View style={styles.filters}>
          {SIDE_FILTERS.map((s, i) => (
            <FilterChip
              key={s || 'all-side'}
              label={s ? titleCase(s) : 'All Sides'}
              selected={side === s}
              onPress={() => setSide(s)}
              colorIndex={i + 2}
            />
          ))}
        </View>

        <FlatList
          data={guests}
          keyExtractor={(item) => String(item.id)}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('GuestDetails', { eventId, guestId: item.id })}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.avatar, { backgroundColor: palette.light }]}>
                    <Text style={[styles.avatarText, { color: palette.main }]}>
                      {item.first_name?.[0]}{item.last_name?.[0]}
                    </Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.name}>{item.full_name}</Text>
                    <Text style={styles.meta}>
                      {titleCase(item.side)} · {titleCase(item.rsvp_status)}
                      {item.invited_at ? ' · Invited' : ''}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={palette.main} />
                </View>
              </AppCard>
            );
          }}
        />
      </View>

      {isAdmin ? (
        <FAB
          icon="plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Events }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('GuestForm', { eventId })}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  list: { paddingBottom: 80 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontFamily: FONTS.bodyBold, fontSize: 16 },
  cardContent: { flex: 1 },
  name: { fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.text },
  meta: { fontFamily: FONTS.body, color: COLORS.muted, marginTop: 4, fontSize: 13 },
});
