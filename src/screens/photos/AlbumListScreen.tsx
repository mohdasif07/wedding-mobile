import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlbums } from '../../hooks/usePhotos';
import { SearchBar } from '../../components/SearchBar';
import { LoadingView } from '../../components/LoadingView';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, FONTS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { PhotosStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<PhotosStackParamList, 'AlbumList'>;

export const AlbumListScreen: React.FC<Props> = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const { data, isLoading, fetchNextPage, hasNextPage } = useAlbums(search);
  const albums = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) return <LoadingView />;

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader title="Photo Albums" subtitle="Your wedding memories" />
      <View style={sharedStyles.body}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search albums..." />
        <FlatList
          data={albums}
          keyExtractor={(item) => String(item.id)}
          onEndReached={() => hasNextPage && fetchNextPage()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, isAdmin && styles.listWithFab]}
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            return (
              <AppCard
                colorIndex={index}
                onPress={() => navigation.navigate('AlbumDetails', { albumId: item.id, title: item.title })}
              >
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: palette.light }]}>
                    <MaterialCommunityIcons name="image-album" size={24} color={palette.main} />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.meta}>{item.photos_count ?? 0} photos</Text>
                    {item.description ? <Text style={styles.desc} numberOfLines={2}>{item.description}</Text> : null}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={palette.main} />
                </View>
              </AppCard>
            );
          }}
        />
      </View>

      {isAdmin ? (
        <FAB
          icon="plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Photos }]}
          color={COLORS.white}
          onPress={() => navigation.navigate('AlbumForm', {})}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  listWithFab: { paddingBottom: 80 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  title: { fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.text },
  meta: { fontFamily: FONTS.bodyMedium, color: COLORS.primary, marginTop: 4, fontSize: 13 },
  desc: { fontFamily: FONTS.body, color: COLORS.muted, marginTop: 4, fontSize: 13 },
});
