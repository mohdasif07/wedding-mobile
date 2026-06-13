import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvent, useEventMutations } from '../../hooks/useEvents';
import { LoadingView } from '../../components/LoadingView';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { EventsStackParamList } from '../../navigation/types';
import { sharedStyles } from '../../theme/sharedStyles';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventForm'>;

export const EventFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const eventId = route.params?.eventId;
  const { data: event, isLoading } = useEvent(eventId ?? 0);
  const { create, update } = useEventMutations();
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    event_date: '',
    start_time: '',
    end_time: '',
    status: 'planned',
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description || '',
        venue: event.venue || '',
        event_date: event.event_date,
        start_time: event.start_time?.slice(0, 5) || '',
        end_time: event.end_time?.slice(0, 5) || '',
        status: event.status,
      });
    }
  }, [event]);

  if (eventId && isLoading) return <LoadingView />;

  const handleSubmit = async () => {
    if (eventId) {
      await update.mutateAsync({ id: eventId, ...form });
    } else {
      await create.mutateAsync(form);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader
        title={eventId ? 'Edit Event' : 'Create Event'}
        subtitle="Plan your celebration"
      />
        <TextInput label="Title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Venue" value={form.venue} onChangeText={(v) => setForm({ ...form, venue: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Date (YYYY-MM-DD)" value={form.event_date} onChangeText={(v) => setForm({ ...form, event_date: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Start Time" value={form.start_time} onChangeText={(v) => setForm({ ...form, start_time: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="End Time" value={form.end_time} onChangeText={(v) => setForm({ ...form, end_time: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} mode="outlined" multiline style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <PrimaryButton onPress={handleSubmit} loading={create.isPending || update.isPending}>
          {eventId ? 'Update Event' : 'Create Event'}
        </PrimaryButton>
    </ScrollView>
  );
};
