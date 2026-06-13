import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { attendanceApi } from '../../api/attendance';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';
import { EventsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<EventsStackParamList, 'QrScanner'>;

export const QrScannerScreen: React.FC<Props> = ({ route }) => {
  const { eventId } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [message, setMessage] = useState('');
  const [scanning, setScanning] = useState(true);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permission}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
          style={styles.permissionCard}
        >
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
          <PrimaryButton onPress={requestPermission}>Grant Permission</PrimaryButton>
        </LinearGradient>
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (!scanning) return;
    setScanning(false);
    try {
      const { data: result } = await attendanceApi.checkIn(eventId, data);
      setMessage(
        result.already_checked_in
          ? 'Guest already checked in ✓'
          : 'Check-in successful! 🎉'
      );
    } catch {
      setMessage('Invalid QR code for this event');
    } finally {
      setTimeout(() => {
        setScanning(true);
        setMessage('');
      }, 2500);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanning ? handleScan : undefined}
      />
      <View style={styles.frame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <Text style={styles.instruction}>Scan guest QR code to mark attendance</Text>
        {message ? (
          <View style={[
            styles.messageBox,
            message.includes('successful') ? styles.successBox : styles.errorBox,
          ]}>
            <Text style={styles.message}>{message}</Text>
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
};

const cornerSize = 24;
const cornerColor = COLORS.primary;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  permission: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: {
    borderRadius: RADIUS.xl,
    padding: 28,
    alignItems: 'center',
  },
  permissionText: {
    fontFamily: FONTS.body,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  frame: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    right: '15%',
    height: 280,
  },
  corner: {
    position: 'absolute',
    width: cornerSize,
    height: cornerSize,
    borderColor: cornerColor,
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 48,
  },
  instruction: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
  },
  messageBox: {
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  successBox: { backgroundColor: COLORS.success },
  errorBox: { backgroundColor: COLORS.error },
  message: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.white,
    textAlign: 'center',
  },
});
