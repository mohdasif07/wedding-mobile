import React, { useMemo, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Checkbox, Menu, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { useGuests } from '../../hooks/useGuests';
import { useSendMessage } from '../../hooks/useMessages';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { getApiErrorMessage } from '../../utils/apiError';
import { COLORS } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ComposeMessage'>;

export const ComposeMessageScreen: React.FC<Props> = ({ navigation }) => {
  const sendMessage = useSendMessage();
  const { data: eventsData } = useEvents();
  const events = useMemo(() => eventsData?.pages.flatMap((p) => p.items) ?? [], [eventsData]);

  const [eventId, setEventId] = useState<number | undefined>();
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);
  const [error, setError] = useState('');

  const { data: guestsData } = useGuests(eventId ?? 0);
  const guests = useMemo(() => guestsData?.pages.flatMap((p) => p.items) ?? [], [guestsData]);

  const selectedEvent = events.find((e) => e.id === eventId);

  const toggleGuest = (id: number) => {
    setSelectedGuestIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedGuestIds(guests.map((g) => g.id));

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and message are required.');
      return;
    }
    if (selectedGuestIds.length === 0) {
      setError('Select at least one guest.');
      return;
    }

    setError('');
    try {
      await sendMessage.mutateAsync({
        subject,
        body,
        guest_ids: selectedGuestIds,
        event_id: eventId,
        message_type: 'announcement',
        channel: 'email',
      });
      navigation.goBack();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader title="Send Message" subtitle="Announce to your guests" />

      <Menu
        visible={eventMenuOpen}
        onDismiss={() => setEventMenuOpen(false)}
        anchor={
          <PrimaryButton mode="outlined" onPress={() => setEventMenuOpen(true)}>
            Event: {selectedEvent?.title ?? 'Select event (optional)'}
          </PrimaryButton>
        }
      >
        {events.map((event) => (
          <Menu.Item
            key={event.id}
            title={event.title}
            onPress={() => {
              setEventId(event.id);
              setSelectedGuestIds([]);
              setEventMenuOpen(false);
            }}
          />
        ))}
      </Menu>

      <TextInput label="Subject" value={subject} onChangeText={setSubject} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput
        label="Message"
        value={body}
        onChangeText={setBody}
        mode="outlined"
        multiline
        numberOfLines={5}
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />

      {eventId ? (
        <AppCard colorIndex={1}>
          <PrimaryButton mode="text" onPress={selectAll}>Select all guests</PrimaryButton>
          {guests.map((guest) => (
            <Checkbox.Item
              key={guest.id}
              label={guest.full_name}
              status={selectedGuestIds.includes(guest.id) ? 'checked' : 'unchecked'}
              onPress={() => toggleGuest(guest.id)}
              color={COLORS.primary}
            />
          ))}
        </AppCard>
      ) : (
        <Text style={sharedStyles.hint}>Select an event to choose guests</Text>
      )}

      {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

      <PrimaryButton onPress={handleSend} loading={sendMessage.isPending}>
        Send Message
      </PrimaryButton>
    </ScrollView>
  );
};
