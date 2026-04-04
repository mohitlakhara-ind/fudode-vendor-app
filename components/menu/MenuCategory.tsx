import React, { useState } from 'react';
import { StyleSheet, View, Pressable, LayoutAnimation } from 'react-native';
import { CaretDown, CaretUp, DotsThreeVertical, SquaresFour } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { InventoryCategory, InventoryItem } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { MenuItemCard } from './MenuItemCard';

// LayoutAnimation is handled automatically in most modern RN versions/architectures
// removing no-op call that causes warnings in New Architecture

interface MenuCategoryProps {
  category: InventoryCategory;
  onToggleCategory?: (id: string, active: boolean) => void;
  onToggleItemStock?: (catId: string, itemId: string, inStock: boolean) => void;
  onEditItem?: (item: InventoryItem, category: InventoryCategory) => void;
  onDeleteCategory?: (id: string) => void;
}

export const MenuCategory = ({ category, onToggleCategory, onToggleItemStock, onEditItem, onDeleteCategory }: MenuCategoryProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.categoryContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable onPress={toggleExpand} style={styles.categoryHeader}>
        <View style={styles.categoryTitleRow}>
          <View style={[styles.categoryIcon, { backgroundColor: theme.surfaceSecondary }]}>
            <SquaresFour size={18} color={theme.text} weight="bold" />
          </View>
          <ThemedText style={[styles.categoryTitle, { color: theme.text }]}>
            {category.name}
          </ThemedText>
          <View style={[styles.countBadge, { backgroundColor: theme.surfaceSecondary }]}>
            <ThemedText style={[styles.countText, { color: theme.textSecondary }]}>{category.items.length}</ThemedText>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable 
            onPress={() => onDeleteCategory?.(category.id)} 
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
          >
            <DotsThreeVertical size={20} color={theme.textSecondary} />
          </Pressable>
          <PremiumSwitch 
            value={category.isActive} 
            onValueChange={(val) => onToggleCategory?.(category.id, val)} 
            activeColor={theme.success} 
          />
          {isExpanded ? <CaretUp size={18} color={theme.text} /> : <CaretDown size={18} color={theme.text} />}
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.subcategoryWrapper}>
          <View style={[styles.subcategoryHeader, { borderBottomColor: theme.border }]}>
            <ThemedText style={[styles.subcategoryTitle, { color: theme.textSecondary }]}>
              {category.name.toUpperCase()} • {category.items.length} ITEMS
            </ThemedText>
          </View>
          <View style={styles.itemsList}>
            {category.items.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onToggleStock={(id, inStock) => onToggleItemStock?.(category.id, id, inStock)}
                onEdit={(item) => onEditItem?.(item, category)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  subcategoryWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subcategoryHeader: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  subcategoryTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  itemsList: {
    gap: 4,
  },
});
