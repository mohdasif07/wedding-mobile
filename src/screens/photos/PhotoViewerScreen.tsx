import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  downloadPhotoToGallery,
  sharePhoto,
  sharePhotoOnWhatsApp,
  showPhotoActionError,
} from '../../utils/photoActions';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';
import { PhotosStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PhotosStackParamList, 'PhotoViewer'>;

type Action = 'download' | 'whatsapp' | 'share';

const ACTIONS: { key: Action; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }[] = [
  { key: 'download', label: 'Download', icon: 'download', color: '#3B82F6' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
  { key: 'share', label: 'Share', icon: 'share-variant', color: COLORS.primary },
];

export const PhotoViewerScreen: React.FC<Props> = ({ route }) => {
  const { url, caption } = route.params;
  const [loading, setLoading] = useState<Action | null>(null);
  const [snack, setSnack] = useState('');

  const handlers: Record<Action, () => Promise<void>> = {
    download: () => downloadPhotoToGallery(url),
    whatsapp: () => sharePhotoOnWhatsApp(url, caption),
    share: () => sharePhoto(url, caption),
  };

  const successMessages: Record<Action, string> = {
    download: 'Photo saved to gallery!',
    whatsapp: 'Select WhatsApp to send the photo',
    share: 'Share sheet opened',
  };

  const handleAction = async (action: Action) => {
    setLoading(action);
    try {
      await handlers[action]();
      setSnack(successMessages[action]);
    } catch (err) {
      showPhotoActionError(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: url }} style={styles.image} contentFit="contain" />

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.92)']} style={styles.footer}>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}

        <View style={styles.actions}>
          {ACTIONS.map(({ key, label, icon, color }) => {
            const busy = loading === key;
            const disabled = loading !== null;
            return (
              <Pressable
                key={key}
                onPress={() => handleAction(key)}
                disabled={disabled}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: color },
                  pressed && styles.pressed,
                  disabled && !busy && styles.disabled,
                ]}
              >
                {busy ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <MaterialCommunityIcons name={icon} size={22} color={COLORS.white} />
                )}
                <Text style={styles.actionLabel}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={2500}>
        {snack}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { flex: 1, width: '100%' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  caption: {
    fontFamily: FONTS.body,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  actionLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.white,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
