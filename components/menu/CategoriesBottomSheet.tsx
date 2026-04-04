import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { CheckCircle } from 'phosphor-react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoriesBottomSheetProps {
  visible: boolean;
  categories: Category[];
  activeCategoryId: string;
  onClose: () => void;
  onSelectCategory: (id: string) => void;
}

export const CategoriesBottomSheet = ({
  visible,
  categories,
  activeCategoryId,
  onClose,
  onSelectCategory,
}: CategoriesBottomSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Categories" fullHeight>
      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: isActive ? theme.primary : theme.border,
                },
                pressed && { backgroundColor: theme.surfaceSecondary, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                onSelectCategory(cat.id);
                onClose();
              }}
            >
              <View style={styles.catLeft}>
                <View style={[styles.iconBox, { backgroundColor: isActive ? theme.primary + '10' : theme.surfaceSecondary }]}>
                  <CheckCircle 
                    size={20} 
                    color={isActive ? theme.primary : theme.textSecondary} 
                    weight={isActive ? "fill" : "regular"} 
                  />
                </View>
                <ThemedText
                  style={[
                    styles.catName,
                    {
                      color: isActive ? theme.primary : theme.text,
                      fontWeight: isActive ? '800' : '700',
                    },
                  ]}
                >
                  {cat.name}
                </ThemedText>
              </View>
              
              {cat.count !== undefined && (
                <View style={[styles.countBadge, { backgroundColor: theme.surfaceSecondary }]}>
                  <ThemedText style={[styles.countText, { color: theme.textSecondary }]}>
                    {cat.count}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16, // Visible separation
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    ...Typography.BodyLarge,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    ...Typography.Caption,
    fontWeight: '800',
  },
});
