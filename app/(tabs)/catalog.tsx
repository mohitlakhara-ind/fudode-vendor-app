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
  DotsThreeVertical,
  Plus,
  List,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { MOCK_INVENTORY } from '@/constants/mockInventory';
import { ThemedText } from '@/components/themed-text';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';

// Extracted Components
import { PhotoPromoBanner } from '@/components/menu/PhotoPromoBanner';
import { MenuCategory } from '@/components/menu/MenuCategory';
import { MarkOutOfStockSheet } from '@/components/inventory/MarkOutOfStockSheet';
import { CategoriesBottomSheet } from '@/components/menu/CategoriesBottomSheet';
import { AddItemActionSheet } from '@/components/menu/AddItemActionSheet';
import { SearchBar } from '@/components/orders/SearchBar';
import { InventoryCategory } from '@/constants/mockInventory';

const OWNED_RESTAURANTS = [
  { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
  { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
];

export default function CatalogScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All items');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(MOCK_INVENTORY[0].id);
  const [inventory, setInventory] = useState<InventoryCategory[]>(MOCK_INVENTORY);
  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const { queue } = useSelector((state: RootState) => state.order);

  // Bottom Sheet States
  const [showStockSheet, setShowStockSheet] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [sheetType, setSheetType] = useState<'item' | 'subcategory'>('item');
  const [categoriesSheetVisible, setCategoriesSheetVisible] = useState(false);
  const [addItemSheetVisible, setAddItemSheetVisible] = useState(false);

  const handleToggleCategory = (catId: string, isActive: boolean) => {
    const category = inventory.find(c => c.id === catId);
    if (!isActive && category) { // Turning OFF
      setActiveCategory(category);
      setSheetType('subcategory');
      setShowStockSheet(true);
      return;
    }
    // Turning ON
    setInventory(prev => prev.map(cat => 
      cat.id === catId ? { 
        ...cat, 
        isActive: true,
        items: cat.items.map(i => ({ ...i, isInStock: true }))
      } : cat
    ));
  };

  const handleToggleItemStatus = (catId: string, itemId: string, isInStock: boolean) => {
    const category = inventory.find(c => c.id === catId);
    const item = category?.items.find(i => i.id === itemId);

    if (!isInStock && item) { // Turning OFF
      setActiveItem({ ...item, catId });
      setSheetType('item');
      setShowStockSheet(true);
      return;
    }
    // Turning ON
    setInventory(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        isActive: true,
        items: cat.items.map(i => i.id === itemId ? { ...i, isInStock: true } : i)
      };
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <RestaurantHeader
        restaurantName={currentRestaurant.name}
        locality={currentRestaurant.locality}
        isOnline={isOnline}
        onToggleStatus={() => setIsOnline(!isOnline)}
        onPressInfo={() => setIsSwitcherVisible(true)}
      />

      <RestaurantSwitcher
        visible={isSwitcherVisible}
        onClose={() => setIsSwitcherVisible(false)}
        restaurants={OWNED_RESTAURANTS}
        selectedId={currentRestaurant.id}
        onSelect={(res) => {
          setCurrentRestaurant(res);
          setIsSwitcherVisible(false);
        }}
      />

      <ScrollView 
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: queue.length > 0 ? 220 : 100 }}
      >
        <PhotoPromoBanner />

        {/* Unified Search & Filters */}
        <View style={[styles.headerActions, { backgroundColor: theme.background }]}>
          <View style={styles.topSearchRow}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search items, categories..."
              onFilterPress={() => {}}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFilters}>
            {['All', 'Not Live', 'Out of Stock', 'Veg Only'].map(filter => (
              <Pressable 
                key={filter}
                onPress={() => setActiveFilter(filter.toLowerCase())}
                style={[
                  styles.quickFilterPill,
                  { backgroundColor: activeFilter === filter.toLowerCase() ? theme.text : theme.surface }
                ]}
              >
                <ThemedText style={[styles.quickFilterText, { color: activeFilter === filter.toLowerCase() ? theme.background : theme.textSecondary }]}>
                  {filter}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <TabSwitcher
          tabs={['All items', 'Add-ons']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerStyle={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}
        />

        {/* Menu Categories */}
        {inventory.map(category => (
          <MenuCategory 
            key={category.id} 
            category={category} 
            onToggleCategory={handleToggleCategory}
            onToggleItemStock={handleToggleItemStatus}
            onEditItem={(item, cat) => {
              router.push({
                pathname: '/menu/item-details',
                params: { categoryName: cat.name, subCategoryName: 'Edit Item', itemId: item.id }
              } as any);
            }}
          />
        ))}
      </ScrollView>

      <MarkOutOfStockSheet
        visible={showStockSheet}
        type={sheetType}
        itemTitle={sheetType === 'item' ? activeItem?.name : activeCategory?.name}
        itemSubtitle={sheetType === 'item' ? activeItem?.categoryName : undefined}
        onClose={() => setShowStockSheet(false)}
        onConfirm={(data) => {
          console.log('Catalog marking out of stock:', data);
          if (sheetType === 'item') {
            setInventory(prev => prev.map(cat => {
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
            setInventory(prev => prev.map(cat =>
              cat.id === activeCategory.id ? { 
                ...cat, 
                isActive: false,
                items: cat.items.map(i => ({ ...i, isInStock: false })) 
              } : cat
            ));
          }
          setShowStockSheet(false);
        }}
      />

      <CategoriesBottomSheet
        visible={categoriesSheetVisible}
        categories={inventory.map(c => ({ id: c.id, name: c.name, count: c.items.length }))}
        activeCategoryId={activeCategoryId}
        onClose={() => setCategoriesSheetVisible(false)}
        onSelectCategory={setActiveCategoryId}
      />

      <AddItemActionSheet
        visible={addItemSheetVisible}
        onClose={() => setAddItemSheetVisible(false)}
        onAddItem={() => router.push('/menu/add-item' as any)}
        onAddCategory={() => console.log('Add category')}
        onAddSubCategory={() => console.log('Add sub category')}
      />

      {/* Floating Actions */}
      <View style={[styles.floatingActionsWrapper, { bottom: queue.length > 0 ? 220 : 120 }]}>
        <Pressable 
          onPress={() => setCategoriesSheetVisible(true)}
          style={({ pressed }) => [
            styles.categoryFab, 
            styles.shadowLarge,
            { backgroundColor: theme.surface, borderColor: theme.border, transform: [{ scale: pressed ? 0.9 : 1 }] }
          ]}
        >
          <List size={22} color={theme.text} weight="bold" />
          <ThemedText style={[styles.categoryFabText, { color: theme.text }]}>Categories</ThemedText>
        </Pressable>

        <Pressable 
          onPress={() => setAddItemSheetVisible(true)}
          style={({ pressed }) => [
            styles.addFab, 
            styles.shadowLarge,
            { backgroundColor: theme.text, transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
        >
          <Plus size={22} color={theme.background} weight="bold" />
          <ThemedText style={[styles.addFabText, { color: theme.background }]}>ADD ITEM</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  restaurantSubtext: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerActions: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  topSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  quickFilterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  quickFilterText: {
    fontSize: 13,
    fontWeight: '800',
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
  floatingActionsWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  categoryFab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 26,
    gap: 10,
    borderWidth: 1,
  },
  categoryFabText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  addFab: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 26,
    gap: 8,
  },
  addFabText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
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
