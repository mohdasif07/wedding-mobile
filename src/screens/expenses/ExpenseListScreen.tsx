import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useExpenses } from '../../hooks/useExpenses';
import { SearchBar } from '../../components/SearchBar';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatCurrency, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { ExpensesStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseList'>;

export const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const { data, isLoading, fetchNextPage, hasNextPage } = useExpenses(search);
  const expenses = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Expenses" subtitle="All wedding spending" />
      <View style={sharedStyles.body}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search expenses..." />
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('ExpenseForm', { expenseId: item.id })}
              >
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: palette.light }]}>
                    <MaterialCommunityIcons name="receipt" size={22} color={palette.main} />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.meta}>{titleCase(item.category)} · {titleCase(item.payment_status)}</Text>
                    <Text style={[styles.amount, { color: palette.main }]}>
                      {formatCurrency(item.actual_amount)} / {formatCurrency(item.estimated_amount)}
                    </Text>
                  </View>
                </View>
              </AppCard>
            );
          }}
        />
      </View>
      {isAdmin ? (
        <FAB
          icon="plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Expenses }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('ExpenseForm', {})}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 80 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  title: { fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.text },
  meta: { fontFamily: FONTS.body, color: COLORS.muted, marginTop: 4, fontSize: 13 },
  amount: { fontFamily: FONTS.bodyBold, marginTop: 6, fontSize: 13 },
});
