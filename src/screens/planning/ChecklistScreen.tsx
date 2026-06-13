import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Checkbox, FAB, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTasks, useTaskMutations } from '../../hooks/useTasks';
import { LoadingView } from '../../components/LoadingView';
import { FilterChip } from '../../components/ui/FilterChip';
import { AppCard } from '../../components/ui/AppCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { titleCase } from '../../utils/formatters';
import { COLORS, FONTS, TAB_COLORS, getPalette } from '../../utils/constants';
import { sharedStyles } from '../../theme/sharedStyles';
import { DashboardStackParamList } from '../../navigation/types';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Checklist'>;

const CATEGORIES = ['', 'venue', 'guests', 'vendors', 'catering', 'photography', 'attire', 'legal', 'general'];

export const ChecklistScreen: React.FC<Props> = () => {
  const { isAdmin } = useAuth();
  const [category, setCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const { data, isLoading } = useTasks(category);
  const { create, update, remove } = useTaskMutations();

  const tasks = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  if (isLoading) return <LoadingView />;

  const toggleTask = (id: number, current: string) => {
    const next = current === 'completed' ? 'pending' : 'completed';
    update.mutate({ id, status: next as Task['status'] });
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    create.mutate({ title: newTitle.trim(), category: category || 'general', status: 'pending' });
    setNewTitle('');
  };

  return (
    <View style={sharedStyles.screen}>
      <ScreenHeader
        title="Planning Checklist"
        subtitle={`${progress}% complete · ${completed}/${tasks.length} done`}
      />
      <View style={sharedStyles.body}>
        <View style={styles.filters}>
          {CATEGORIES.slice(0, 5).map((c, i) => (
            <FilterChip
              key={c || 'all'}
              label={c ? titleCase(c) : 'All'}
              selected={category === c}
              onPress={() => setCategory(c)}
              colorIndex={i}
            />
          ))}
        </View>

        {isAdmin ? (
          <View style={styles.addRow}>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Add a task..."
              mode="outlined"
              style={[sharedStyles.input, styles.addInput]}
              outlineStyle={sharedStyles.inputOutline}
            />
          </View>
        ) : null}

        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const palette = getPalette(index);
            const done = item.status === 'completed';
            return (
              <AppCard colorIndex={index}>
                <View style={styles.row}>
                  <Checkbox
                    status={done ? 'checked' : 'unchecked'}
                    onPress={() => toggleTask(item.id, item.status)}
                    color={palette.main}
                  />
                  <View style={styles.content}>
                    <Text style={[styles.title, done && styles.doneTitle]}>{item.title}</Text>
                    <Text style={styles.meta}>{titleCase(item.category)}</Text>
                  </View>
                </View>
              </AppCard>
            );
          }}
        />
      </View>

      {isAdmin ? (
        <FAB
          icon="plus"
          style={[sharedStyles.fab, { backgroundColor: TAB_COLORS.Dashboard }]}
          color={COLORS.white}
          onPress={handleAdd}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  addRow: { marginBottom: 8 },
  addInput: { marginBottom: 0 },
  list: { paddingBottom: 80 },
  row: { flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontFamily: FONTS.bodyBold, fontSize: 15, color: COLORS.text },
  doneTitle: { textDecorationLine: 'line-through', color: COLORS.muted },
  meta: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
