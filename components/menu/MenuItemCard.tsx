import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { ThumbsUp, Camera, PencilSimple } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { InventoryItem } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

interface MenuItemCardProps {
  item: InventoryItem;
  onToggleStock?: (id: string, inStock: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
}

export const MenuItemCard = ({ item, onToggleStock, onEdit }: MenuItemCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.itemMainInfo}>
        <View style={styles.itemLeft}>
          <View style={styles.topRow}>
            <View style={[styles.vegIcon, { borderColor: item.isVeg ? theme.success : theme.error }]}>
              <View style={[styles.vegDot, { backgroundColor: item.isVeg ? theme.success : theme.error }]} />
            </View>
            <ThemedText style={[styles.itemPrice, { color: theme.text }]}>₹{item.price}</ThemedText>
          </View>
          
          <ThemedText style={[styles.itemName, { color: theme.text }]}>{item.name}</ThemedText>
          
          {item.description && (
            <ThemedText style={[styles.itemDesc, { color: theme.textSecondary }]} numberOfLines={2}>
              {item.description}
            </ThemedText>
          )}
          
          <View style={styles.statusContainer}>
            {item.status === 'not-live' && (
              <View style={[styles.statusTag, { backgroundColor: theme.error + '15' }]}>
                <ThemedText style={[styles.notLiveText, { color: theme.error }]}>not live</ThemedText>
              </View>
            )}
            {item.status === 'no-photo' && (
              <View style={[styles.statusTag, { backgroundColor: theme.primary + '15' }]}>
                <ThemedText style={[styles.notLiveText, { color: theme.primary }]}>no photo</ThemedText>
              </View>
            )}
            {!item.isInStock && (
              <View style={[styles.statusTag, { backgroundColor: theme.border + '20' }]}>
                <ThemedText style={[styles.notLiveText, { color: theme.textSecondary }]}>out of stock</ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.itemRight}>
          <View style={[styles.imageArea, { backgroundColor: theme.surfaceSecondary }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={[styles.itemImage, !item.isInStock && { opacity: 0.5 }]} resizeMode="cover" />
            ) : (
              <View style={styles.addPhotoPlaceholder}>
                <Camera size={26} color={theme.info} weight="bold" />
                <ThemedText style={[styles.addPhotoText, { color: theme.info }]}>Add photo</ThemedText>
              </View>
            )}
            

            {item.imageUrl && (
              <View style={styles.imageCountBadge}>
                <Camera size={12} color={theme.background} weight="fill" />
                <ThemedText style={[styles.imageCountText, { color: theme.background }]}>1</ThemedText>
              </View>
            )}

            {!item.isInStock && (
              <View style={[styles.outOfStockOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <ThemedText style={[styles.outOfStockOverlayText, { color: '#FFF' }]}>PAUSED</ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.itemActions, { borderTopColor: theme.border }]}>
        <View style={styles.actionLeft}>
          <Pressable style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.7 : 1 }]}>
            <ThumbsUp size={18} color={theme.textSecondary} weight="regular" />
            <ThemedText style={[styles.actionLabel, { color: theme.textSecondary }]}>Recommend</ThemedText>
          </Pressable>
        </View>
        <View style={styles.actionRight}>
          <View style={styles.stockControl}>
            <ThemedText style={[styles.inStockLabel, { color: theme.textSecondary }]}>
              {item.isInStock ? 'In stock' : 'Out of stock'}
            </ThemedText>
            <PremiumSwitch 
              value={item.isInStock} 
              onValueChange={(val) => onToggleStock?.(item.id, val)} 
              activeColor={theme.success}
            />
          </View>
          <Pressable 
            style={({ pressed }) => [styles.editBtn, { opacity: pressed ? 0.7 : 1 }]} 
            onPress={() => onEdit?.(item)}
          >
            <PencilSimple size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  itemMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flex: 1,
    paddingRight: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
  },
  itemDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  notLiveText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRight: {
    width: 110,
    alignItems: 'center',
  },
  imageArea: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  addPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '800',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    gap: 3,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlayText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inStockLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  editBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});
