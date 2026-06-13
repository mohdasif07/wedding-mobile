import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenseDashboardScreen } from '../screens/expenses/ExpenseDashboardScreen';
import { ExpenseListScreen } from '../screens/expenses/ExpenseListScreen';
import { ExpenseFormScreen } from '../screens/expenses/ExpenseFormScreen';
import { ExpensesStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export const ExpensesNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="ExpenseDashboard" component={ExpenseDashboardScreen} options={{ title: 'Budget' }} />
    <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expenses' }} />
    <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} options={{ title: 'Expense' }} />
  </Stack.Navigator>
);
