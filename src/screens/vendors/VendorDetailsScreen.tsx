import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useVendor } from '../../hooks/useVendors';
import { LoadingView } from '../../components/LoadingView';
import { GradientHero } from '../../components/ui/GradientHero';
import { AppCard } from '../../components/ui/AppCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { formatCurrency, titleCase } from '../../utils/formatters';
import { getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { VendorsStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<VendorsStackParamList, 'VendorDetails'>;

export const VendorDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { vendorId } = route.params;
  const { isAdmin } = useAuth();
  const { data: vendor, isLoading } = useVendor(vendorId);

  if (isLoading || !vendor) return <LoadingView />;

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <GradientHero
        label={titleCase(vendor.vendor_type)}
        title={vendor.vendor_name}
        subtitle={`Balance due: ${formatCurrency(vendor.balance_due)}`}
        highlight={formatCurrency(vendor.contract_amount)}
      />

      <AppCard colorIndex={0}>
        <Text style={sharedStyles.sectionTitle}>Contact</Text>
        <InfoRow icon="account-outline" label="Contact Person" value={vendor.contact_person || 'N/A'} color={getPalette(0).main} />
        <InfoRow icon="phone-outline" label="Phone" value={vendor.phone || 'N/A'} color={getPalette(1).main} />
        <InfoRow icon="email-outline" label="Email" value={vendor.email || 'N/A'} color={getPalette(2).main} />
      </AppCard>

      <AppCard colorIndex={2}>
        <Text style={sharedStyles.sectionTitle}>Payments</Text>
        <InfoRow icon="file-document-outline" label="Contract" value={formatCurrency(vendor.contract_amount)} color={getPalette(3).main} />
        <InfoRow icon="check-circle-outline" label="Paid" value={formatCurrency(vendor.paid_amount)} color={getPalette(4).main} />
        <InfoRow icon="cash" label="Balance Due" value={formatCurrency(vendor.balance_due)} color={getPalette(5).main} />
        {vendor.notes ? (
          <InfoRow icon="note-text-outline" label="Notes" value={vendor.notes} color={getPalette(0).main} />
        ) : null}
      </AppCard>

      {isAdmin ? (
        <PrimaryButton onPress={() => navigation.navigate('VendorForm', { vendorId })}>
          Edit Vendor
        </PrimaryButton>
      ) : null}
    </ScrollView>
  );
};
