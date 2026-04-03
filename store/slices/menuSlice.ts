import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { 
  Category, 
  MenuItem, 
  AddonGroup, 
  CategoryCreateRequest, 
  CategoryUpdateRequest,
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemStatusUpdate,
  AddonGroupCreateRequest
} from '../../api/types';

interface MenuState {
  categories: Category[];
  items: MenuItem[];
  addonGroups: AddonGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  addonGroups: [],
  loading: false,
  error: null,
};

/** 4.1 Categories */

export const fetchCategories = createAsyncThunk(
  'menu/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/categories');
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'menu/createCategory',
  async (details: CategoryCreateRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/categories', details);
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'menu/updateCategory',
  async ({ id, details }: { id: string; details: CategoryUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/menu/categories/${id}`, details);
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update category');
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

/** 4.2 Menu Items */

export const fetchItems = createAsyncThunk(
  'menu/fetchItems',
  async (params: { categoryId?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/items', { params });
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch items');
    }
  }
);

export const getItemDetail = createAsyncThunk(
  'menu/getItemDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/menu/items/${id}`);
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch item detail');
    }
  }
);

export const createItem = createAsyncThunk(
  'menu/createItem',
  async (item: ItemCreateRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/items', item);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'menu/updateItem',
  async ({ id, details }: { id: string; details: ItemUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/menu/items/${id}`, details);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item');
    }
  }
);

export const updateItemStatus = createAsyncThunk(
  'menu/updateItemStatus',
  async (payload: ItemStatusUpdate, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/items/status', payload);
      return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item status');
    }
  }
);

/** 4.3 Addon Groups */

export const fetchAddonGroups = createAsyncThunk(
  'menu/fetchAddonGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/menu/addon-groups');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch addon groups');
    }
  }
);

export const createAddonGroup = createAsyncThunk(
  'menu/createAddonGroup',
  async (details: AddonGroupCreateRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/addon-groups', details);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create addon group');
    }
  }
);

export const updateAddonGroup = createAsyncThunk(
  'menu/updateAddonGroup',
  async ({ id, details }: { id: string; details: Partial<AddonGroupCreateRequest> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/menu/addon-groups/${id}`, details);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update addon group');
    }
  }
);

export const deleteAddonGroup = createAsyncThunk(
  'menu/deleteAddonGroup',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/addon-groups/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete addon group');
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
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
        state.loading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
        state.loading = false;
      })
      // Items
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.loading = false;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      // Addon Groups
      .addCase(fetchAddonGroups.fulfilled, (state, action) => {
        state.addonGroups = action.payload;
        state.loading = false;
      })
      .addCase(createAddonGroup.fulfilled, (state, action) => {
        state.addonGroups.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteAddonGroup.fulfilled, (state, action) => {
        state.addonGroups = state.addonGroups.filter(g => g.id !== action.payload);
        state.loading = false;
      })
      // Global Loading/Error
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.startsWith('menu/'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('menu/'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || 'An error occurred';
        }
      );
  },
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
