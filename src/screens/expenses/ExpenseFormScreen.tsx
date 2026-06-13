import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useExpenseMutations } from '../../hooks/useExpenses';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { ExpensesStackParamList } from '../../navigation/types';
import { sharedStyles } from '../../theme/sharedStyles';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseForm'>;

export const ExpenseFormScreen: React.FC<Props> = ({ navigation }) => {
  const { create } = useExpenseMutations();
  const [form, setForm] = useState({
    title: '',
    category: 'miscellaneous',
    estimated_amount: '0',
    actual_amount: '0',
    payment_status: 'unpaid',
    remarks: '',
  });

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      estimated_amount: Number(form.estimated_amount),
      actual_amount: Number(form.actual_amount),
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader title="Add Expense" subtitle="Track wedding spending" />
      <TextInput label="Title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Category" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Estimated Amount" value={form.estimated_amount} onChangeText={(v) => setForm({ ...form, estimated_amount: v })} mode="outlined" keyboardType="numeric" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Actual Amount" value={form.actual_amount} onChangeText={(v) => setForm({ ...form, actual_amount: v })} mode="outlined" keyboardType="numeric" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Payment Status" value={form.payment_status} onChangeText={(v) => setForm({ ...form, payment_status: v })} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <TextInput label="Remarks" value={form.remarks} onChangeText={(v) => setForm({ ...form, remarks: v })} mode="outlined" multiline style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <PrimaryButton onPress={handleSubmit} loading={create.isPending}>
        Save Expense
      </PrimaryButton>
    </ScrollView>
  );
};
