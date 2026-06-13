import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useExpenseSummary } from '../../hooks/useExpenses';
import { StatCard } from '../../components/StatCard';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatCurrency, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, PALETTE } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';

const chartWidth = Dimensions.get('window').width - 56;

export const ExpenseDashboardScreen: React.FC = () => {
  const { data, isLoading } = useExpenseSummary();

  if (isLoading || !data) return <LoadingView />;

  const categoryEntries = Object.entries(data.by_category).filter(([, v]) => v > 0);
  const pieData = categoryEntries.map(([name, amount], index) => ({
    name: titleCase(name),
    amount,
    color: PALETTE[index % PALETTE.length].main,
    legendFontColor: COLORS.text,
    legendFontSize: 12,
  }));

  const monthlyLabels = Object.keys(data.monthly);
  const monthlyValues = Object.values(data.monthly);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title="Budget Overview" subtitle="Track your wedding expenses" />

      <View style={styles.grid}>
        <StatCard title="Budget" value={formatCurrency(data.estimated_budget)} icon="wallet-outline" colorIndex={0} />
        <StatCard title="Actual Spend" value={formatCurrency(data.actual_spend)} icon="cash-minus" colorIndex={1} />
        <StatCard title="Remaining" value={formatCurrency(data.remaining_budget)} icon="piggy-bank-outline" colorIndex={2} />
      </View>

      {pieData.length > 0 ? (
        <AppCard colorIndex={3}>
          <Text style={sharedStyles.sectionTitle}>Category Breakdown</Text>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            chartConfig={{ color: () => COLORS.primary }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="12"
          />
        </AppCard>
      ) : null}

      {monthlyLabels.length > 0 ? (
        <AppCard colorIndex={4}>
          <Text style={sharedStyles.sectionTitle}>Monthly Expenses</Text>
          <BarChart
            data={{
              labels: monthlyLabels.map((l) => l.slice(5)),
              datasets: [{ data: monthlyValues.length ? monthlyValues : [0] }],
            }}
            width={chartWidth}
            height={220}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: COLORS.surface,
              backgroundGradientFrom: PALETTE[0].main,
              backgroundGradientTo: PALETTE[1].main,
              color: () => COLORS.white,
              labelColor: () => COLORS.textSoft,
            }}
            style={styles.chart}
          />
        </AppCard>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  chart: { borderRadius: 12, marginTop: 8 },
});
