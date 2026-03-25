import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { Category, MenuItem } from '../../api/types';

interface MenuState {
  categories: Category[];
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'menu/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/categories');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'menu/createCategory',
  async (payload: { name: string; parentCategoryId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/categories', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category');
    }
  }
);

export const fetchItems = createAsyncThunk(
  'menu/fetchItems',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/items', { params: { categoryId } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch items');
    }
  }
);

export const updateItemStatus = createAsyncThunk(
  'menu/updateItemStatus',
  async (payload: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/items/status', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item status');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      });
  },
});

export default menuSlice.reducer;
