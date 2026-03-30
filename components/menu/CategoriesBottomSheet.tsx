import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
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
      <View style={styles.listContainer}>
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.categoryRow,
                {
                  borderBottomColor: theme.border,
                  backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
                },
              ]}
              onPress={() => {
                onSelectCategory(cat.id);
                onClose();
              }}
            >
              <View style={styles.catLeft}>
                <ThemedText
                  style={[
                    styles.catName,
                    {
                      color: isActive ? theme.primary : theme.text,
                      fontWeight: isActive ? '800' : '600',
                    },
                  ]}
                >
                  {cat.name}
                </ThemedText>
                {cat.count !== undefined && (
                  <View style={[styles.countBadge, { backgroundColor: theme.surfaceSecondary }]}>
                    <ThemedText style={[styles.countText, { color: theme.textSecondary }]}>
                      {cat.count}
                    </ThemedText>
                  </View>
                )}
              </View>
              {isActive && <CheckCircle size={22} color={theme.primary} weight="fill" />}
            </Pressable>
          );
        })}
        <View style={{ height: 40 }} />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catName: {
    fontSize: 16,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
