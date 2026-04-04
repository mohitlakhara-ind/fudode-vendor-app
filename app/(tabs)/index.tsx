import { FilterPill } from '@/components/orders/FilterPill';
import { NewOrderSheet } from '@/components/orders/NewOrderSheet';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderConfirmationSheet } from '@/components/orders/OrderConfirmationSheet';
import { OrderStackOverlay } from '@/components/orders/OrderStackOverlay';
import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { SearchBar } from '@/components/orders/SearchBar';
import { FilterSheet } from '@/components/common/FilterSheet';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { IncomingOrder } from '@/hooks/useOrderQueue';
import { RootState } from '@/store/store';
import { addOrder, removeOrder } from '@/store/slices/orderSlice';
import { fetchMyRestaurants, setRestaurantOnline } from '@/store/slices/restaurantSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CookingPot,
  SealCheck,
  Sparkle,
  XCircle,
  Ranking,
  HandWaving,
  ClockAfternoon,
  CheckCircle as CheckCircleIcon
} from 'phosphor-react-native';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useBatteryStatus } from '@/hooks/useBatteryStatus';
import { BatteryWarningBanner } from '@/components/ui/BatteryWarningBanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTERS = [
  { label: 'Preparing', icon: CookingPot, color: StatusColors.Preparing },
  { label: 'Ready', icon: CheckCircleIcon, color: StatusColors.Ready },
  { label: 'Late', icon: ClockAfternoon, color: StatusColors.Late },
  { label: 'Completed', icon: SealCheck, color: StatusColors.Completed },
  { label: 'Cancelled', icon: XCircle, color: StatusColors.Cancelled },
  { label: 'All', icon: Sparkle, color: StatusColors.All },
];

// Mock data is now replaced by Redux state

const MOCK_ORDERS = [
  {
    id: '8223',
    status: 'New',
    customerName: 'Amit Kumar',
    items: [
      {
        name: 'Margerita Pizza',
        quantity: 1,
        price: 350,
        addons: [
          { name: 'Extra Cheese', price: 50 },
          { name: 'Thin Crust', price: 30 }
        ]
      },
      { name: 'Garlic Bread', quantity: 1, price: 80 }
    ],
    subtotal: '510',
    taxes: '25',
    total: '535',
    time: '1 min ago',
    paymentMethod: 'UPI' as const,
    specialInstructions: 'Make it extra spicy',
    offer: {
      title: '10% Off on Orders Above ₹500',
      subtitle: 'Flat discount applied',
      coupon: 'SAVE10',
      discount: '50'
    }
  },
  {
    id: '8224',
    status: 'New',
    customerName: 'Sanjana Reddy',
    items: [
      { name: 'Veg Hakka Noodles', quantity: 1, price: 180 },
      { name: 'Chilli Paneer', quantity: 1, price: 220 }
    ],
    subtotal: '400',
    taxes: '20',
    total: '420',
    time: 'Just now',
    paymentMethod: 'UPI' as const,
    expiresAt: Date.now() + 240000, // 4 min
  },
  {
    id: '8225',
    status: 'New',
    customerName: 'Kunal Shah',
    items: [
      { name: 'Chicken Biryani', quantity: 1, price: 320 }
    ],
    subtotal: '320',
    taxes: '16',
    total: '336',
    time: '2 mins ago',
    paymentMethod: 'UPI' as const,
  },
  {
    id: '8226',
    status: 'New',
    customerName: 'Deepak Hooda',
    items: [
      { name: 'Cold Coffee', quantity: 2, price: 120 }
    ],
    subtotal: '240',
    taxes: '12',
    total: '252',
    time: '5 mins ago',
    paymentMethod: 'UPI' as const,
  },
  {
    id: '8219',
    status: 'Preparing',
    customerName: 'Rahul Sharma',
    items: [
      {
        name: 'Paneer Tikka',
        quantity: 2,
        price: 200,
        addons: [{ name: 'Extra Mint Chutney', price: 0 }]
      },
      { name: 'Butter Naan', quantity: 1, price: 40 },
      { name: 'Jeera Rice', quantity: 1, price: 160 }
    ],
    subtotal: '600',
    taxes: '35',
    packagingCharge: '15',
    total: '650',
    time: '4 mins ago',
    paymentMethod: 'Card' as const,
    deliveryBoy: {
      name: 'Suresh Raina',
      phone: '9876543210',
      comingIn: '8 mins'
    },
    createdAt: Date.now() - 240000, // 4 min ago
    estimatedReadyTime: Date.now() + 600000, // 10 min
  },
  {
    id: '8220',
    status: 'Delayed',
    customerName: 'Anjali Gupta',
    items: [
      { name: 'Dal Makhani', quantity: 1, price: 280 },
      { name: 'Garlic Roti', quantity: 2, price: 50 },
      { name: 'Boondi Raita', quantity: 1, price: 40 }
    ],
    subtotal: '370',
    taxes: '30',
    packagingCharge: '20',
    total: '420',
    time: '12 mins ago',
    paymentMethod: 'COD' as const,
    specialInstructions: 'Doorbell is not working, please call',
    deliveryBoy: {
      name: 'Hardik Pandya',
      phone: '9876543211',
      comingIn: '2 mins'
    },
    createdAt: Date.now() - 720000, // 12 min ago
    estimatedReadyTime: Date.now() - 300000, // 5 min ago (Delayed)
  },
  {
    id: '8221',
    status: 'Ready',
    customerName: 'Vikram Singh',
    items: [
      { name: 'Veg Biryani', quantity: 3, price: 280 },
      { name: 'Salan', quantity: 2, price: 40 },
      { name: 'Coke (500ml)', quantity: 1, price: 60 }
    ],
    subtotal: '900',
    taxes: '60',
    packagingCharge: '20',
    total: '980',
    time: 'Just now',
    paymentMethod: 'UPI' as const,
    deliveryBoy: {
      name: 'Virat Kohli',
      phone: '9876543212',
      comingIn: 'Already Arrived'
    }
  },
  {
    id: '8222',
    status: 'Preparing',
    customerName: 'Priya Verma',
    items: [
      { name: 'Chicken Curry', quantity: 1, price: 550 },
      { name: 'Naan', quantity: 2, price: 60 }
    ],
    subtotal: '670',
    taxes: '50',
    packagingCharge: '30',
    total: '750',
    time: '8 mins ago',
    createdAt: Date.now() - 480000, // 8 min ago
    estimatedReadyTime: Date.now() + 300000, // 5 min
  },
];

const ORDER_FILTER_CATEGORIES = [
  {
    id: 'type',
    label: 'Order Type',
    options: [
      { id: 'delivery', label: 'Delivery' },
      { id: 'pickup', label: 'Self Pickup' },
      { id: 'dinein', label: 'Dine-in' },
    ]
  },
  {
    id: 'payment',
    label: 'Payment',
    options: [
      { id: 'upi', label: 'UPI' },
      { id: 'card', label: 'Card' },
      { id: 'cod', label: 'Cash on Delivery' },
    ]
  }
];

export default function LiveOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { queue } = useSelector((state: RootState) => state.order);
  const { status: restaurantStatus, myRestaurants, loading: restaurantLoading } = useSelector((state: RootState) => state.restaurant);

  useEffect(() => {
    // Fetch real restaurants on mount
    dispatch(fetchMyRestaurants() as any);
  }, [dispatch]);

  const [activeFilter, setActiveFilter] = useState('Preparing');
  const [searchQuery, setSearchQuery] = useState('');

  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showBatteryDebug, setShowBatteryDebug] = useState(false);

  const { level, isLowBattery, simulateLowBattery, resetBattery } = useBatteryStatus();

  // New Order Popup States
  const [activeNewOrder, setActiveNewOrder] = useState<any>(null);
  const [showNewOrderSheet, setShowNewOrderSheet] = useState(false);
  const [showConfirmationSheet, setShowConfirmationSheet] = useState(false);

  const pagerRef = useRef<FlatList>(null);
  const filterScrollRef = useRef<ScrollView>(null);

  const handleFilterPress = (filterLabel: string, index: number) => {
    setActiveFilter(filterLabel);
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  useEffect(() => {
    // Sync MOCK_ORDERS with the stack queue
    MOCK_ORDERS.forEach(order => {
      if (order.status === 'New') {
        dispatch(addOrder({
          id: order.id,
          customerName: order.customerName,
          itemSummary: `${order.items.length} items • ₹${order.total}`,
          items: order.items,
          expiresAt: (order as any).expiresAt || Date.now() + 300000, // 5 min
          createdAt: Date.now() - (parseInt(order.id) % 100 * 1000), // Fake past time
          priority: order.id === '8223' ? 'high' : 'normal'
        }));
      }
    });
  }, [dispatch]);

  const handleOpenOrder = (incomingOrderId: string) => {
    const fullOrder = MOCK_ORDERS.find(o => o.id === incomingOrderId);

    if (fullOrder) {
      setActiveNewOrder(fullOrder);
      setShowNewOrderSheet(true);
    }
  };

  useEffect(() => {
    if (params.openOrderId) {
      handleOpenOrder(params.openOrderId as string);
    }
  }, [params.openOrderId]);

  useEffect(() => {
    // Scroll filter pill into view when activeFilter changes
    const index = FILTERS.findIndex(f => f.label === activeFilter);
    if (index !== -1) {
      filterScrollRef.current?.scrollTo({ x: index * 80, animated: true });
    }
  }, [activeFilter]);

  const getFilteredOrders = (filterLabel: string) => {
    return MOCK_ORDERS.filter(order => {
      const matchesFilter = filterLabel === 'All' || order.status === filterLabel || (filterLabel === 'Late' && order.status === 'Delayed');
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  };

  const getOrderCount = (filterLabel: string) => {
    return MOCK_ORDERS.filter(order =>
      filterLabel === 'All' || order.status === filterLabel || (filterLabel === 'Late' && order.status === 'Delayed')
    ).length;
  };

  const isBottomSheetOpen = showNewOrderSheet || showConfirmationSheet;

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* DECORATIVE BACKGROUND FOR GLASSY POP */}
      <View style={[styles.bgCircle, { backgroundColor: theme.primary, opacity: isDark ? 0.05 : 0.03, left: -100, top: -100 }]} />
      <View style={[styles.bgCircle, { backgroundColor: theme.secondary, opacity: isDark ? 0.05 : 0.03, right: -150, top: 200 }]} />

      <GlobalRestaurantHeader
        onTitlePress={() => setShowBatteryDebug(!showBatteryDebug)}
      />

      {isLowBattery && <BatteryWarningBanner level={level} />}

      {showBatteryDebug && (
        <View style={styles.debugRow}>
          <Pressable onPress={() => simulateLowBattery(0.12)} style={[styles.debugBtn, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.debugBtnText, { color: theme.text }]}>Simulate 12%</Text>
          </Pressable>
          <Pressable onPress={resetBattery} style={[styles.debugBtn, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.debugBtnText, { color: theme.text }]}>Reset Battery</Text>
          </Pressable>
        </View>
      )}

      {/* GlobalRestaurantHeader handles switching internally */}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setIsFilterVisible(true)}
        containerStyle={{ paddingHorizontal: 20 }}
      />

      {/* FILTERS */}
      <View style={styles.filterSection}>
        <ScrollView
          ref={filterScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((filter, index) => (
            <FilterPill
              key={filter.label}
              label={filter.label}
              isActive={activeFilter === filter.label}
              color={filter.color}
              count={getOrderCount(filter.label)}
              onPress={() => handleFilterPress(filter.label, index)}
              icon={
                <filter.icon
                  size={18}
                  color={activeFilter === filter.label ? filter.color : theme.icon}
                  weight={activeFilter === filter.label ? "fill" : "bold"}
                />
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* ORDERS PAGER */}
      <FlatList
        ref={pagerRef}
        data={FILTERS}
        keyExtractor={item => item.label}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          if (FILTERS[index]) {
            setActiveFilter(FILTERS[index].label);
          }
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item: filter }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <FlatList
              data={getFilteredOrders(filter.label)}
              keyExtractor={item => item.id}

              renderItem={({ item }) => (
                <OrderCard
                  id={item.id}
                  status={item.status as any}
                  customerName={item.customerName}
                  items={item.items as any}
                  subtotal={item.subtotal}
                  taxes={item.taxes}
                  packagingCharge={item.packagingCharge}
                  total={item.total}
                  time={item.time}
                  paymentMethod={item.paymentMethod as any}
                  specialInstructions={item.specialInstructions}
                  offer={(item as any).offer}
                  deliveryBoy={(item as any).deliveryBoy}
                  estimatedReadyTime={(item as any).estimatedReadyTime}
                  createdAt={(item as any).createdAt}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={(() => {
                let emptyProps = {
                  icon: Sparkle,
                  title: `No ${filter.label.toLowerCase()} orders`,
                  description: `You don't have any orders in the ${filter.label.toLowerCase()} stage right now.`
                };

                if (filter.label === 'Preparing') {
                  emptyProps = {
                    icon: CookingPot,
                    title: "Kitchen's quiet",
                    description: "No orders are currently being prepared. Ready for the next rush?"
                  };
                } else if (filter.label === 'Ready') {
                  emptyProps = {
                    icon: CheckCircleIcon,
                    title: "All clear!",
                    description: "No orders are currently waiting for pickup or delivery."
                  };
                } else if (filter.label === 'New') {
                  emptyProps = {
                    icon: HandWaving,
                    title: "Welcome aboard!",
                    description: "No new orders yet. We'll alert you with a loud ring as soon as a customer orders!"
                  };
                } else if (filter.label === 'Late') {
                  emptyProps = {
                    icon: ClockAfternoon,
                    title: "Phew, no delays!",
                    description: "All orders are currently tracking on time. Great job!"
                  };
                }

                return (
                  <EmptyState
                    {...emptyProps}
                    style={{ paddingTop: 80 }}
                  />
                );
              })()}
              ListFooterComponent={<View style={{ height: queue.length > 0 ? 240 : 120 }} />}
            />
          </View>
        )}
      />


      {/* NEW ORDER POPUP FLOW */}
      <NewOrderSheet
        visible={showNewOrderSheet}
        order={activeNewOrder}
        currentIndex={queue.findIndex(o => o.id === activeNewOrder?.id) + 1}
        totalCount={queue.length}
        onConfirm={() => {
          setShowNewOrderSheet(false);
          setShowConfirmationSheet(true);
        }}
        onCancel={() => {
          if (activeNewOrder) dispatch(removeOrder(activeNewOrder.id));
          setShowNewOrderSheet(false);
          setActiveNewOrder(null);
        }}
        onDismiss={() => {
          setShowNewOrderSheet(false);
        }}
        onContact={() => { }}
      />

      <OrderConfirmationSheet
        visible={showConfirmationSheet}
        onAccept={(prepTime: number) => {
          if (activeNewOrder) dispatch(removeOrder(activeNewOrder.id));
          setShowConfirmationSheet(false);
          setActiveNewOrder(null);
          // Real backend update would happen here
        }}
        onBack={() => {
          setShowConfirmationSheet(false);
          setShowNewOrderSheet(true);
        }}
      />

      <FilterSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => {
          console.log('Selected filters:', filters);
          setIsFilterVisible(false);
        }}
        categories={ORDER_FILTER_CATEGORIES}
      />
    </AnimatedPage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: -1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  emptyText: {
    ...Typography.BodyRegular,
    marginTop: 16,
  },
  debugRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  debugBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  debugBtnText: {
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.6,
  },
});
