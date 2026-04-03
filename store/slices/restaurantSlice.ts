import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { 
  RestaurantStatus, 
  OnboardingStep1, 
  OnboardingStep2, 
  OnboardingStep3,
  UserRestaurant,
  KycOverallStatus
} from '../../api/types';

interface RestaurantState {
  status: RestaurantStatus | null;
  myRestaurants: UserRestaurant[];
  selectedRestaurantId: string | null;
  isOnline: boolean;
  kycStatus: KycOverallStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  status: null,
  myRestaurants: [],
  selectedRestaurantId: null,
  isOnline: true,
  kycStatus: null,
  loading: false,
  error: null,
};

/** 5. Utility & Maintenance */

export const fetchMyRestaurants = createAsyncThunk(
  'restaurant/fetchMyRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/get/my');
      // The guide says this can return {data: [...]} or just [...]
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      // 404 is expected for new users, so return empty array silently
      if (error.response?.status === 404) {
        console.log('ℹ️ [API] fetchMyRestaurants: No restaurants found (expected for new users).');
        return []; 
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch restaurants');
    }
  }
);

export const fetchKycOverallStatus = createAsyncThunk(
  'restaurant/fetchKycOverallStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/onboard/get-kycStatus');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch KYC status');
    }
  }
);

export const getRestaurantStatus = createAsyncThunk(
  'restaurant/getRestaurantStatus',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Fetch Phase 2 Profile Status
      const timestamp = new Date().getTime();
      const profileResponse = await api.get(`/profile/get?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      const profileData = profileResponse.data.data !== undefined ? profileResponse.data.data : profileResponse.data;
      const profileMessage = profileResponse.data.message;

      console.log('🔍 [Raw Trace] Profile Response:', JSON.stringify(profileResponse.data, null, 2));
      
      let unifiedStatus = { 
        ...profileData,
        onboardingStep: 0, 
      };

      let finalMessage = profileMessage;

      // 2. If Phase 2 is complete, attempt to fetch Phase 3 Onboarding Status
      if (profileData.profileData?.isOwnerProfileComplete) {
        try {
          const onboardResponse = await api.get(`/onboard/get?_t=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });
          const onboardData = onboardResponse.data.data !== undefined ? onboardResponse.data.data : onboardResponse.data;
          
          console.log('🔍 [Raw Trace] Onboarding Response:', JSON.stringify(onboardResponse.data, null, 2));

          unifiedStatus = {
            ...unifiedStatus,
            ...onboardData,
            onboardingStep: onboardData.onboardingStep ?? 0,
            onboardingStatus: onboardData.onboardingStatus,
          };
          
          if (onboardResponse.data.message) {
            finalMessage = onboardResponse.data.message;
          }

          // 3. Fetch specific step details for Step 1 & 2
          try {
            console.log('🔍 [Phase 3.1] Fetching Step 1 Detail...');
            const step1Response = await api.get(`/onboard/get-step-1?_t=${timestamp}`);
            if (step1Response.data?.status && step1Response.data?.data) {
              console.log('✅ [Phase 3.1] Step 1 Data Received & Flattening Address');
              const s1data = step1Response.data.data;
              const addr = s1data.address || {};

              // 1. Format the address object into a readable string to avoid React 'Objects as child' error
              const formattedAddress = [
                s1data.address?.shopno || s1data.address?.shopNo,
                s1data.address?.tower || s1data.address?.floor,
                s1data.address?.area,
                s1data.address?.city
              ].filter(Boolean).join(', ') || s1data.address;

              unifiedStatus = {
                ...unifiedStatus,
                ...s1data,
                // Overwrite the 'address' object with our formatted string
                address: typeof formattedAddress === 'string' ? formattedAddress : 'Location details pending',
                // Map nested address to flat status for pre-filling forms
                lat: addr.latitude || addr.lat,
                long: addr.longitude || addr.long,
                city: addr.city,
                area: addr.area,
                shopno: addr.shopno || addr.shopNo,
                floor: addr.tower || addr.floor,
                landMark: addr.Landmark || addr.landmark,
                alternateNo: s1data.alternateNo
              };
            }
          } catch (e) {
            console.log('⚠️ [Phase 3.1] Step 1 data not available yet');
          }

          try {
            console.log('🔍 [Phase 3.2] Fetching Step 2 Detail...');
            const step2Response = await api.get(`/onboard/get-step-2?_t=${timestamp}`);
            if (step2Response.data?.status && step2Response.data?.data) {
              console.log('✅ [Phase 3.2] Step 2 Data Received');
              unifiedStatus = {
                ...unifiedStatus,
                ...step2Response.data.data
              };
            }
          } catch (e) {
            console.log('⚠️ [Phase 3.2] Step 2 data not available yet');
          }

        } catch (onboardError: any) {
          if (onboardError.response?.status === 403) {
            unifiedStatus.onboardingStep = 0;
          }
        }
      }

      // We return both data and message so the reducer can detect cached responses
      return { data: unifiedStatus as RestaurantStatus, message: finalMessage };

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

export const updateOwnerProfile = createAsyncThunk(
  'restaurant/updateOwnerProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update Owner Profile');
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

export const updateStep1 = createAsyncThunk(
  'restaurant/updateStep1',
  async (details: OnboardingStep1, { rejectWithValue }) => {
    try {
      const response = await api.put('/onboard/step-1', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update Step 1');
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

export const updateStep2 = createAsyncThunk(
  'restaurant/updateStep2',
  async (details: OnboardingStep2, { rejectWithValue }) => {
    try {
      const response = await api.put('/onboard/step-2', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update Step 2');
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
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to submit Step 3'
      );
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
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch contract'
      );
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
    // Manual state override to break redirect loops if backend is slow/cached
    markOwnerProfileComplete: (state) => {
      if (state.status) {
        state.status = {
          ...state.status,
          profileData: {
            ...state.status.profileData,
            isOwnerProfileComplete: true
          }
        };
      }
    },
    setSelectedRestaurantId: (state, action: PayloadAction<string | null>) => {
      state.selectedRestaurantId = action.payload;
    },
    setRestaurantOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurantStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { data: incomingData, message: isDataCached } = action.payload;

        console.log(`📡 [Redux Breakpoint] Status Updated (${isDataCached}):`, {
          onboardingStep: incomingData.onboardingStep,
          name: incomingData.name,
          isOwnerProfileComplete: incomingData.profileData?.isOwnerProfileComplete,
          hasStatus: !!incomingData
        });

        // Sticky State Logic: Prevent "downgrading" verification status if response is stale/cached
        const currentIsComplete = state.status?.profileData?.isOwnerProfileComplete;
        const currentOnboardingStatus = state.status?.onboardingStatus;

        const incomingIsComplete = incomingData.profileData?.isOwnerProfileComplete;
        const wasActuallyCached = isDataCached === 'Data fetched from cache';

        // Cache Shield: If incoming says "false" but it's from cache, and we are "true" locally, IGNORE it.
        const shouldIgnoreDowngrade = currentIsComplete && !incomingIsComplete && wasActuallyCached;

        if (shouldIgnoreDowngrade) {
          console.log('🛡️ [Cache Shield] Ignoring stale cached status downgrade from: ', isDataCached);
          state.status = {
            ...incomingData,
            profileData: {
              ...incomingData.profileData,
              isOwnerProfileComplete: true
            },
            onboardingStatus: incomingData.onboardingStatus || currentOnboardingStatus,
            onboardingStep: incomingData.onboardingStep || state.status?.onboardingStep || 0
          };
        } else {
          state.status = incomingData;
        }
      })
      .addCase(fetchMyRestaurants.fulfilled, (state, action) => {
        state.myRestaurants = action.payload;
        state.loading = false;
        
        // Auto-select first restaurant if none selected
        if (!state.selectedRestaurantId && action.payload.length > 0) {
          state.selectedRestaurantId = action.payload[0].restaurant.id;
        }
      })
      .addCase(fetchKycOverallStatus.fulfilled, (state, action) => {
        state.kycStatus = action.payload;
        state.loading = false;
      })
      // Optimistic update for Owner Profile
      .addCase(submitOwnerProfile.fulfilled, (state) => {
        state.loading = false;
        if (state.status) {
          state.status.profileData = {
            ...state.status.profileData,
            isOwnerProfileComplete: true
          };
        }
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.startsWith('restaurant/'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) && action.type.startsWith('restaurant/'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('restaurant/'),
        (state, action: any) => {
          state.error = (action.payload as string) || 'An error occurred';
        }
      );
  },
});

export const { 
  clearRestaurantError, 
  markOwnerProfileComplete, 
  setSelectedRestaurantId,
  setRestaurantOnline
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
