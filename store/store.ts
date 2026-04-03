import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import menuReducer from './slices/menuSlice';
import uiReducer from './slices/uiSlice';
import orderReducer from './slices/orderSlice';
import restaurantReducer from './slices/restaurantSlice';
import { setLogoutHandler } from '../api/api';
import { logout } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    menu: menuReducer,
    ui: uiReducer,
    order: orderReducer,
    restaurant: restaurantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['restaurant/submitOwnerProfile/pending', 'restaurant/submitOwnerProfile/fulfilled', 'restaurant/submitOwnerProfile/rejected'],
        ignoredActionPaths: ['meta.arg', 'payload'],
        ignoredPaths: ['restaurant.status'],
        warnAfter: 128,
      },
      immutableCheck: { warnAfter: 128 },
    }),
});

setLogoutHandler(() => {
  store.dispatch(logout() as any);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
