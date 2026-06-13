import { Alert, Linking } from 'react-native';

function photoExtension(url: string): string {
  const match = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function downloadPhotoWeb(url: string): Promise<void> {
  const ext = photoExtension(url);
  const filename = `wedding-photo-${Date.now()}.${ext}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadPhotoToGallery(url: string): Promise<void> {
  await downloadPhotoWeb(url);
}

export async function sharePhoto(url: string, caption?: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Wedding Photo',
        text: caption,
        url,
      });
      return;
    } catch {
      // cancelled or failed
    }
  }
  await Linking.openURL(url);
}

export async function sharePhotoOnWhatsApp(url: string, caption?: string): Promise<void> {
  const text = caption ? `${caption}\n\n${url}` : url;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  await Linking.openURL(waUrl);
}

export function showPhotoActionError(err: unknown, fallback = 'Something went wrong') {
  const message = err instanceof Error ? err.message : fallback;
  if (typeof window !== 'undefined') {
    window.alert(message);
  } else {
    Alert.alert('Failed', message);
  }
}

export function showPhotoActionSuccess(title: string, message?: string) {
  if (typeof window !== 'undefined') {
    window.alert(message ? `${title}\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}
