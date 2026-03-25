import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { InventoryCategory } from '@/constants/mockInventory';
import { CaretDown, CaretUp, Warning, CheckCircle } from 'phosphor-react-native';
import { InventoryItemRow } from './InventoryItemRow';
import { ThemedText } from '@/components/themed-text';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental && !(global as any).nativeFabricUIManager) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InventoryCategoryCardProps {
  category: InventoryCategory;
  onToggleCategory?: (catId: string) => void;
  onToggleItem?: (catId: string, itemId: string) => void;
  onPressItem?: (catId: string, itemId: string) => void;
}

export const InventoryCategoryCard = ({ 
  category, 
  onToggleCategory, 
  onToggleItem,
  onPressItem 
}: InventoryCategoryCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [expanded, setExpanded] = useState(false);

  const outOfStockCount = category.items.filter(i => !i.isInStock).length;
  const isAllInStock = outOfStockCount === 0;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }
    ]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.9}
      >
        <View style={styles.headerMain}>
          <View style={styles.titleSection}>
            <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {category.items.length} Items • {category.subtitle}
            </ThemedText>
          </View>
          
          <PremiumSwitch
            value={category.isActive}
            onValueChange={() => onToggleCategory?.(category.id)}
            activeColor={theme.success}
          />
        </View>

        <View style={styles.headerFooter}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: isAllInStock ? theme.success + '10' : theme.error + '10' }
          ]}>
            {isAllInStock ? (
              <CheckCircle size={14} color={theme.success} weight="fill" />
            ) : (
              <Warning size={14} color={theme.error} weight="fill" />
            )}
            <ThemedText style={[styles.statusText, { color: isAllInStock ? theme.success : theme.error }]}>
              {isAllInStock ? 'All in stock' : `${outOfStockCount} Out of stock`}
            </ThemedText>
          </View>
          
          <View style={[styles.expandIcon, { backgroundColor: theme.surfaceSecondary }]}>
            {expanded ? <CaretUp size={14} color={theme.text} weight="bold" /> : <CaretDown size={14} color={theme.text} weight="bold" />}
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.itemsList, { backgroundColor: theme.surfaceSecondary + '50', borderTopColor: theme.border }]}>
          {category.items.map((item, index) => (
            <InventoryItemRow 
              key={item.id} 
              item={item} 
              isLast={index === category.items.length - 1}
              onToggle={(itemId) => onToggleItem?.(category.id, itemId)} 
              onPress={(itemId) => onPressItem?.(category.id, itemId)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    padding: 16,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  categoryName: {
    ...Typography.H2,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.Caption,
    fontSize: 13,
  },
  headerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '700',
  },
  expandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    paddingHorizontal: 0,
    borderTopWidth: 1,
  },
});
