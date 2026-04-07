import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/EmptyState';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCategory, deleteCategory, fetchAddonGroups, fetchCategories, fetchItems, updateItemStatus, updateCategory } from '@/store/slices/menuSlice';
import { RootState } from '@/store/store';
import { MenuItemStatus } from '@/api/types';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  List,
  Plus,
} from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Extracted Components
import { MarkOutOfStockSheet } from '@/components/inventory/MarkOutOfStockSheet';
import { AddItemActionSheet } from '@/components/menu/AddItemActionSheet';
import { CategoriesBottomSheet } from '@/components/menu/CategoriesBottomSheet';
import { MenuCategory } from '@/components/menu/MenuCategory';
import { PhotoPromoBanner } from '@/components/menu/PhotoPromoBanner';
import { SearchBar } from '@/components/orders/SearchBar';
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import { InputDialog } from '@/components/ui/InputDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MessageDialog } from '@/components/ui/MessageDialog';
import { InventoryCategory } from '@/constants/mockInventory';

export default function CatalogScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState('All items');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { categories, items, addonGroups, loading, categoriesFetched, itemsFetched, addonGroupsFetched } = useAppSelector((state: RootState) => state.menu);
  const { status: restaurantStatus } = useAppSelector((state: RootState) => state.restaurant);
  const { queue } = useAppSelector((state: RootState) => state.order);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    if (!categoriesFetched) {
      dispatch(fetchCategories());
    }
    // Always fetch addon groups if they haven't been fetched yet
    // to ensure they are available for the "Add Item" flow
    if (!addonGroupsFetched) {
      dispatch(fetchAddonGroups());
    }
  }, [dispatch, categoriesFetched, addonGroupsFetched]);

  // Fetch items for ALL categories to populate the simplified unified menu view
  useEffect(() => {
    if (categories && categories.length > 0 && activeTab === 'All items') {
      // Fetch all items if they haven't been fetched yet
      if (!itemsFetched && !loading) {
        dispatch(fetchItems({}));
      }
    }
  }, [categories, dispatch, loading, itemsFetched, activeTab]);

  // Map and group items by category (Hierarchical)
  const inventory: InventoryCategory[] = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];

    // 1. Separate Root Categories from Subcategories
    const rootCats = categories.filter(cat => cat && !cat.parentCategoryId);
    const subCats = categories.filter(cat => cat && cat.parentCategoryId);

    // 2. Build the tree
    return rootCats.map(root => {
      // Find direct items (those belonging to the root category)
      const directItems = (items || [])
        .filter(item => item && item.categoryId === root.id)
        .map(item => ({
          id: item.id,
          name: item.name,
          isVeg: item.foodType === 'VEG',
          isInStock: item.status !== 'HIDDEN', // Toggle ON for AVAILABLE/SOLD_OUT
          price: item.variants?.[0]?.price || 0,
          description: item.description,
          imageUrl: item.imageUrl,
          status: (item.status === 'HIDDEN' ? 'not-live' : (item.imageUrl ? 'live' : 'no-photo')) as any,
          backendStatus: item.status, // Preserve real status
        }));

      // Find children categories and their items
      const children = subCats
        .filter(sc => sc.parentCategoryId === root.id)
        .map(sc => ({
          id: sc.id,
          name: sc.name,
          items: (items || [])
            .filter(item => item && item.categoryId === sc.id)
            .map(item => ({
              id: item.id,
              name: item.name,
              isVeg: item.foodType === 'VEG',
              isInStock: item.status !== 'HIDDEN',
              price: item.variants?.[0]?.price || 0,
              description: item.description,
              imageUrl: item.imageUrl,
              status: (item.status === 'HIDDEN' ? 'not-live' : (item.imageUrl ? 'live' : 'no-photo')) as any,
              backendStatus: item.status,
            }))
        }))
        .filter(sc => sc.items.length > 0 || true); // Keep if it has items or just for structure

      return {
        id: root.id,
        name: root.name,
        subtitle: '',
        isActive: root.status === 'ACTIVE',
        items: directItems,
        subCategories: children
      };
    });
  }, [categories, items]);

  useEffect(() => {
    if (inventory.length > 0 && !activeCategoryId) {
      setActiveCategoryId(inventory[0].id);
    }
  }, [inventory, activeCategoryId]);

  // Bottom Sheet States
  const [showStockSheet, setShowStockSheet] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [sheetType, setSheetType] = useState<'item' | 'subcategory'>('item');
  const [categoriesSheetVisible, setCategoriesSheetVisible] = useState(false);
  const [addItemSheetVisible, setAddItemSheetVisible] = useState(false);
  
  // Custom Modal States
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [pendingDeleteMessage, setPendingDeleteMessage] = useState('');
  const [errorModal, setErrorModal] = useState({ visible: false, title: '', message: '' });

  const handleToggleCategory = (catId: string, isActive: boolean) => {
    dispatch(updateCategory({ 
      id: catId, 
      details: { status: isActive ? 'ACTIVE' as any : 'INACTIVE' as any } 
    }));
  };

  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = async (deleteItems = false) => {
    if (!categoryToDelete) return;
    
    setIsProcessing(true);
    const result = await dispatch(deleteCategory({ id: categoryToDelete, params: { deleteItems } }) as any);
    setIsProcessing(false);
    
    if (deleteCategory.rejected.match(result)) {
      const errorData = result.payload as any;
      if (errorData?.data?.totalItems > 0) {
        setPendingDeleteMessage((typeof errorData === 'string' ? errorData : errorData?.message) || 'This category has items.');
        setShowDeleteConfirm(false);
        setTimeout(() => setShowBulkDeleteConfirm(true), 300);
      } else {
        setErrorModal({ visible: true, title: 'Error', message: (typeof errorData === 'string' ? errorData : errorData?.message) || errorData?.error || 'Failed to delete category' });
      }
    } else {
      setShowDeleteConfirm(false);
      setShowBulkDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const handleCreateCategory = async (name: string) => {
    setIsProcessing(true);
    try {
      await dispatch(createCategory({ name })).unwrap();
      setShowCreateCategoryModal(false);
    } catch (error: any) {
      setErrorModal({ visible: true, title: 'Error', message: error || error?.message || 'Failed to create category' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleItemStatus = (catId: string, itemId: string, isLive: boolean) => {
    // Toggling Visibility (Live vs Hidden)
    dispatch(updateItemStatus({ 
      id: itemId, 
      status: isLive ? MenuItemStatus.AVAILABLE : MenuItemStatus.HIDDEN 
    }));
  };

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <GlobalRestaurantHeader />

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
              onFilterPress={() => { }}
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

        {activeTab === 'All items' ? (
          /* Menu Categories */
          inventory.length > 0 ? (
            inventory.map(category => (
              <MenuCategory
                key={category.id}
                category={category}
                onToggleCategory={handleToggleCategory}
                onToggleItemStock={handleToggleItemStatus}
                onDeleteCategory={handleDeleteCategory}
                onEditItem={(item, cat) => {
                  router.push({
                    pathname: '/menu/item-details',
                    params: { categoryName: cat.name, subCategoryName: 'Edit Item', itemId: item.id }
                  } as any);
                }}
              />
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Your Menu is Empty"
              description="Start by adding your first category and item to show up on the customer app."
              actionLabel="Add First Item"
              onAction={() => router.push('/menu/add-item' as any)}
              style={{ marginTop: 40, marginBottom: 100 }}
            />
          )
        ) : (
          /* Add-ons Tab Content */
          <View style={{ padding: 16 }}>
            {addonGroups && addonGroups.length > 0 ? (
              addonGroups.filter(g => !!g).map(group => (
                <Pressable 
                  key={group.id} 
                  onPress={() => router.push({ pathname: '/menu/addon-group-details', params: { id: group.id } })}
                  style={[styles.addonGroupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.addonGroupHeader}>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.addonGroupName}>{group.name}</ThemedText>
                      <ThemedText style={styles.addonGroupDetails}>
                        Select {group.minSelect} to {group.maxSelect} items
                      </ThemedText>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <ThemedText style={[styles.addonGroupBadge, { backgroundColor: theme.primary + '20', color: theme.primary }]}>
                        {group.isRequired ? 'Required' : 'Optional'}
                      </ThemedText>
                      <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>Edit</ThemedText>
                    </View>
                  </View>
                  {(group.addons || []).length > 0 && (
                    <View style={{ marginTop: 12, gap: 4 }}>
                      {(group.addons || []).slice(0, 3).map((addon: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textSecondary }} />
                          <ThemedText style={{ fontSize: 13, color: theme.textSecondary }}>{addon.name}</ThemedText>
                        </View>
                      ))}
                      {(group.addons || []).length > 3 && (
                        <ThemedText style={{ fontSize: 11, color: theme.primary, fontWeight: '700', marginLeft: 10 }}>
                          +{(group.addons || []).length - 3} MORE
                        </ThemedText>
                      )}
                    </View>
                  )}
                </Pressable>
              ))
            ) : (
              <EmptyState
                icon={Plus}
                title="No Add-on Groups"
                description="Add-on groups like Extra Toppings or Dips help increase your order value."
                actionLabel="Create Add-on Group"
                onAction={() => console.log('Add addon group')}
                style={{ marginTop: 40 }}
              />
            )}
          </View>
        )}
      </ScrollView>

      <MarkOutOfStockSheet
        visible={showStockSheet}
        type={sheetType}
        itemTitle={sheetType === 'item' ? activeItem?.name : activeCategory?.name}
        itemSubtitle={sheetType === 'item' ? activeItem?.categoryName : undefined}
        onClose={() => setShowStockSheet(false)}
        onConfirm={(data) => {
          if (sheetType === 'item' && activeItem) {
            dispatch(updateItemStatus({ id: activeItem.id, status: MenuItemStatus.SOLD_OUT }));
          }
          setShowStockSheet(false);
        }}
      />

      <CategoriesBottomSheet
        visible={categoriesSheetVisible}
        categories={(inventory || []).map(c => ({ id: c.id, name: c.name, count: (c.items || []).length }))}
        activeCategoryId={activeCategoryId || ''}
        onClose={() => setCategoriesSheetVisible(false)}
        onSelectCategory={(id) => setActiveCategoryId(id)}
      />

      <AddItemActionSheet
        visible={addItemSheetVisible}
        onClose={() => setAddItemSheetVisible(false)}
        onAddItem={() => {
          setAddItemSheetVisible(false);
          router.push('/menu/add-item' as any);
        }}
        onAddCategory={() => {
          setAddItemSheetVisible(false);
          setTimeout(() => setShowCreateCategoryModal(true), 400);
        }}
        onAddSubCategory={() => {
          setAddItemSheetVisible(false);
          router.push('/menu/add-item' as any); // Redirect to add item flow which forces sub-category selection
        }}
        onAddAddonGroup={() => {
          setAddItemSheetVisible(false);
          router.push('/menu/addon-group-details' as any);
        }}
      />

      <InputDialog
        visible={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onConfirm={handleCreateCategory}
        title="New Category"
        label="Category Name"
        placeholder="e.g. Appetizers"
        loading={isProcessing}
      />

      <ConfirmDialog
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => confirmDeleteCategory(false)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        variant="danger"
        confirmLabel="Delete"
        loading={isProcessing}
      />

      <ConfirmDialog
        visible={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={() => confirmDeleteCategory(true)}
        title="Category Not Empty"
        message={`${pendingDeleteMessage} Do you want to delete the category and all its items?`}
        variant="danger"
        confirmLabel="Delete All"
        loading={isProcessing}
      />

      <MessageDialog
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, visible: false })}
        type="error"
      />

      {/* Floating Actions */}
      <View style={[styles.floatingActionsWrapper, { bottom: queue.length > 0 ? 220 : 120 }]}>
        {categories && categories.length > 0 && (
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
        )}

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
    </AnimatedPage>
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
  addonGroupCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  addonGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addonGroupName: {
    fontSize: 16,
    fontWeight: '700',
  },
  addonGroupBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  addonGroupDetails: {
    fontSize: 13,
    opacity: 0.7,
  },
});
