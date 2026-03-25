import { InventoryCategoryCard } from '@/components/inventory/InventoryCategoryCard';
import { FilterPill } from '@/components/orders/FilterPill';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { SearchBar } from '@/components/orders/SearchBar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { ThemedText } from '@/components/themed-text';
import { InventoryCategory, MOCK_ADDONS, MOCK_INVENTORY } from '@/constants/mockInventory';
import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { List } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OWNED_RESTAURANTS = [
  { id: '1', name: 'The Gourmet Kitchen', locality: 'Indiranagar, Bangalore' },
  { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
  { id: '3', name: 'Sushi Zen', locality: 'Koramangala, Bangalore' },
];

export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [activeTab, setActiveTab] = useState<'items' | 'addons'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const [inventory, setInventory] = useState<InventoryCategory[]>(MOCK_INVENTORY);
  const [addons, setAddons] = useState<InventoryCategory[]>(MOCK_ADDONS);

  const currentData = activeTab === 'items' ? inventory : addons;

  const filteredData = currentData.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleToggleCategory = (catId: string) => {
    const updateFn = activeTab === 'items' ? setInventory : setAddons;
    updateFn(prev => prev.map(cat =>
      cat.id === catId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleToggleItem = (catId: string, itemId: string) => {
    const updateFn = activeTab === 'items' ? setInventory : setAddons;
    updateFn(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item =>
          item.id === itemId ? { ...item, isInStock: !item.isInStock } : item
        )
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
        onSelect={(restaurant) => {
          setCurrentRestaurant(restaurant);
          setIsSwitcherVisible(false);
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
          containerStyle={{ marginBottom: 16 }}
        />

        <View style={[styles.promoContainer, { backgroundColor: theme.primary + '15' }]}>
          <View style={styles.promoTextContainer}>
            <ThemedText style={[styles.promoTitle, { color: theme.text }]}>Want to edit your menu?</ThemedText>
          </View>
          <PrimaryButton
            title="Edit now"
            onPress={() => { }}
            style={{ ...styles.promoButton, backgroundColor: theme.primary, borderColor: theme.primary }}
            textStyle={{ ...styles.promoButtonText, color: theme.background }}
          />
        </View>

        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search menu"
          />
        </View>

        <View style={styles.listContainer}>
          {filteredData.map(category => (
            <InventoryCategoryCard
              key={category.id}
              category={category}
              onToggleCategory={handleToggleCategory}
              onToggleItem={handleToggleItem}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.menuFab} activeOpacity={0.8}>
        <View style={{ ...styles.menuFabContent, backgroundColor: theme.surface }}>
          <List size={20} color={theme.text} weight="bold" />
          <ThemedText style={{ ...styles.menuFabText, color: theme.text }}>Menu</ThemedText>
        </View>
      </TouchableOpacity>
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
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
  },
  promoTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  promoTitle: {
    ...Typography.H3,
    color: '#fff',
  },
  promoButton: {
    width: 'auto',
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  promoButtonText: {
    ...Typography.H3,
    fontSize: 14,
    color: '#fff',
  },
  searchSection: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  filterIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    gap: 0,
  },
  menuFab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
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
    color: '#fff',
  }
});
