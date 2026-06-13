import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMessages } from '../../hooks/useMessages';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatDate, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, RADIUS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { MessagesStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessageList'>;

export const MessageListScreen: React.FC<Props> = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage } = useMessages();
  const messages = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Messages" subtitle="Invitations & announcements" />
      <View style={sharedStyles.body}>
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No messages yet"
              description="Send invitations or announcements to your guests"
              actionLabel={isAdmin ? 'Compose Message' : undefined}
              onAction={isAdmin ? () => navigation.navigate('ComposeMessage', {}) : undefined}
            />
          }
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('MessageDetails', { messageId: item.id })}
              >
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: palette.light }]}>
                    <MaterialCommunityIcons name="email-outline" size={20} color={palette.main} />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.subject}>{item.subject}</Text>
                    <Text style={styles.meta}>
                      {titleCase(item.message_type)} · {item.sent_count ?? 0}/{item.recipients_count ?? 0} sent
                    </Text>
                    <Text style={[styles.date, { color: palette.main }]}>{formatDate(item.created_at)}</Text>
                  </View>
                </View>
              </AppCard>
            );
          }}
        />
      </View>
      {isAdmin ? (
        <FAB
          icon="email-plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Messages }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('ComposeMessage', {})}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 80 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  subject: {
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
  date: {
    fontFamily: FONTS.bodyMedium,
    marginTop: 4,
    fontSize: 12,
  },
});
