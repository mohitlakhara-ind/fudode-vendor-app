import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight, Plus, FolderOpen } from 'phosphor-react-native';
import { EmptyState } from '@/components/ui/EmptyState';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

export default function AddItemCategoryScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  // Mock categories
  const [categories] = useState([
    { id: '1', name: 'Appetizers' },
    { id: '2', name: 'Main Course' },
    { id: '3', name: 'Desserts' },
    { id: '4', name: 'Beverages' },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Select Category</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={[styles.instruction, { color: theme.textSecondary }]}>
          Choose a category for the new item
        </ThemedText>

        <View style={[styles.listContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <Pressable
                key={cat.id}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: theme.border },
                  index === categories.length - 1 && { borderBottomWidth: 0 },
                  pressed && { backgroundColor: theme.surfaceSecondary }
                ]}
                onPress={() => router.push({ pathname: '/menu/choose-sub-category', params: { categoryId: cat.id, categoryName: cat.name } })}
              >
                <ThemedText style={[styles.rowText, { color: theme.text }]}>{cat.name}</ThemedText>
                <CaretRight size={20} color={theme.textSecondary} />
              </Pressable>
            ))
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="No Categories"
              description="You need at least one category to add items. Create your first one below."
              style={{ paddingVertical: 20 }}
            />
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addNewBtn,
            { borderColor: theme.border + '30', backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' }
          ]}
        >
          <Plus size={20} color={theme.primary} />
          <ThemedText style={[styles.addNewText, { color: theme.primary }]}>Create New Category</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.H3,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  instruction: {
    ...Typography.BodyRegular,
    marginBottom: 16,
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowText: {
    ...Typography.BodyLarge,
    fontWeight: '600',
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addNewText: {
    ...Typography.BodyLarge,
    fontWeight: '600',
  },
});
