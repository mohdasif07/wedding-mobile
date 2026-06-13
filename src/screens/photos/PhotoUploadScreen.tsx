import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Menu, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlbums, usePhotoUpload } from '../../hooks/usePhotos';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { appendImageToFormData } from '../../utils/uploadFormData';
import { getApiErrorMessage } from '../../utils/apiError';
import { PhotosStackParamList } from '../../navigation/types';
import { sharedStyles } from '../../theme/sharedStyles';

type Props = NativeStackScreenProps<PhotosStackParamList, 'PhotoUpload'>;

export const PhotoUploadScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialAlbumId = route.params?.albumId;
  const initialEventId = route.params?.eventId;
  const upload = usePhotoUpload();
  const { data: albumsData } = useAlbums();
  const albums = albumsData?.pages.flatMap((p) => p.items) ?? [];

  const [caption, setCaption] = useState('');
  const [assetUri, setAssetUri] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | undefined>(initialAlbumId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAssetUri(result.assets[0].uri);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!assetUri) return;

    if (!selectedAlbumId && !initialEventId) {
      setError('Please select an album before uploading.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (selectedAlbumId) formData.append('album_id', String(selectedAlbumId));
      if (initialEventId) formData.append('event_id', String(initialEventId));
      await appendImageToFormData(formData, assetUri);

      await upload.mutateAsync(formData);
      navigation.goBack();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader title="Upload Photo" subtitle="Add to your wedding album" />

      {!initialEventId ? (
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchor={
            <PrimaryButton mode="outlined" onPress={() => setMenuOpen(true)}>
              Album: {selectedAlbum?.title ?? 'Select album'}
            </PrimaryButton>
          }
        >
          {albums.map((album) => (
            <Menu.Item
              key={album.id}
              title={album.title}
              onPress={() => {
                setSelectedAlbumId(album.id);
                setMenuOpen(false);
              }}
            />
          ))}
        </Menu>
      ) : null}

      <TextInput label="Caption" value={caption} onChangeText={setCaption} mode="outlined" style={sharedStyles.input} outlineStyle={sharedStyles.inputOutline} />
      <PrimaryButton mode="outlined" onPress={pickImage}>
        {assetUri ? 'Change Photo' : 'Select Photo'}
      </PrimaryButton>
      {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
      <PrimaryButton onPress={handleUpload} loading={loading || upload.isPending} disabled={!assetUri}>
        Upload
      </PrimaryButton>
    </ScrollView>
  );
};
