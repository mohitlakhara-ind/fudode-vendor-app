import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { storage } from '../../api/api';
import { AuthResponse, KycDetails, KycStatus } from '../../api/types';

interface AuthState {
  user: { userId: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  kycStatus: KycStatus;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  deviceId: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  kycStatus: KycStatus.PENDING,
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
      
      await storage.setItem('accessToken', data.accessToken);
      await storage.setItem('refreshToken', data.refreshToken);
      await storage.setItem('userId', data.userId);
      await storage.setItem('deviceId', payload.deviceId);
      if (data.kycStatus) {
        await storage.setItem('kycStatus', data.kycStatus);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify OTP');
    }
  }
);

export const updateScope = createAsyncThunk(
  'auth/updateScope',
  async (payload: { restaurantId: string; deviceId: string; refreshToken: string }, { rejectWithValue }) => {
    try {
      console.log('[Auth] Updating scope to restaurant:', payload.restaurantId);
      const response = await api.post('/auth/update', payload);
      const { accessToken } = response.data;
      
      await storage.setItem('accessToken', accessToken);
      console.log('[Auth] Scope updated successfully.');
      return accessToken;
    } catch (error: any) {
      console.error('[Auth] Scope Update Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to update scope');
    }
  }
);

export const submitKyc = createAsyncThunk(
  'auth/submitKyc',
  async (kycDetails: KycDetails, { rejectWithValue }) => {
    try {
      console.log('[KYC] Submitting Details:', kycDetails);
      const response = await api.post('/kyc/onboard', kycDetails);
      console.log('[KYC] Submission Successful:', response.data);
      
      await storage.setItem('kycStatus', KycStatus.SUBMITTED);
      return response.data;
    } catch (error: any) {
      console.error('[KYC] Submission Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to submit KYC');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }): Promise<{ userId: string; accessToken: string; refreshToken: string; deviceId: string; kycStatus: KycStatus } | null> => {
    try {
      const accessToken = await storage.getItem('accessToken');
      const refreshToken = await storage.getItem('refreshToken');
      const userId = await storage.getItem('userId');
      const deviceId = await storage.getItem('deviceId');
      const kycStatus = (await storage.getItem('kycStatus') as KycStatus) || KycStatus.PENDING;

      if (accessToken && userId && refreshToken && deviceId) {
        return { userId, accessToken, refreshToken, deviceId, kycStatus };
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
      const deviceId = await storage.getItem('deviceId');
      await api.post('/auth/logout', { deviceId });
      
      await storage.removeItem('accessToken');
      await storage.removeItem('refreshToken');
      await storage.removeItem('userId');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ userId: string; accessToken: string; refreshToken?: string; deviceId?: string; kycStatus: KycStatus }>) => {
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
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { userId: action.payload.userId };
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.deviceId = action.meta.arg.deviceId;
        state.isAuthenticated = true;
        state.kycStatus = (action.payload.kycStatus as KycStatus) || KycStatus.PENDING;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = KycStatus.SUBMITTED;
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateScope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateScope.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(updateScope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
        state.kycStatus = KycStatus.PENDING;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
