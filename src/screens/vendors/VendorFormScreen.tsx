import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useVendor, useVendorMutations } from '../../hooks/useVendors';
import { LoadingView } from '../../components/LoadingView';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { VendorsStackParamList } from '../../navigation/types';
import { sharedStyles } from '../../theme/sharedStyles';

type Props = NativeStackScreenProps<VendorsStackParamList, 'VendorForm'>;

export const VendorFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const vendorId = route.params?.vendorId;
  const { data: vendor, isLoading } = useVendor(vendorId ?? 0);
  const { create, update } = useVendorMutations();
  const [form, setForm] = useState({
    vendor_name: '',
    vendor_type: 'photographer',
    contact_person: '',
    phone: '',
    email: '',
    contract_amount: '0',
    paid_amount: '0',
    notes: '',
  });

  useEffect(() => {
    if (vendor) {
      setForm({
        vendor_name: vendor.vendor_name,
        vendor_type: vendor.vendor_type,
        contact_person: vendor.contact_person || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        contract_amount: String(vendor.contract_amount),
        paid_amount: String(vendor.paid_amount),
        notes: vendor.notes || '',
      });
    }
  }, [vendor]);

  if (vendorId && isLoading) return <LoadingView />;

  const handleSubmit = async () => {
    const payload = {
      ...form,
      contract_amount: Number(form.contract_amount),
      paid_amount: Number(form.paid_amount),
    };
    if (vendorId) {
      await update.mutateAsync({ id: vendorId, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader
        title={vendorId ? 'Edit Vendor' : 'Add Vendor'}
        subtitle="Vendor details and payments"
      />
      <TextInput label="Vendor Name" value={form.vendor_name} onChangeText={(v) => setForm({ ...form, vendor_name: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Type (photographer/caterer/...)" value={form.vendor_type} onChangeText={(v) => setForm({ ...form, vendor_type: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Contact Person" value={form.contact_person} onChangeText={(v) => setForm({ ...form, contact_person: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Email" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Contract Amount" value={form.contract_amount} onChangeText={(v) => setForm({ ...form, contract_amount: v })} mode="outlined" keyboardType="numeric" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Paid Amount" value={form.paid_amount} onChangeText={(v) => setForm({ ...form, paid_amount: v })} mode="outlined" keyboardType="numeric" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Notes" value={form.notes} onChangeText={(v) => setForm({ ...form, notes: v })} mode="outlined" multiline style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <PrimaryButton onPress={handleSubmit} loading={create.isPending || update.isPending}>
        {vendorId ? 'Update Vendor' : 'Add Vendor'}
      </PrimaryButton>
    </ScrollView>
  );
};
