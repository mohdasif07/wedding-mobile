import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlbum } from '../../hooks/usePhotos';
import { LoadingView } from '../../components/LoadingView';
import { COLORS, RADIUS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { PhotosStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<PhotosStackParamList, 'AlbumDetails'>;

export const AlbumDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { albumId, title } = route.params;
  const { isAdmin } = useAuth();
  const { data: album, isLoading } = useAlbum(albumId);
  const photos = useMemo(() => album?.photos ?? [], [album]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <LinearGradient
        colors={[getPalette(albumId).gradient[0], getPalette(albumId).gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerInner}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{photos.length} photos</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={photos}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => {
          const palette = getPalette(index);
          return (
            <Pressable
              style={[styles.photoCard, { borderColor: palette.main }]}
              onPress={() =>
                navigation.navigate('PhotoViewer', {
                  url: item.image_url || '',
                  caption: item.caption,
                })
              }
            >
              <Image
                source={{ uri: item.thumbnail_url || item.image_url }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            </Pressable>
          );
        }}
      />
      {isAdmin ? (
        <FAB
          icon="upload"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Photos }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('PhotoUpload', { albumId })}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  headerInner: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  badgeText: { color: COLORS.white, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 80 },
  row: { justifyContent: 'space-between' },
  photoCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 2,
  },
  image: { width: '100%', height: 160, backgroundColor: COLORS.cream },
});
