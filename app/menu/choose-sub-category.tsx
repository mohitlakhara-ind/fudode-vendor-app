import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight, Plus } from 'phosphor-react-native';
import { EmptyState } from '@/components/ui/EmptyState';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { createCategory, fetchCategories } from '@/store/slices/menuSlice';
import { InputDialog } from '@/components/ui/InputDialog';

export default function ChooseSubCategoryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const { categories, loading } = useAppSelector((state: RootState) => state.menu);

  // Filter for sub-categories of the selected category
  const subCategories = categories.filter(cat => cat.parentCategoryId === params.categoryId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleCreateSubCategory = (name: string) => {
    setIsCreating(true);
    dispatch(createCategory({ name, parentCategoryId: params.categoryId }))
      .unwrap()
      .then(() => {
        setShowCreateModal(false);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Select Sub Category</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.instructionContainer}>
          <ThemedText style={[styles.instruction, { color: theme.textSecondary }]}>
            Choose a sub-category under <ThemedText style={{ fontWeight: '700', color: theme.text }}>{params.categoryName || 'Selected Category'}</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.listWrapper}>
          {loading && categories.length === 0 ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
          ) : subCategories.length > 0 ? (
            subCategories.map((cat) => (
              <Pressable
                key={cat.id}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  pressed && { backgroundColor: theme.surfaceSecondary, transform: [{ scale: 0.98 }] }
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
                <View style={styles.cardContent}>
                  <View style={[styles.iconBox, { backgroundColor: theme.primary + '10' }]}>
                    <Plus size={22} color={theme.primary} weight="duotone" />
                  </View>
                  <ThemedText style={[styles.cardText, { color: theme.text }]}>{cat.name}</ThemedText>
                </View>
                <CaretRight size={20} color={theme.textSecondary} />
              </Pressable>
            ))
          ) : (
            <EmptyState
              icon={Plus}
              title="No Sub-Categories"
              description="Add sub-categories like 'North Indian' or 'Desserts' to organize your menu."
              style={{ marginVertical: 40 }}
            />
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addNewBtn,
            { backgroundColor: pressed ? theme.surfaceSecondary : 'transparent', borderColor: theme.primary + '40' }
          ]}
          onPress={() => setShowCreateModal(true)}
        >
          <View style={[styles.plusIcon, { backgroundColor: theme.primary }]}>
            <Plus size={18} color="#FFF" weight="bold" />
          </View>
          <ThemedText style={[styles.addNewText, { color: theme.primary }]}>Create New Sub-Category</ThemedText>
        </Pressable>

        <InputDialog
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onConfirm={handleCreateSubCategory}
          title="New Sub-Category"
          label="Sub-Category Name"
          placeholder="e.g. North Indian, Desserts"
          loading={isCreating}
        />
      </ScrollView>
    </View>
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
    flexGrow: 1,
  },
  instructionContainer: {
    marginBottom: 20,
  },
  instruction: {
    ...Typography.BodyRegular,
    opacity: 0.8,
  },
  listWrapper: {
    flex: 1,
    gap: 20, // Increased gap for visual separation
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    // Add subtle shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    ...Typography.BodyLarge,
    fontWeight: '700',
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 20,
    gap: 12,
    marginTop: 'auto',
  },
  plusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewText: {
    ...Typography.BodyLarge,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
