import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MagnifyingGlass,
  Image as ImageIcon,
  SquaresFour,
  X,
  DotsThreeVertical,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { MOCK_INVENTORY } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';

// Extracted Components
import { PhotoPromoBanner } from '@/components/menu/PhotoPromoBanner';
import { MenuCategory } from '@/components/menu/MenuCategory';

export default function CatalogScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All items');
  const [activeFilter, setActiveFilter] = useState('Item not live');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Menu</ThemedText>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconButton}><MagnifyingGlass size={24} color={theme.text} /></Pressable>
            <Pressable style={styles.iconButton}><ImageIcon size={24} color={theme.text} /></Pressable>
            <Pressable style={styles.iconButton}><SquaresFour size={24} color={theme.text} /></Pressable>
          </View>
        </View>
        <View style={styles.restaurantRow}>
          <ThemedText style={[styles.restaurantName, { color: theme.text }]}>Muggs Cafe</ThemedText>
          <ThemedText style={[styles.restaurantSubtext, { color: theme.textSecondary }]}>Cafe, Pizza</ThemedText>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PhotoPromoBanner />

        {/* Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            <Pressable 
              onPress={() => setActiveFilter('Item not live')}
              style={({ pressed }) => [
                styles.filterPill, 
                activeFilter === 'Item not live' && { borderColor: theme.text, backgroundColor: theme.surfaceSecondary },
                { backgroundColor: theme.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <ThemedText style={[styles.filterLabel, { color: theme.text }]}>Item not live</ThemedText>
              <View style={[styles.countBadge, { backgroundColor: '#E23744' }]}><ThemedText style={styles.countText}>1</ThemedText></View>
              {activeFilter === 'Item not live' && <X size={14} color={theme.text} weight="bold" style={{ marginLeft: 6 }} />}
            </Pressable>

            <Pressable 
              onPress={() => setActiveFilter('Out of stock')}
              style={({ pressed }) => [
                styles.filterPill, 
                activeFilter === 'Out of stock' && { borderColor: theme.text, backgroundColor: theme.surfaceSecondary },
                { backgroundColor: theme.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <ThemedText style={[styles.filterLabel, { color: theme.text }]}>Out of stock</ThemedText>
              <View style={[styles.countBadge, { backgroundColor: '#E23744' }]}><ThemedText style={styles.countText}>1</ThemedText></View>
              {activeFilter === 'Out of stock' && <X size={14} color={theme.text} weight="bold" style={{ marginLeft: 6 }} />}
            </Pressable>

            <Pressable style={({ pressed }) => [styles.filterPill, { backgroundColor: theme.surface, opacity: pressed ? 0.8 : 1 }]}>
              <SquaresFour size={18} color={theme.text} weight="regular" />
              <ThemedText style={[styles.filterLabel, { color: theme.text, marginLeft: 6 }]}>Filter</ThemedText>
            </Pressable>
          </ScrollView>

          {/* Guidance Tooltip */}
          {activeFilter === 'Item not live' && (
            <View style={[styles.tooltip, styles.shadowMedium, { backgroundColor: '#FFD75E' }]}>
              <ThemedText style={styles.tooltipText}>Below Items are not live.</ThemedText>
              <View style={[styles.tooltipArrow, { borderBottomColor: '#FFD75E' }]} />
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={[styles.tabsWrapper, { borderBottomColor: theme.border + '15' }]}>
          <Pressable 
            onPress={() => setActiveTab('All items')}
            style={[styles.tab, activeTab === 'All items' && { backgroundColor: theme.surfaceSecondary }]}
          >
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'All items' ? theme.text : theme.textSecondary }]}>All items</ThemedText>
          </Pressable>
          <Pressable 
            onPress={() => setActiveTab('Add-ons')}
            style={[styles.tab, activeTab === 'Add-ons' && { backgroundColor: theme.surfaceSecondary }]}
          >
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'Add-ons' ? theme.text : theme.textSecondary }]}>Add-ons</ThemedText>
          </Pressable>
        </View>

        {/* Menu Categories */}
        {MOCK_INVENTORY.slice(0, 1).map(category => (
          <MenuCategory 
            key={category.id} 
            category={category} 
            onToggleCategory={(id, active) => console.log('Toggle category', id, active)}
            onToggleItemStock={(catId, itemId, inStock) => console.log('Toggle item stock', catId, itemId, inStock)}
          />
        ))}
      </ScrollView>

      {/* Floating Menu Button */}
      <Pressable style={({ pressed }) => [
        styles.floatingMenuBtn, 
        styles.shadowLarge,
        { backgroundColor: '#1C1C1E', borderColor: 'rgba(255,255,255,0.1)', transform: [{ scale: pressed ? 0.95 : 1 }] }
      ]}>
        <DotsThreeVertical size={20} color="#FFF" weight="bold" />
        <ThemedText style={styles.floatingMenuText}>MENU</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 18,
  },
  iconButton: {
    padding: 4,
  },
  restaurantRow: {
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  restaurantSubtext: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterSection: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 7,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  tooltip: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    position: 'relative',
  },
  tooltipText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tabsWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 6,
    borderBottomWidth: 1,
    paddingBottom: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  floatingMenuBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    gap: 10,
  },
  floatingMenuText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
});
