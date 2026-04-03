import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { storage, getPersistentDeviceId } from '../../api/api';
import { AuthResponse, KycStatus } from '../../api/types';

// Matching keys from api.ts
const AUTH_KEYS = {
  ACCESS_TOKEN: 'fudode_access_token',
  REFRESH_TOKEN: 'fudode_refresh_token',
  USER_ID: 'fudode_user_id',
  DEVICE_ID: 'fudode_device_id',
  KYC_STATUS: 'fudode_kyc_status'
};

interface AuthState {
  user: { userId: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  kycStatus?: KycStatus;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  deviceId: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (number: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/request', { number });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to request OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    payload: { number: string; otp: string; deviceId: string; deviceType: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/verify', payload);
      const data: AuthResponse = response.data;

      // Persist using SecureStore (wrapped in storage)
      await storage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.accessToken);
      await storage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
      await storage.setItem(AUTH_KEYS.USER_ID, data.userId);
      await storage.setItem(AUTH_KEYS.DEVICE_ID, payload.deviceId);
      
      if (data.kycStatus) {
        await storage.setItem(AUTH_KEYS.KYC_STATUS, data.kycStatus);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify OTP');
    }
  }
);
export const updateRestaurantToken = createAsyncThunk(
  'auth/updateRestaurantToken',
  async (
    payload: { restaurantId: string },
    { rejectWithValue }
  ) => {
    try {
      const refreshToken = await storage.getItem(AUTH_KEYS.REFRESH_TOKEN);
      const deviceId = await getPersistentDeviceId();
      
      if (!refreshToken) throw new Error('No refresh token available');

      // Use raw axios to avoid interceptor adding Authorization header for this token exchange
      const response = await api.post('/auth/update', {
        refreshToken,
        deviceId,
        restaurantId: payload.restaurantId
      });
      
      const { accessToken, refreshToken: newRefreshToken }: AuthResponse = response.data.data !== undefined ? response.data.data : response.data;

      // Update local storage with the new scoped tokens
      await storage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
      if (newRefreshToken) {
        await storage.setItem(AUTH_KEYS.REFRESH_TOKEN, newRefreshToken);
      }
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error('❌ [Auth Handshake] Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Handshake failed');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }): Promise<{ userId: string; accessToken: string; refreshToken: string; deviceId: string; kycStatus?: KycStatus } | null> => {
    try {
      const accessToken = await storage.getItem(AUTH_KEYS.ACCESS_TOKEN);
      const refreshToken = await storage.getItem(AUTH_KEYS.REFRESH_TOKEN);
      const userId = await storage.getItem(AUTH_KEYS.USER_ID);
      const deviceId = await storage.getItem(AUTH_KEYS.DEVICE_ID);
      const kycStatus = (await storage.getItem(AUTH_KEYS.KYC_STATUS) as KycStatus) || undefined;

      if (accessToken && userId && refreshToken && deviceId) {
        return { userId, accessToken, refreshToken, deviceId, kycStatus };
      }
      
      // If we have nothing, still try to get/set a deviceId for tracking
      if (!deviceId) {
        await getPersistentDeviceId();
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await storage.getItem(AUTH_KEYS.ACCESS_TOKEN);
      const deviceId = await storage.getItem(AUTH_KEYS.DEVICE_ID);
      
      // If we have a token, notify the server. If not, just clear locally.
      if (accessToken && deviceId) {
        try {
          await api.post('/auth/logout', { deviceId });
        } catch (apiError) {
          console.warn('[Auth] Server-side logout failed, proceeding with local logout');
        }
      }

      await storage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      await storage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      await storage.removeItem(AUTH_KEYS.USER_ID);
      
      return null;
    } catch (error: any) {
      // Ensure local state is cleared even if unexpected errors occur
      await storage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      await storage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      return rejectWithValue(error.message || 'Failed to logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ userId: string; accessToken: string; refreshToken?: string; deviceId?: string; kycStatus?: KycStatus }>) => {
      state.user = { userId: action.payload.userId };
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
      if (action.payload.deviceId) state.deviceId = action.payload.deviceId;
      state.kycStatus = action.payload.kycStatus;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action: PayloadAction<{ userId: string }>) => {
        state.loading = false;
        state.user = { userId: action.payload.userId };
      })
      .addCase(requestOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to request OTP';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.userId) {
          state.user = { userId: action.payload.userId };
        }
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.deviceId = action.meta.arg.deviceId;
        state.isAuthenticated = true;
        state.kycStatus = (action.payload.kycStatus as KycStatus) || undefined;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRestaurantToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.isAuthenticated = true;
        console.log('🔄 [Auth] Handshake successful. Tokens updated to restaurant-scoped.');
      })
      .addCase(updateRestaurantToken.rejected, (state, action) => {
        // If the handshake fails with a 401 specifically, it might mean the session is totally invalid
        if ((action.payload as string)?.includes('refresh token')) {
          state.isAuthenticated = false;
          state.accessToken = null;
          state.refreshToken = null;
        }
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = { userId: action.payload.userId };
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.deviceId = action.payload.deviceId;
          state.kycStatus = action.payload.kycStatus;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.kycStatus = undefined;
        state.isAuthenticated = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('auth/'),
        (state, action: any) => {
          state.loading = false;
          state.error = (action.payload as string) || 'An error occurred';
        }
      );
  },
});

export const { setAuth, clearError } = authSlice.actions;
export default authSlice.reducer;

