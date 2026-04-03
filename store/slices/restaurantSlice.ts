import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { 
  RestaurantStatus, 
  OnboardingStep1, 
  OnboardingStep2, 
  OnboardingStep3 
} from '../../api/types';

interface RestaurantState {
  status: RestaurantStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  status: null,
  loading: false,
  error: null,
};

export const getRestaurantStatus = createAsyncThunk(
  'restaurant/getRestaurantStatus',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Fetch Phase 2 Profile Status
      const profileResponse = await api.get('/profile/get');
      const profileData = profileResponse.data.data !== undefined ? profileResponse.data.data : profileResponse.data;
      
      let unifiedStatus = { ...profileData };

      // 2. If Phase 2 is complete, attempt to fetch Phase 3 Onboarding Status
      if (profileData.profileData?.isOwnerProfileComplete) {
        try {
          const onboardResponse = await api.get('/onboard/get');
          const onboardData = onboardResponse.data.data !== undefined ? onboardResponse.data.data : onboardResponse.data;
          
          unifiedStatus = {
            ...unifiedStatus,
            onboardingStep: onboardData.onboardingStep,
            onboardingStatus: onboardData.onboardingStatus,
            // Merge any other relevant onboarding fields
          };
          console.log('📡 [API Debug] Unified Status (Phase 2 + 3):', JSON.stringify(unifiedStatus));
        } catch (onboardError) {
          console.log('⚠️ [API Debug] Phase 3 status fetch failed (User may not have a restaurant context yet).');
        }
      } else {
        console.log('📡 [API Debug] Unified Status (Phase 2 only):', JSON.stringify(unifiedStatus));
      }

      return unifiedStatus;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch restaurant status');
    }
  }
);

export const submitOwnerProfile = createAsyncThunk(
  'restaurant/submitOwnerProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/set', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit Owner Profile');
    }
  }
);

export const submitStep1 = createAsyncThunk(
  'restaurant/submitStep1',
  async (details: OnboardingStep1, { rejectWithValue }) => {
    try {
      const response = await api.post('/onboard/step-1', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit Step 1');
    }
  }
);


export const submitStep2 = createAsyncThunk(
  'restaurant/submitStep2',
  async (details: OnboardingStep2, { rejectWithValue }) => {
    try {
      const response = await api.post('/onboard/step-2', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit Step 2');
    }
  }
);

export const submitStep3 = createAsyncThunk(
  'restaurant/submitStep3',
  async (details: OnboardingStep3, { rejectWithValue }) => {
    try {
      const response = await api.post('/onboard/step-3', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit Step 3');
    }
  }
);

export const getRestaurantContract = createAsyncThunk(
  'restaurant/getRestaurantContract',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/onboard/get-partener-contract');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch contract');
    }
  }
);


const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearRestaurantError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurantStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurantStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(getRestaurantStatus.rejected, (state, action: any) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch status';
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.startsWith('restaurant/submit'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('restaurant/submit'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('restaurant/submit'),
        (state, action: any) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to submit';
        }
      );
  },
});

export const { clearRestaurantError } = restaurantSlice.actions;
export default restaurantSlice.reducer;
