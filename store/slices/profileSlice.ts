import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { OwnerProfile, OnboardingStep1 } from '../../api/types';


interface ProfileState {
  ownerProfile: OwnerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  ownerProfile: null,
  loading: false,
  error: null,
};

export const getOwnerProfile = createAsyncThunk(
  'profile/getOwnerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/get');
      // The guide response is { status: true, phone: "...", profileData: { ... } }
      return response.data.profileData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch owner profile');
    }
  }
);

export const setProfileStep1 = createAsyncThunk(
  'profile/setStep1',
  async (details: OnboardingStep1, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set restaurant profile');
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOwnerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProfile = action.payload;
      })
      .addCase(getOwnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setProfileStep1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setProfileStep1.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setProfileStep1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
