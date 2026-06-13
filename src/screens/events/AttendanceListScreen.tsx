import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAttendance } from '../../hooks/useAttendance';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatDate } from '../../utils/formatters';
import { COLORS, FONTS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { EventsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<EventsStackParamList, 'AttendanceList'>;

export const AttendanceListScreen: React.FC<Props> = ({ route }) => {
  const { eventId, eventTitle } = route.params;
  const { data, isLoading } = useAttendance(eventId);

  if (isLoading) return <LoadingView />;

  const attendances = data ?? [];

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader
        title="Check-in List"
        subtitle={`${eventTitle} · ${attendances.length} arrived`}
      />
      <FlatList
        data={attendances}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No guests checked in yet</Text>}
        renderItem={({ item, index }) => (
          <AppCard colorIndex={index}>
            <Text style={styles.name}>{item.guest?.full_name ?? `Guest #${item.guest_id}`}</Text>
            <Text style={styles.time}>
              Checked in {formatDate(item.checked_in_at)}
            </Text>
          </AppCard>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 32 },
  name: { fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.text },
  time: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginTop: 4 },
  empty: {
    fontFamily: FONTS.body,
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 40,
  },
});
