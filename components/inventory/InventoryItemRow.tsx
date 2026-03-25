import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { InventoryItem } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { Separator } from '@/components/ui/Separator';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

interface InventoryItemRowProps {
  item: InventoryItem;
  onToggle: (itemId: string) => void;
}

export const InventoryItemRow = ({ item, onToggle }: InventoryItemRowProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Veg/Non-Veg Indicator on the far left */}
        <View style={[styles.vegIndicator, { borderColor: item.isVeg ? StatusColors.Ready : StatusColors.Late }]}>
          <View style={[styles.vegDot, { backgroundColor: item.isVeg ? StatusColors.Ready : StatusColors.Late }]} />
        </View>
        
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        </View>

        <PremiumSwitch
          value={item.isInStock}
          onValueChange={() => onToggle(item.id)}
          activeColor={StatusColors.Ready}
        />
      </View>
      <Separator marginVertical={0} opacity={0.2} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.BodyLarge,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
