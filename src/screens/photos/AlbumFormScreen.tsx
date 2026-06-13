import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlbumMutations } from '../../hooks/usePhotos';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { sharedStyles } from '../../theme/sharedStyles';
import { PhotosStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PhotosStackParamList, 'AlbumForm'>;

export const AlbumFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const albumId = route.params?.albumId;
  const { create, update } = useAlbumMutations();
  const [title, setTitle] = useState(route.params?.title ?? '');
  const [description, setDescription] = useState(route.params?.description ?? '');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (albumId) {
      await update.mutateAsync({ id: albumId, title, description });
    } else {
      await create.mutateAsync({ title, description });
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader
        title={albumId ? 'Edit Album' : 'Create Album'}
        subtitle="Organize your wedding photos"
      />
      <TextInput
        label="Album Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />
      <PrimaryButton
        onPress={handleSubmit}
        loading={create.isPending || update.isPending}
      >
        {albumId ? 'Update Album' : 'Create Album'}
      </PrimaryButton>
    </ScrollView>
  );
};
