import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { InventoryItem } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { Separator } from '@/components/ui/Separator';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

interface InventoryItemRowProps {
  item: InventoryItem;
  onToggle: (itemId: string) => void;
  onPress?: (itemId: string) => void;
  isLast?: boolean;
}

export const InventoryItemRow = ({ item, onToggle, onPress, isLast }: InventoryItemRowProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => onPress?.(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <View style={[styles.vegIndicator, { borderColor: item.isVeg ? StatusColors.Ready : StatusColors.Late }]}>
            <View style={[styles.vegDot, { backgroundColor: item.isVeg ? StatusColors.Ready : StatusColors.Late }]} />
          </View>
          
          <View style={styles.itemInfo}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <View style={styles.priceRow}>
              <ThemedText style={[styles.price, { color: theme.textSecondary }]}>₹{item.price}</ThemedText>
              {item.status && item.status !== 'live' && (
                <View style={[styles.statusBadge, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                    {item.status.replace('-', ' ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <PremiumSwitch
          value={item.isInStock}
          onValueChange={() => onToggle(item.id)}
          activeColor={theme.success}
        />
      </TouchableOpacity>
      {!isLast && <Separator marginVertical={0} opacity={0.15} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  vegIndicator: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
