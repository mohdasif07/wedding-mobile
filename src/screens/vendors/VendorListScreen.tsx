import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useVendors } from '../../hooks/useVendors';
import { SearchBar } from '../../components/SearchBar';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { formatCurrency, titleCase } from '../../utils/formatters';
import { COLORS, FONTS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { VendorsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<VendorsStackParamList, 'VendorList'>;

export const VendorListScreen: React.FC<Props> = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const { data, isLoading, fetchNextPage, hasNextPage } = useVendors(search);
  const vendors = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Vendors" subtitle="Manage your wedding vendors" />
      <View style={sharedStyles.body}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search vendors..." />
        <FlatList
          data={vendors}
          keyExtractor={(item) => String(item.id)}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('VendorDetails', { vendorId: item.id })}
              >
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: palette.light }]}>
                    <MaterialCommunityIcons name="store" size={22} color={palette.main} />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.name}>{item.vendor_name}</Text>
                    <Text style={styles.meta}>{titleCase(item.vendor_type)}</Text>
                    <Text style={[styles.balance, { color: palette.main }]}>
                      Balance: {formatCurrency(item.balance_due)}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={palette.main} />
                </View>
              </AppCard>
            );
          }}
        />
      </View>
      {isAdmin ? (
        <FAB
          icon="plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Vendors }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('VendorForm', {})}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 80 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  name: { fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.text },
  meta: { fontFamily: FONTS.body, color: COLORS.muted, marginTop: 4, fontSize: 13 },
  balance: { fontFamily: FONTS.bodyBold, marginTop: 6, fontSize: 13 },
});
