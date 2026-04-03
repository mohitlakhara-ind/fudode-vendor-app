import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'menu/createCategory',
  async (details: { name: string; parentCategoryId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/categories', details);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category');
    }
  }
);

export const reorderCategories = createAsyncThunk(
  'menu/reorderCategories',
  async (categoryIds: string[], { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/categories/reorder', { categories: categoryIds });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder categories');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'menu/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/categories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
    }
  }
);

export const fetchItems = createAsyncThunk(
  'menu/fetchItems',
  async (params: { categoryId?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/items', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch items');
    }
  }
);

export const createItem = createAsyncThunk(
  'menu/createItem',
  async (item: Partial<MenuItem>, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/items', item);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create item');
    }
  }
);

export const updateItemStatus = createAsyncThunk(
  'menu/updateItemStatus',
  async ({ id, status }: { id: string; status: 'AVAILABLE' | 'SOLD_OUT' }, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/items/status', { id, status });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item status');
    }
  }
);

export const reorderItems = createAsyncThunk(
  'menu/reorderItems',
  async ({ categoryId, itemIds }: { categoryId: string; itemIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/items/reorder', { categoryId, items: itemIds });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder items');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || 'An error occurred';
        }
      );
  },
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
