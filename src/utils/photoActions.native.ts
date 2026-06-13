import { Alert, Linking } from 'react-native';
import { cacheDirectory, downloadAsync } from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

function photoExtension(url: string): string {
  const match = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

function mimeType(ext: string): string {
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
}

async function cachePhotoFromUrl(url: string): Promise<{ uri: string; ext: string }> {
  if (!url) throw new Error('Photo URL is missing');

  const ext = photoExtension(url);
  const filename = `wedding-photo-${Date.now()}.${ext}`;
  const localUri = `${cacheDirectory}${filename}`;
  const result = await downloadAsync(url, localUri);

  if (result.status !== 200) {
    throw new Error('Could not download photo. Check your connection.');
  }

  return { uri: result.uri, ext };
}

export async function downloadPhotoToGallery(url: string): Promise<void> {
  const { status } = await MediaLibrary.requestPermissionsAsync(true);
  if (status !== 'granted') {
    throw new Error('Gallery permission is required to save photos.');
  }

  const { uri } = await cachePhotoFromUrl(url);
  await MediaLibrary.saveToLibraryAsync(uri);
}

export async function sharePhoto(url: string, caption?: string): Promise<void> {
  const { uri, ext } = await cachePhotoFromUrl(url);
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: mimeType(ext),
    dialogTitle: caption || 'Share photo',
    UTI: ext === 'png' ? 'public.png' : 'public.jpeg',
  });
}

export async function sharePhotoOnWhatsApp(url: string, caption?: string): Promise<void> {
  const { uri, ext } = await cachePhotoFromUrl(url);

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: mimeType(ext),
    dialogTitle: 'Share on WhatsApp',
    UTI: ext === 'png' ? 'public.png' : 'public.jpeg',
  });
}

export function showPhotoActionError(err: unknown, fallback = 'Something went wrong') {
  const message = err instanceof Error ? err.message : fallback;
  Alert.alert('Failed', message);
}

export function showPhotoActionSuccess(title: string, message?: string) {
  Alert.alert(title, message);
}
