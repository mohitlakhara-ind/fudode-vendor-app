import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomTabBar } from '@/components/CustomTabBar';
import { House, Package, Star, ChartBar, TrendUp, ForkKnife, CurrencyInr, DotsThreeCircle } from 'phosphor-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { OrderStackOverlay } from '@/components/orders/OrderStackOverlay';
import { checkQueueExpiry } from '@/store/slices/orderSlice';

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { queue } = useSelector((state: RootState) => state.order);

  // Global expiry check
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(checkQueueExpiry());
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleOpenOrder = (order: any) => {
    // Navigate to Live tab (index) and handle the order opening there
    // Or we could have a global state for the active order sheet
    router.push({
      pathname: '/(tabs)',
      params: { openOrderId: order.id }
    });
  };

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Live', 
            tabBarIcon: ({ color }) => <House size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="stock" 
          options={{ 
            title: 'Stock', 
            tabBarIcon: ({ color }) => <Package size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="reviews" 
          options={{ 
            title: 'Reviews', 
            tabBarIcon: ({ color }) => <Star size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="dashboard" 
          options={{ 
            title: 'Dashboard', 
            tabBarIcon: ({ color }) => <ChartBar size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="promotions" 
          options={{ 
            title: 'Growth', 
            tabBarIcon: ({ color }) => <TrendUp size={24} weight="bold" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="catalog" 
          options={{ 
            title: 'Menu', 
            tabBarIcon: ({ color }) => <ForkKnife size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="earnings" 
          options={{ 
            title: 'Finance', 
            tabBarIcon: ({ color }) => <CurrencyInr size={24} weight="fill" color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="more" 
          options={{ 
            title: 'More', 
            tabBarIcon: ({ color }) => <DotsThreeCircle size={24} weight="fill" color={color} /> 
          }} 
        />
      </Tabs>

      {/* Global Order Stack */}
      {queue.length > 0 && (
        <OrderStackOverlay
          orders={queue}
          onOpenOrder={handleOpenOrder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
