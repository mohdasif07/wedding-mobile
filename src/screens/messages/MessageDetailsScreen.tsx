import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMessage } from '../../hooks/useMessages';
import { LoadingView } from '../../components/LoadingView';
import { GradientHero } from '../../components/ui/GradientHero';
import { AppCard } from '../../components/ui/AppCard';
import { formatDate, titleCase } from '../../utils/formatters';
import { COLORS, FONTS } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessageDetails'>;

export const MessageDetailsScreen: React.FC<Props> = ({ route }) => {
  const { messageId } = route.params;
  const { data: message, isLoading } = useMessage(messageId);

  if (isLoading || !message) return <LoadingView />;

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <GradientHero
        label={titleCase(message.message_type)}
        title={message.subject}
        subtitle={`${message.sent_count ?? 0} sent · ${formatDate(message.created_at)}`}
      />

      <AppCard colorIndex={2}>
        <Text style={sharedStyles.sectionTitle}>Message</Text>
        <Text style={styles.body}>{message.body}</Text>
      </AppCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSoft,
    lineHeight: 24,
  },
});
