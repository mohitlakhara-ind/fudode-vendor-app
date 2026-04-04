import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { CaretRight, Plus, FolderPlus, TreeStructure, Stack } from 'phosphor-react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

interface AddItemActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: () => void;
  onAddCategory: () => void;
  onAddSubCategory: () => void;
  onAddAddonGroup: () => void;
}

export const AddItemActionSheet = ({
  visible,
  onClose,
  onAddItem,
  onAddCategory,
  onAddSubCategory,
  onAddAddonGroup,
}: AddItemActionSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="Add New"
      variant="bottom-sheet"
    >
      <View style={styles.optionsList}>
        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            { 
              borderBottomColor: theme.border, 
              backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
              borderBottomWidth: 1
            }
          ]}
          onPress={() => {
            onClose();
            setTimeout(onAddItem, 300);
          }}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Plus size={20} color={theme.primary} weight="bold" />
            </View>
            <ThemedText style={[styles.optionText, { color: theme.text }]} numberOfLines={1}>Add item</ThemedText>
          </View>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            { 
              borderBottomColor: theme.border, 
              backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
              borderBottomWidth: 1
            }
          ]}
          onPress={() => {
            onClose();
            setTimeout(onAddCategory, 300);
          }}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <FolderPlus size={20} color={theme.primary} weight="bold" />
            </View>
            <ThemedText style={[styles.optionText, { color: theme.text }]} numberOfLines={1}>Add category</ThemedText>
          </View>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            { 
              borderBottomColor: theme.border, 
              backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
              borderBottomWidth: 1
            }
          ]}
          onPress={() => {
            onClose();
            setTimeout(onAddSubCategory, 300);
          }}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <TreeStructure size={20} color={theme.primary} weight="bold" />
            </View>
            <ThemedText style={[styles.optionText, { color: theme.text }]} numberOfLines={1}>Add sub-category</ThemedText>
          </View>
          <CaretRight size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            { 
              borderBottomColor: theme.border, 
              backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
              borderBottomWidth: 0
            }
          ]}
          onPress={() => {
            onClose();
            setTimeout(onAddAddonGroup, 300);
          }}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Stack size={20} color={theme.primary} weight="bold" />
            </View>
            <ThemedText style={[styles.optionText, { color: theme.text }]} numberOfLines={1}>Add add-on group</ThemedText>
          </View>
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
    paddingVertical: 14, // Slightly more compact for Android comfort
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    ...Typography.BodyLarge,
    fontWeight: '700',
    flex: 1,
  },
});
