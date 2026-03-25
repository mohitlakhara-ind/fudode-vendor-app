import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { MyRestaurant, OwnerProfile } from '../../api/types';

interface ProfileState {
  restaurants: MyRestaurant[];
  ownerProfile: OwnerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  restaurants: [],
  ownerProfile: null,
  loading: false,
  error: null,
};

export const getMyRestaurants = createAsyncThunk(
  'profile/getMyRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/get/my');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch restaurants');
    }
  }
);

export const getOwnerProfile = createAsyncThunk(
  'profile/getOwnerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/get');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch owner profile');
    }
  }
);

export const setOwnerProfile = createAsyncThunk(
  'profile/setOwnerProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/set', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set owner profile');
    }
  }
);

export const kycOnboard = createAsyncThunk(
  'profile/kycOnboard',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/kyc/onboard', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit KYC');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.data;
      })
      .addCase(getMyRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOwnerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProfile = action.payload.data;
      })
      .addCase(getOwnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setOwnerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(setOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProfile = action.payload.data;
      })
      .addCase(setOwnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
