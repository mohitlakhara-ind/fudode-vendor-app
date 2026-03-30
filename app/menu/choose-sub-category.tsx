import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight, Plus } from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

export default function ChooseSubCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  // Mock subcategories
  const [subCategories] = useState([
    { id: '1', name: 'North Indian' },
    { id: '2', name: 'South Indian' },
    { id: '3', name: 'Desserts' },
    { id: '4', name: 'Drinks' },
    { id: '5', name: 'Combos' },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Select Sub Category</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={[styles.instruction, { color: theme.textSecondary }]}>
          Choose a sub-category under <ThemedText style={{ fontWeight: '700', color: theme.text }}>{params.categoryName || 'Selected Category'}</ThemedText>
        </ThemedText>

        <View style={[styles.listContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {subCategories.map((cat, index) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: theme.border },
                index === subCategories.length - 1 && { borderBottomWidth: 0 },
                pressed && { backgroundColor: theme.surfaceSecondary }
              ]}
              onPress={() => router.push({ 
                pathname: '/menu/item-details', 
                params: { 
                  categoryId: params.categoryId, 
                  categoryName: params.categoryName,
                  subCategoryId: cat.id,
                  subCategoryName: cat.name 
                } 
              })}
            >
              <ThemedText style={[styles.rowText, { color: theme.text }]}>{cat.name}</ThemedText>
              <CaretRight size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addNewBtn,
            { borderColor: theme.border + '30', backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' }
          ]}
        >
          <Plus size={20} color={theme.primary} />
          <ThemedText style={[styles.addNewText, { color: theme.primary }]}>Create New Sub-Category</ThemedText>
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
