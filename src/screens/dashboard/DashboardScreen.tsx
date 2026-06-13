import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { StatCard } from '../../components/StatCard';
import { LoadingView } from '../../components/LoadingView';
import { GradientHero } from '../../components/ui/GradientHero';
import { AppCard } from '../../components/ui/AppCard';
import { formatCurrency, countdownLabel, formatDate } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';
import { registerForPushNotifications } from '../../services/notifications';
import { DashboardStackParamList } from '../../navigation/types';

const QUICK_ACTIONS = [
  { key: 'Checklist', label: 'Checklist', icon: 'checkbox-marked-outline', colorIndex: 0 },
  { key: 'Timeline', label: 'Timeline', icon: 'timeline-clock-outline', colorIndex: 1 },
  { key: 'Profile', label: 'Profile', icon: 'account-circle-outline', colorIndex: 2 },
] as const;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const { user, role } = useAuth();
  const { data, isLoading } = useDashboard();

  useEffect(() => {
    registerForPushNotifications().catch(() => undefined);
  }, []);

  if (isLoading || !data) return <LoadingView />;

  const nextEvent = data.upcoming_events[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerStrip}
      >
        <Text style={styles.greeting}>Hello, {user?.first_name} 👋</Text>
        <Text style={styles.headline}>Perfect Weddings, Personalized</Text>
        {role ? (
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {role === 'admin' ? 'Admin' : 'Family'} account
            </Text>
          </View>
        ) : null}
      </LinearGradient>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((action) => {
          const palette = getPalette(action.colorIndex);
          return (
            <TouchableOpacity
              key={action.key}
              style={[styles.quickCard, { backgroundColor: palette.light }]}
              onPress={() => navigation.navigate(action.key)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name={action.icon} size={26} color={palette.main} />
              <Text style={[styles.quickLabel, { color: palette.dark }]}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {nextEvent ? (
        <View style={styles.heroWrap}>
        <GradientHero
          label="Next Event"
          title={nextEvent.title}
          subtitle={`${formatDate(nextEvent.event_date)} · ${nextEvent.venue}`}
          highlight={countdownLabel(nextEvent.event_date)}
        />
        </View>
      ) : null}

      <View style={styles.grid}>
        <StatCard title="Total Guests" value={data.total_guests} subtitle={`${data.confirmed_guests} confirmed`} icon="account-group" colorIndex={0} />
        <StatCard title="Total Events" value={data.total_events} icon="calendar-heart" colorIndex={1} />
        <StatCard title="Total Expenses" value={formatCurrency(data.budget_used)} subtitle={`Est. ${formatCurrency(data.estimated_budget)}`} icon="cash" colorIndex={2} />
        <StatCard title="Pending RSVPs" value={data.pending_guests} icon="email-outline" colorIndex={3} />
      </View>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <View style={styles.eventsList}>
      {data.upcoming_events.map((event, index) => {
        const palette = getPalette(index);
        return (
          <AppCard key={event.id} colorIndex={index}>
            <View style={styles.eventRow}>
              <View style={[styles.eventIcon, { backgroundColor: palette.light }]}>
                <MaterialCommunityIcons name="calendar-star" size={22} color={palette.main} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{formatDate(event.event_date)} · {event.venue}</Text>
                <Text style={[styles.eventCountdown, { color: palette.main }]}>
                  {countdownLabel(event.event_date)}
                </Text>
              </View>
            </View>
          </AppCard>
        );
      })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 32 },
  headerStrip: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    marginBottom: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headline: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 34,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  roleBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.white,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
  },
  quickLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  heroWrap: { paddingHorizontal: 20 },
  sectionTitle: {
    fontFamily: FONTS.headingMedium,
    fontSize: 20,
    marginTop: 8,
    marginBottom: 14,
    marginHorizontal: 20,
    color: COLORS.text,
  },
  eventsList: { paddingHorizontal: 20 },
  eventRow: { flexDirection: 'row', alignItems: 'flex-start' },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  eventInfo: { flex: 1 },
  eventTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.text,
  },
  eventMeta: {
    fontFamily: FONTS.body,
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 13,
  },
  eventCountdown: {
    fontFamily: FONTS.bodyBold,
    marginTop: 6,
    fontSize: 14,
  },
});
