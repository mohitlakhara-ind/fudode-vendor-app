import React, { useState } from 'react';
import { StyleSheet, View, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { CaretDown, CaretUp, DotsThreeVertical } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { InventoryCategory } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { MenuItemCard } from './MenuItemCard';

// LayoutAnimation is handled automatically in most modern RN versions/architectures
// removing no-op call that causes warnings in New Architecture

interface MenuCategoryProps {
  category: InventoryCategory;
  onToggleCategory?: (id: string, active: boolean) => void;
  onToggleItemStock?: (catId: string, itemId: string, inStock: boolean) => void;
}

export const MenuCategory = ({ category, onToggleCategory, onToggleItemStock }: MenuCategoryProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Pressable onPress={toggleExpand} style={styles.categoryTitleRow}>
          <ThemedText style={[styles.categoryTitle, { color: theme.text }]}>
            {category.name} & Pasta ({category.items.length})
          </ThemedText>
          {isExpanded ? <CaretUp size={18} color={theme.text} /> : <CaretDown size={18} color={theme.text} />}
        </Pressable>
        <Pressable>
          <DotsThreeVertical size={20} color={theme.text} />
        </Pressable>
      </View>

      {isExpanded && (
        <View style={styles.subcategoryWrapper}>
          <View style={styles.subcategoryHeader}>
            <ThemedText style={[styles.subcategoryTitle, { color: theme.textSecondary }]}>
              {category.name.toUpperCase()} ({category.items.length})
            </ThemedText>
            <PremiumSwitch 
              value={category.isActive} 
              onValueChange={(val) => onToggleCategory?.(category.id, val)} 
              activeColor="#22BA62" 
            />
          </View>
          {category.items.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onToggleStock={(id, inStock) => onToggleItemStock?.(category.id, id, inStock)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  subcategoryWrapper: {
    paddingHorizontal: 16,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  subcategoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
