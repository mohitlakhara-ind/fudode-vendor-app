import React from 'react';
import { StyleSheet, View, Text, Pressable, Image, ScrollView } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Warning, CookingPot, Coffee, Hamburger, Pizza, IceCream } from 'phosphor-react-native';
import { ThemedText } from '@/components/themed-text';

interface ItemDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  item?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    isInStock: boolean;
    imageUrl?: string;
  };
  onToggleStock: (inStock: boolean) => void;
}

export const ItemDetailsSheet = ({
  visible,
  onClose,
  item,
  onToggleStock
}: ItemDetailsSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  if (!item) return null;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Item details"
    >
      <View style={styles.container}>
        {/* Item Image / Placeholder */}
        <View style={[styles.imageArea, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.patternRow}>
                <View style={{ opacity: 0.1 }}><CookingPot size={24} color={theme.textSecondary} /></View>
                <View style={{ opacity: 0.1 }}><Coffee size={24} color={theme.textSecondary} /></View>
                <View style={{ opacity: 0.1 }}><Hamburger size={24} color={theme.textSecondary} /></View>
              </View>
              <View style={styles.patternRow}>
                <View style={{ opacity: 0.1 }}><Pizza size={24} color={theme.textSecondary} /></View>
                <View style={styles.centerIcon}>
                   <View style={{ opacity: 0.5 }}><Warning size={40} color={theme.textSecondary} /></View>
                   <ThemedText style={[styles.placeholderText, { color: theme.textSecondary }]}>Image not available</ThemedText>
                </View>
                <View style={{ opacity: 0.1 }}><IceCream size={24} color={theme.textSecondary} /></View>
              </View>
              <View style={styles.patternRow}>
                <View style={{ opacity: 0.1 }}><Hamburger size={24} color={theme.textSecondary} /></View>
                <View style={{ opacity: 0.1 }}><CookingPot size={24} color={theme.textSecondary} /></View>
                <View style={{ opacity: 0.1 }}><Pizza size={24} color={theme.textSecondary} /></View>
              </View>
            </View>
          )}
        </View>

        {/* Item Header */}
        <View style={styles.itemHeader}>
          <View style={styles.nameRow}>
            <View style={[styles.vegIndicator, { borderColor: theme.success }]}>
               <View style={[styles.innerCircle, { backgroundColor: theme.success }]} />
            </View>
            <ThemedText style={[styles.itemName, { color: theme.text }]}>{item.name}</ThemedText>
          </View>
          <ThemedText style={[styles.itemPrice, { color: theme.text }]}>₹{item.price}</ThemedText>
        </View>
 
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          {item.description || 'No description added'}
        </ThemedText>
 
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
 
        {/* Stock Toggle */}
        <View style={[styles.toggleRow, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <ThemedText style={[styles.toggleLabel, { color: theme.text }]}>Item in stock</ThemedText>
          <PremiumSwitch 
            value={item.isInStock} 
            onValueChange={onToggleStock} 
            activeColor={theme.success}
          />
        </View>
 
        {/* Note */}
        <View style={styles.noteContainer}>
          <ThemedText style={[styles.noteText, { color: theme.textSecondary }]}>
            <ThemedText style={{ fontWeight: '800', color: theme.text }}>Note: </ThemedText>
            Marking the item out of stock will not affect this or any live order. Once done, the item will not be available for future orders.
          </ThemedText>
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  imageArea: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  patternRow: {
    flexDirection: 'row',
    width: '120%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  centerIcon: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '700',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vegIndicator: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    ...Typography.H2,
    fontSize: 22,
    fontWeight: '900',
  },
  itemPrice: {
    ...Typography.H2,
    fontSize: 22,
    fontWeight: '900',
  },
  description: {
    ...Typography.BodyRegular,
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  divider: {
    height: 1.5,
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  toggleLabel: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '700',
  },
  noteContainer: {
    marginTop: 0,
    paddingHorizontal: 4,
  },
  noteText: {
    ...Typography.Caption,
    fontSize: 13,
    lineHeight: 20,
  },
});
