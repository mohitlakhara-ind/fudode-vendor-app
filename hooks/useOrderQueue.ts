import { useState, useCallback, useEffect, useRef } from 'react';

export interface IncomingOrder {
  id: string;
  customerName: string;
  itemSummary: string;
  items: any[];
  expiresAt: number; // Timestamp
  createdAt: number; // Timestamp order was received
  priority?: 'high' | 'normal';
}

export const useOrderQueue = (initialOrders: IncomingOrder[] = []) => {
  const [queue, setQueue] = useState<IncomingOrder[]>(initialOrders);

  // Auto-removal of expired orders
  useEffect(() => {
    const checkExpiry = () => {
      const now = Date.now();
      setQueue(prev => {
        const hasExpired = prev.some(order => order.expiresAt && now >= order.expiresAt);
        if (hasExpired) {
          return prev.filter(order => !order.expiresAt || now < order.expiresAt);
        }
        return prev;
      });
    };

    const timer = setInterval(checkExpiry, 1000);
    return () => clearInterval(timer);
  }, []);

  const addOrder = useCallback((order: IncomingOrder) => {
    setQueue(prev => {
      if (prev.find(o => o.id === order.id)) return prev;
      const newQueue = [...prev, order];
      // Sort: Most urgent (earliest expiresAt) first
      return newQueue.sort((a, b) => (a.expiresAt || 0) - (b.expiresAt || 0));
    });
  }, []);

  const removeOrder = useCallback((orderId: string) => {
    setQueue(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    addOrder,
    removeOrder,
    clearQueue,
    now: Date.now()
  };
};
