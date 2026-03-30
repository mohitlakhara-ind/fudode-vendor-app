import { IncomingOrder } from '@/hooks/useOrderQueue';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { StackedOrderCard } from './StackedOrderCard';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OrderStackOverlayProps {
  orders: IncomingOrder[];
  onOpenOrder: (order: IncomingOrder) => void;
}

export const OrderStackOverlay = ({ orders, onOpenOrder }: OrderStackOverlayProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { isModalOpen } = useSelector((state: RootState) => state.ui);

  const visibleOrders = orders.slice(0, 3);
  const remainingCount = orders.length - 3;

  return (
    <View style={[styles.container, { zIndex: isModalOpen ? -1 : 0 }]} pointerEvents="box-none">
      {/* Background tray for the stack */}
      <View style={styles.stackBg}>

        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)' }
          ]}
        />
      </View>

      <View style={styles.stackWrapper} pointerEvents="box-none">
        {visibleOrders.map((order, index) => (
          <StackedOrderCard
            key={order.id}
            order={order}
            index={index}
            totalItems={visibleOrders.length + (remainingCount > 0 ? 1 : 0)}
            onOpen={() => onOpenOrder(order)}
          />
        ))}
        {remainingCount > 0 && (
          <StackedOrderCard
            key="more-orders"
            order={{ id: 'more', customerName: '', itemSummary: '', createdAt: 0 }}
            index={3}
            totalItems={visibleOrders.length + 1}
            onOpen={() => { }}
            isMoreCard
            moreCount={remainingCount}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    width: '100%',
    height: 380,
    zIndex: 0,
    justifyContent: 'flex-end',
    paddingBottom: 155,
  },
  stackBg: {
    position: 'absolute',
    top: 225,
    left: 12,
    right: 12,
    height: 70,
    borderRadius: 24,
    overflow: 'hidden',
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
});
