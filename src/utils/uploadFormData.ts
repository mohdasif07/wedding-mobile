import { Platform } from 'react-native';

export async function appendImageToFormData(
  formData: FormData,
  uri: string,
  fieldName = 'image',
  filename = 'photo.jpg',
  mimeType = 'image/jpeg'
) {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append(fieldName, blob, filename);
    return;
  }

  formData.append(fieldName, {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);
}
