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
    <View style={[styles.itemCard, { borderBottomColor: theme.border + '15' }]}>
      <View style={styles.itemMainInfo}>
        <View style={styles.itemLeft}>
          <View style={[styles.vegIcon, { borderColor: item.isVeg ? '#22BA62' : '#E23744' }]}>
            <View style={[styles.vegDot, { backgroundColor: item.isVeg ? '#22BA62' : '#E23744' }]} />
          </View>
          <ThemedText style={[styles.itemName, { color: theme.text }]}>{item.name}</ThemedText>
          <ThemedText style={[styles.itemPrice, { color: theme.text }]}>₹{item.price}</ThemedText>
          {item.description && (
            <ThemedText style={[styles.itemDesc, { color: theme.textSecondary }]} numberOfLines={2}>
              {item.description}
            </ThemedText>
          )}
          
          <View style={styles.statusContainer}>
            {item.status === 'not-live' && (
              <View style={[styles.statusTag, { backgroundColor: '#E2374415' }]}>
                <ThemedText style={[styles.notLiveText, { color: '#E23744' }]}>not live</ThemedText>
              </View>
            )}
            {item.status === 'no-photo' && (
              <View style={[styles.statusTag, { backgroundColor: '#E5A50015' }]}>
                <ThemedText style={[styles.notLiveText, { color: '#E5A500' }]}>no photo</ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.itemRight}>
          <View style={[styles.imageArea, { backgroundColor: theme.surfaceSecondary }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <View style={styles.addPhotoPlaceholder}>
                <Camera size={26} color={theme.info} weight="duotone" />
                <ThemedText style={[styles.addPhotoText, { color: theme.info }]}>Add photo</ThemedText>
              </View>
            )}
            
            <View style={styles.addBtnWrapper}>
              <Pressable 
                style={({ pressed }) => [
                  styles.addBtn, 
                  { backgroundColor: '#FFF', transform: [{ scale: pressed ? 0.95 : 1 }] }
                ]}
              >
                <ThemedText style={styles.addBtnText}>+ ADD</ThemedText>
              </Pressable>
            </View>

            {item.imageUrl && (
              <View style={styles.imageCountBadge}>
                <Camera size={12} color="#FFF" weight="fill" />
                <ThemedText style={styles.imageCountText}>1</ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.actionLeft}>
          <Pressable style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.7 : 1 }]}>
            <ThumbsUp size={20} color={theme.textSecondary} weight="regular" />
            <ThemedText style={[styles.actionLabel, { color: theme.textSecondary }]}>Recommend</ThemedText>
          </Pressable>
        </View>
        <View style={styles.actionRight}>
          {!item.isInStock && (
            <ThemedText style={[styles.stockStatus, { color: theme.textSecondary }]}>
              Next available {item.outOfStockUntil?.split(',')[0]}
            </ThemedText>
          )}
          <View style={styles.stockControl}>
            <ThemedText style={[styles.inStockLabel, { color: theme.textSecondary }]}>
              {item.isInStock ? 'In stock' : 'Out of stock'}
            </ThemedText>
            <PremiumSwitch 
              value={item.isInStock} 
              onValueChange={(val) => onToggleStock?.(item.id, val)} 
              activeColor="#22BA62"
            />
          </View>
          <Pressable 
            style={({ pressed }) => [styles.editBtn, { opacity: pressed ? 0.7 : 1 }]} 
            onPress={() => onEdit?.(item)}
          >
            <PencilSimple size={22} color={theme.textSecondary} />
            <ThemedText style={[styles.actionLabel, { color: theme.textSecondary }]}>Edit</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  itemMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flex: 1,
    paddingRight: 16,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    letterSpacing: -0.2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  itemDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  notLiveText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRight: {
    width: 120,
    alignItems: 'center',
  },
  imageArea: {
    width: 114,
    height: 114,
    borderRadius: 16,
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
    gap: 6,
    paddingBottom: 15,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addBtnWrapper: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  addBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  addBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
    fontSize: 13,
    fontWeight: '700',
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stockStatus: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inStockLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
