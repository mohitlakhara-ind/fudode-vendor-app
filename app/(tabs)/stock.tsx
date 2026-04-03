import { InventoryCategoryCard } from '@/components/inventory/InventoryCategoryCard';
import { ItemDetailsSheet } from '@/components/inventory/ItemDetailsSheet';
import { MarkOutOfStockSheet } from '@/components/inventory/MarkOutOfStockSheet';
import { StockFilterSheet } from '@/components/inventory/StockFilterSheet';
import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { SearchBar } from '@/components/orders/SearchBar';
import { ThemedText } from '@/components/themed-text';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { InventoryCategory, MOCK_ADDONS, MOCK_INVENTORY } from '@/constants/mockInventory';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import { List, MagnifyingGlass, WarningCircle } from 'phosphor-react-native';
import { EmptyState } from '@/components/ui/EmptyState';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';


export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const router = useRouter();
  const { status: restaurantStatus } = useSelector((state: RootState) => state.restaurant);
  const [activeTab, setActiveTab] = useState<'items' | 'addons'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const { queue } = useSelector((state: RootState) => state.order);

  const [inventory, setInventory] = useState<InventoryCategory[]>(MOCK_INVENTORY);
  const [addons, setAddons] = useState<InventoryCategory[]>(MOCK_ADDONS);

  // Bottom Sheet States
  const [showStockSheet, setShowStockSheet] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [sheetType, setSheetType] = useState<'item' | 'subcategory'>('item');

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'out_of_stock' | 'in_stock'>('all');
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);

  const currentData = activeTab === 'items' ? inventory : addons;

  const filteredData = currentData.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'out_of_stock' && !item.isInStock) ||
        (selectedFilter === 'in_stock' && item.isInStock);
      return matchesSearch && matchesFilter;
    })
  })).filter(cat => cat.items.length > 0);

  const handleToggleCategory = (catId: string) => {
    const category = currentData.find(c => c.id === catId);
    if (category?.isActive) {
      setActiveCategory(category);
      setSheetType('subcategory');
      setShowStockSheet(true);
      return;
    }

    // Turning ON
    const updateFn = activeTab === 'items' ? setInventory : setAddons;
    updateFn(prev => prev.map(cat =>
      cat.id === catId ? {
        ...cat,
        isActive: true,
        items: cat.items.map(i => ({ ...i, isInStock: true }))
      } : cat
    ));
  };

  const handleToggleItem = (catId: string, itemId: string) => {
    const category = currentData.find(c => c.id === catId);
    const item = category?.items.find(i => i.id === itemId);

    if (item?.isInStock) {
      setActiveItem({ ...item, catId });
      setSheetType('item');
      setShowStockSheet(true);
      return;
    }

    // Turning ON
    const updateFn = activeTab === 'items' ? setInventory : setAddons;
    updateFn(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        isActive: true, // Turn category ON if any item is turned ON
        items: cat.items.map(i =>
          i.id === itemId ? { ...i, isInStock: true } : i
        )
      };
    }));
  };

  const handlePressItem = (catId: string, itemId: string) => {
    const category = currentData.find(c => c.id === catId);
    const item = category?.items.find(i => i.id === itemId);
    if (item) {
      setDetailItem({ ...item, catId });
      setShowItemDetails(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <GlobalRestaurantHeader />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <TabSwitcher
          tabs={['All items', 'Add-ons']}
          counts={{
            'All items': inventory.reduce((acc, cat) => acc + cat.items.length, 0),
            'Add-ons': addons.reduce((acc, cat) => acc + cat.items.length, 0)
          }}
          activeTab={activeTab === 'items' ? 'All items' : 'Add-ons'}
          onTabChange={(tab: string) => setActiveTab(tab === 'All items' ? 'items' : 'addons')}
          containerStyle={{ marginVertical: 16 }}
        />

        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in menu..."
            onFilterPress={() => setShowFilterSheet(true)}
          />
          <View style={styles.searchMeta}>
            <ThemedText style={[styles.resultsCount, { color: theme.textSecondary }]}>
              Showing {filteredData.reduce((acc, cat) => acc + cat.items.length, 0)} items
            </ThemedText>
            <TouchableOpacity onPress={() => { }} style={styles.manageMenuLink}>
              <ThemedText style={[styles.manageMenuText, { color: theme.primary }]}>Manage Menu</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          {filteredData.length > 0 ? (
            filteredData.map(category => (
              <InventoryCategoryCard
                key={category.id}
                category={category}
                onToggleCategory={handleToggleCategory}
                onToggleItem={handleToggleItem}
                onPressItem={handlePressItem}
              />
            ))
          ) : (
            <EmptyState
              icon={searchQuery ? MagnifyingGlass : WarningCircle}
              title={searchQuery ? "No results found" : "Inventory is empty"}
              description={searchQuery 
                ? `We couldn't find any items matching "${searchQuery}". Try a different search term.` 
                : "You don't have any items in your inventory yet."
              }
              actionLabel={searchQuery ? "Clear Search" : "Add Your First Item"}
              onAction={() => searchQuery ? setSearchQuery('') : router.push('/catalog')}
              style={{ marginTop: 40 }}
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.menuFab, { bottom: queue.length > 0 ? 220 : 120 }]} activeOpacity={0.8} onPress={() => router.push('/catalog')} >
        <View style={{ ...styles.menuFabContent, backgroundColor: theme.surface }}>
          <List size={20} color={theme.text} weight="bold" />
          <ThemedText style={{ ...styles.menuFabText, color: theme.text }}>Menu</ThemedText>
        </View>
      </TouchableOpacity>

      <MarkOutOfStockSheet
        visible={showStockSheet}
        type={sheetType}
        itemTitle={sheetType === 'item' ? activeItem?.name : activeCategory?.name}
        itemSubtitle={sheetType === 'item' ? activeItem?.categoryName : undefined}
        onClose={() => setShowStockSheet(false)}
        onConfirm={(data) => {
          console.log('Marking out of stock:', data);
          if (sheetType === 'item') {
            const updateFn = activeTab === 'items' ? setInventory : setAddons;
            updateFn(prev => prev.map(cat => {
              if (cat.id !== activeItem.catId) return cat;

              const updatedItems = cat.items.map(i =>
                i.id === activeItem.id ? { ...i, isInStock: false } : i
              );

              // If all items are now out of stock, turn OFF the category
              const allOutOfStock = updatedItems.every(i => !i.isInStock);

              return {
                ...cat,
                isActive: allOutOfStock ? false : cat.isActive,
                items: updatedItems
              };
            }));
          } else {
            const updateFn = activeTab === 'items' ? setInventory : setAddons;
            updateFn(prev => prev.map(cat =>
              cat.id === activeCategory.id ? {
                ...cat,
                isActive: false,
                items: cat.items.map(i => ({ ...i, isInStock: false })) // Turn OFF all items
              } : cat
            ));
          }
          setShowStockSheet(false);
        }}
      />

      <StockFilterSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        selectedFilter={selectedFilter}
        onApply={(filter) => {
          setSelectedFilter(filter);
          setShowFilterSheet(false);
        }}
      />

      <ItemDetailsSheet
        visible={showItemDetails}
        onClose={() => setShowItemDetails(false)}
        item={detailItem}
        onToggleStock={(inStock) => {
          if (detailItem) {
            handleToggleItem(detailItem.catId, detailItem.id);
            setDetailItem({ ...detailItem, isInStock: inStock });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  tabScrollView: {
    marginHorizontal: -16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
    paddingBottom: 8,
    gap: 2,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  resultsCount: {
    ...Typography.Caption,
    fontSize: 13,
  },
  manageMenuLink: {
    paddingVertical: 4,
  },
  manageMenuText: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  menuFab: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuFabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    gap: 10,
  },
  menuFabText: {
    ...Typography.H3,
  }
});
