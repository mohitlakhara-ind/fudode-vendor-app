import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IncomingOrder {
  id: string;
  customerName: string;
  itemSummary: string;
  items: any[];
  expiresAt: number; // Timestamp
  createdAt: number; // Timestamp order was received
  priority?: 'high' | 'normal';
}

interface OrderState {
  queue: IncomingOrder[];
}

const initialState: OrderState = {
  queue: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<IncomingOrder>) => {
      if (state.queue.find(o => o.id === action.payload.id)) return;
      state.queue.push(action.payload);
      // Sort: Most urgent (earliest expiresAt) first
      state.queue.sort((a, b) => (a.expiresAt || 0) - (b.expiresAt || 0));
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(o => o.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    checkQueueExpiry: (state) => {
      const now = Date.now();
      const hasExpired = state.queue.some(order => order.expiresAt && now >= order.expiresAt);
      if (hasExpired) {
        state.queue = state.queue.filter(order => !order.expiresAt || now < order.expiresAt);
      }
    },
  },
});

export const { addOrder, removeOrder, clearQueue, checkQueueExpiry } = orderSlice.actions;
export default orderSlice.reducer;
