import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, StatusColors } from '@/constants/theme';
import {
  CaretLeft,
  CalendarBlank,
  CaretDown,
  MagnifyingGlass,
  Funnel,
  FileArrowDown,
  ClockCounterClockwise
} from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { FilterPill } from '@/components/orders/FilterPill';
import { SearchBar } from '@/components/orders/SearchBar';
import { OrderCard } from '@/components/orders/OrderCard';

const { width } = Dimensions.get('window');

const MOCK_HISTORY_ORDERS = [
  {
    id: '8210',
    status: 'Completed',
    customerName: 'Rohan Sharma',
    items: [{ name: 'Butter Chicken', quantity: 1, price: 380 }, { name: 'Naan', quantity: 2, price: 60 }],
    subtotal: '440',
    taxes: '20',
    total: '460',
    time: 'Yesterday, 8:30 PM',
    paymentMethod: 'UPI' as const,
    createdAt: Date.now() - 86400000,
  },
  {
    id: '8209',
    status: 'Cancelled',
    customerName: 'Neha Kapoor',
    items: [{ name: 'Veg Thali', quantity: 1, price: 250 }],
    subtotal: '240',
    taxes: '10',
    total: '250',
    time: 'Yesterday, 7:15 PM',
    paymentMethod: 'Cash' as const,
    createdAt: Date.now() - 90000000,
  },
  {
    id: '8208',
    status: 'Completed',
    customerName: 'Aditya Raj',
    items: [{ name: 'Chicken Dum Biryani', quantity: 2, price: 320 }],
    subtotal: '600',
    taxes: '40',
    total: '640',
    time: '20 Mar, 1:45 PM',
    paymentMethod: 'Card' as const,
    createdAt: Date.now() - 172800000,
  },
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState("Last 7 days");

  const filteredOrders = MOCK_HISTORY_ORDERS.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.surface }]}>
            <CaretLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Order History</Text>
        </View>
        <Pressable style={[styles.downloadBtn, { backgroundColor: theme.surface }]}>
          <FileArrowDown size={22} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>
        {/* Date Filter & Summary */}
        <View style={styles.filtersContainer}>
          <Pressable style={[styles.dateSelector, { backgroundColor: theme.surface, borderColor: theme.border + '30' }]}>
            <CalendarBlank size={20} color={theme.textSecondary} />
            <Text style={[styles.dateText, { color: theme.text }]}>{dateRange}</Text>
            <CaretDown size={14} color={theme.textSecondary} />
          </Pressable>
          
          <View style={[styles.summaryCard, { backgroundColor: theme.surfaceSecondary + '50' }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Orders</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{MOCK_HISTORY_ORDERS.length}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border + '20' }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Revenue</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>₹1,350</Text>
            </View>
          </View>
        </View>

        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {['All', 'Completed', 'Cancelled'].map((filterLabel) => (
              <FilterPill
                key={filterLabel}
                label={filterLabel}
                isActive={activeTab === filterLabel}
                count={filterLabel === 'All' 
                  ? MOCK_HISTORY_ORDERS.length 
                  : MOCK_HISTORY_ORDERS.filter(o => o.status === filterLabel).length}
                onPress={() => setActiveTab(filterLabel)}
                color={filterLabel === 'Cancelled' ? StatusColors.Late : StatusColors.Completed}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard 
                key={order.id}
                id={order.id}
                status={order.status as any}
                customerName={order.customerName}
                items={order.items as any}
                subtotal={order.subtotal}
                taxes={order.taxes}
                total={order.total}
                time={order.time}
                paymentMethod={order.paymentMethod as any}
                createdAt={order.createdAt}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <ClockCounterClockwise size={64} color={theme.icon} weight="thin" />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No orders found for this period</Text>
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    ...Typography.H1,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 16,
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  dateText: {
    flex: 1,
    ...Typography.H3,
    fontSize: 15,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    ...Typography.Caption,
    fontWeight: '600',
  },
  summaryValue: {
    ...Typography.H2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 16,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    opacity: 0.6,
  },
  emptyText: {
    ...Typography.BodyRegular,
    marginTop: 16,
  },
});
