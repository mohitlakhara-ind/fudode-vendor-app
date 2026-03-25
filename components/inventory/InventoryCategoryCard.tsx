import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { InventoryCategory } from '@/constants/mockInventory';
import { CaretDown, CaretUp } from 'phosphor-react-native';
import { InventoryItemRow } from './InventoryItemRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

interface InventoryCategoryCardProps {
  category: InventoryCategory;
  onToggleCategory?: (catId: string) => void;
  onToggleItem?: (catId: string, itemId: string) => void;
}

export const InventoryCategoryCard = ({ category, onToggleCategory, onToggleItem }: InventoryCategoryCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const [expanded, setExpanded] = useState(false);

  const outOfStockCount = category.items.filter(i => !i.isInStock).length;
  const isAllInStock = outOfStockCount === 0;

  return (
    <ThemedView style={[
      styles.card, 
      { 
        borderColor: theme.border,
        backgroundColor: theme.surface,
      }
    ]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerInfo} 
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <View style={styles.titleRow}>
            <View style={styles.nameContainer}>
              <ThemedText type="defaultSemiBold" style={styles.categoryName}>{category.name}</ThemedText>
              <View style={[styles.countBadge, { backgroundColor: theme.secondary + '20' }]}>
                <ThemedText style={[styles.countText, { color: theme.secondary }]}>{category.items.length}</ThemedText>
              </View>
            </View>
            <View style={styles.toggleContainer}>
              <PremiumSwitch
                value={category.isActive}
                onValueChange={() => onToggleCategory?.(category.id)}
                activeColor={StatusColors.Ready}
              />
            </View>
          </View>
          
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>{category.subtitle}</ThemedText>
          
          <TouchableOpacity activeOpacity={0.6}>
            <ThemedText style={[styles.mappedLink, { color: theme.primary }]}>
              Mapped to {category.items.length} items <ThemedText style={{ fontSize: 10, color: theme.primary }}>{'>'}</ThemedText>
            </ThemedText>
          </TouchableOpacity>

          <View style={[styles.divider, { borderBottomColor: theme.border }]} />

          <View style={styles.statusRow}>
              {isAllInStock ? (
                  <ThemedText style={[styles.statusSummary, { color: StatusColors.Ready }]}>In stock</ThemedText>
              ) : (
                  <ThemedText style={[styles.statusSummary, { color: StatusColors.Late }]}>
                      {outOfStockCount} out of {category.items.length} items is out of stock
                  </ThemedText>
              )}
              <View style={styles.caretBox}>
                {expanded ? <CaretUp size={16} color={theme.icon} weight="bold" /> : <CaretDown size={16} color={theme.icon} weight="bold" />}
              </View>
          </View>
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={[styles.itemsList, { borderTopColor: theme.border }]}>
          {category.items.map(item => (
            <InventoryItemRow 
              key={item.id} 
              item={item} 
              onToggle={(itemId) => onToggleItem?.(category.id, itemId)} 
            />
          ))}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
  },
  headerInfo: {
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    ...Typography.H2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    ...Typography.Caption,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.Caption,
    marginBottom: 4,
  },
  mappedLink: {
    ...Typography.Caption,
    fontWeight: '800',
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 8,
    opacity: 0.1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusSummary: {
    ...Typography.Caption,
    fontWeight: '700',
  },
  caretBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  itemsList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderTopWidth: 1,
  },
});
