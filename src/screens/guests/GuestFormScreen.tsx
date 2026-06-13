import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SegmentedButtons, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGuest, useGuestMutations } from '../../hooks/useGuests';
import { LoadingView } from '../../components/LoadingView';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { EventsStackParamList } from '../../navigation/types';
import { sharedStyles } from '../../theme/sharedStyles';

type Props = NativeStackScreenProps<EventsStackParamList, 'GuestForm'>;

export const GuestFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId, guestId } = route.params;
  const { data: guest, isLoading } = useGuest(eventId, guestId ?? 0);
  const { create, update } = useGuestMutations(eventId);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    family_name: '',
    side: 'bride',
    address: '',
  });

  useEffect(() => {
    if (guest) {
      setForm({
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email || '',
        phone: guest.phone || '',
        family_name: guest.family_name || '',
        side: guest.side,
        address: guest.address || '',
      });
    }
  }, [guest]);

  if (guestId && isLoading) return <LoadingView />;

  const handleSubmit = async () => {
    if (guestId) {
      await update.mutateAsync({ id: guestId, ...form });
    } else {
      await create.mutateAsync(form);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader
        title={guestId ? 'Edit Guest' : 'Add Guest'}
        subtitle="Fill in guest details below"
      />
        <TextInput label="First Name" value={form.first_name} onChangeText={(v) => setForm({ ...form, first_name: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Last Name" value={form.last_name} onChangeText={(v) => setForm({ ...form, last_name: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Email" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <TextInput label="Family Name" value={form.family_name} onChangeText={(v) => setForm({ ...form, family_name: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <SegmentedButtons
          value={form.side}
          onValueChange={(v) => setForm({ ...form, side: v })}
          buttons={[
            { value: 'bride', label: 'Bride' },
            { value: 'groom', label: 'Groom' },
          ]}
          style={sharedStyles.input}
        />
        <TextInput label="Address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} mode="outlined" multiline style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
        <PrimaryButton onPress={handleSubmit} loading={create.isPending || update.isPending}>
          {guestId ? 'Update Guest' : 'Add Guest'}
        </PrimaryButton>
    </ScrollView>
  );
};
