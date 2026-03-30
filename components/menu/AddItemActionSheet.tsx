import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { CaretRight } from 'phosphor-react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

interface AddItemActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: () => void;
  onAddCategory: () => void;
  onAddSubCategory: () => void;
}

export const AddItemActionSheet = ({
  visible,
  onClose,
  onAddItem,
  onAddCategory,
  onAddSubCategory,
}: AddItemActionSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Add item or category">
      <View style={styles.optionsList}>
        <Pressable
          style={({ pressed }) => [styles.optionRow, { borderBottomColor: theme.border, backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' }]}
          onPress={() => {
            onClose();
            setTimeout(onAddItem, 300);
          }}
        >
          <ThemedText style={[styles.optionText, { color: theme.text }]}>Add item</ThemedText>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.optionRow, { borderBottomColor: theme.border, backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' }]}
          onPress={() => {
            onClose();
            setTimeout(onAddCategory, 300);
          }}
        >
          <ThemedText style={[styles.optionText, { color: theme.text }]}>Add category</ThemedText>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.optionRow, { borderBottomColor: theme.border, backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' }]}
          onPress={() => {
            onClose();
            setTimeout(onAddSubCategory, 300);
          }}
        >
          <ThemedText style={[styles.optionText, { color: theme.text }]}>Add sub-category</ThemedText>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  optionsList: {
    paddingBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  optionText: {
    ...Typography.H3,
    fontWeight: '700',
  },
});
