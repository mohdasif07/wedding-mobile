import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserRole } from '../types';
import { getRolePermissions, GUEST_CAPABILITIES, ROLE_DESCRIPTIONS } from '../utils/permissions';
import { COLORS, FONTS, RADIUS, getPalette } from '../utils/constants';

interface Props {
  role: UserRole;
}

export const RolePermissionsCard: React.FC<Props> = ({ role }) => {
  const info = getRolePermissions(role);
  const palette = role === 'admin' ? getPalette(0) : getPalette(1);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[...palette.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <MaterialCommunityIcons
          name={role === 'admin' ? 'shield-crown' : 'account-heart'}
          size={22}
          color={COLORS.white}
        />
        <View style={styles.headerText}>
          <Text style={styles.roleTitle}>{info.label} Access</Text>
          <Text style={styles.roleDesc}>{ROLE_DESCRIPTIONS[role]}</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>You can</Text>
        {info.allowed.map((item) => (
          <View key={item} style={styles.row}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.rowText}>{item}</Text>
          </View>
        ))}

        {info.restricted.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, styles.sectionGap]}>Not allowed</Text>
            {info.restricted.map((item) => (
              <View key={item} style={styles.row}>
                <MaterialCommunityIcons name="close-circle" size={16} color={COLORS.muted} />
                <Text style={[styles.rowText, styles.muted]}>{item}</Text>
              </View>
            ))}
          </>
        ) : null}

        <Text style={[styles.sectionLabel, styles.sectionGap]}>Guest (no login)</Text>
        {GUEST_CAPABILITIES.map((item) => (
          <View key={item} style={styles.row}>
            <MaterialCommunityIcons name="account-outline" size={16} color={COLORS.secondary} />
            <Text style={[styles.rowText, styles.muted]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerText: { flex: 1 },
  roleTitle: {
    fontFamily: FONTS.headingMedium,
    fontSize: 18,
    color: COLORS.white,
  },
  roleDesc: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    lineHeight: 18,
  },
  body: { padding: 16 },
  sectionLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionGap: { marginTop: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  rowText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSoft,
    lineHeight: 18,
  },
  muted: { color: COLORS.muted },
});
