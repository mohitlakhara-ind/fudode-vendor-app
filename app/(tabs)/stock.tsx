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
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, fetchItems, fetchAddonGroups, updateItemStatus, updateAddonOption } from '@/store/slices/menuSlice';
import { MenuItemStatus } from '@/api/types';


export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories, items, addonGroups, itemsFetched, categoriesFetched, addonGroupsFetched, loading: menuLoading } = useAppSelector((state: RootState) => state.menu);
  
  useEffect(() => {
    if (!categoriesFetched) dispatch(fetchCategories());
    if (!itemsFetched) dispatch(fetchItems({}));
    if (!addonGroupsFetched) dispatch(fetchAddonGroups());
  }, [dispatch, categoriesFetched, itemsFetched, addonGroupsFetched]);

  const [activeTab, setActiveTab] = useState<'items' | 'addons'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const { queue } = useSelector((state: RootState) => state.order);

  // Map Redux items to InventoryCategory format
  const inventory = useMemo(() => {
    return categories.map(cat => {
      const catItems = items.filter(item => item.categoryId === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        subtitle: cat.parentCategoryId ? 'Sub Category' : 'Main Category',
        isActive: catItems.some(i => i.status === MenuItemStatus.AVAILABLE),
        items: catItems.map(i => ({
          id: i.id,
          name: i.name,
          isVeg: i.foodType === 'VEG',
          isInStock: i.status === MenuItemStatus.AVAILABLE,
          price: i.variants?.[0]?.price || 0,
          description: i.description,
          imageUrl: i.imageUrl,
          status: i.isLive ? 'live' : 'not-live',
          categoryName: cat.name,
        }))
      };
    }).filter(cat => cat.items.length > 0);
  }, [categories, items]);

  // Map Addon Groups to InventoryCategory format
  const addons = useMemo(() => {
    return addonGroups.map(group => ({
      id: group.id,
      name: group.name,
      subtitle: `Min ${group.minSelect} & Max ${group.maxSelect}`,
      isActive: group.addons.some(a => a.status === 'AVAILABLE'),
      items: group.addons.map(a => ({
        id: a.id,
        name: a.name,
        isVeg: true, // Addons are typically veg or neutral in this UI
        isInStock: a.status === 'AVAILABLE',
        price: a.price,
        categoryName: group.name,
      }))
    }));
  }, [addonGroups]);

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
    if (activeTab === 'items') {
      const catItems = items.filter(i => i.categoryId === catId);
      catItems.forEach(item => {
        dispatch(updateItemStatus({ id: item.id, status: MenuItemStatus.AVAILABLE }));
      });
    } else {
      const group = addonGroups.find(g => g.id === catId);
      group?.addons.forEach(addon => {
        dispatch(updateAddonOption({ optionId: addon.id, details: { status: 'AVAILABLE' } }));
      });
    }
  };

  const handleToggleItem = (catId: string, itemId: string) => {
    const category = currentData.find(c => c.id === catId);
    const item = category?.items.find(i => i.id === itemId);

    if (item?.isInStock) {
      // In stock items need to be marked out of stock via the sheet
      setActiveItem({ ...item, catId });
      setSheetType('item');
      setShowStockSheet(true);
      return;
    }

    // Turning ON - direct dispatch
    if (activeTab === 'items') {
      dispatch(updateItemStatus({ id: itemId, status: MenuItemStatus.AVAILABLE }));
    } else {
      dispatch(updateAddonOption({ optionId: itemId, details: { status: 'AVAILABLE' } }));
    }
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
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
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
          if (sheetType === 'item') {
            if (activeTab === 'items') {
              dispatch(updateItemStatus({ id: activeItem.id, status: MenuItemStatus.SOLD_OUT }));
            } else {
              dispatch(updateAddonOption({ optionId: activeItem.id, details: { status: 'SOLD_OUT' } }));
            }
          } else {
            // Bulk marking out of stock for category/group
            if (activeTab === 'items') {
              const catItems = items.filter(i => i.categoryId === activeCategory.id);
              catItems.forEach(item => {
                dispatch(updateItemStatus({ id: item.id, status: MenuItemStatus.SOLD_OUT }));
              });
            } else {
              activeCategory.items.forEach((item: any) => {
                dispatch(updateAddonOption({ optionId: item.id, details: { status: 'SOLD_OUT' } }));
              });
            }
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
    </AnimatedPage>
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
