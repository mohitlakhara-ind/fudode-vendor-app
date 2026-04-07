import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import { 
  Category, 
  MenuItem, 
  AddonGroup, 
  CategoryCreateRequest, 
  CategoryUpdateRequest,
  CategoryDeleteRequest,
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemStatusUpdate,
  AddonGroupCreateRequest,
  ItemReorderRequest,
  VariantReorderRequest,
  AddonOptionCreateRequest,
  AddonOptionUpdateRequest,
  AddonOptionReorderRequest,
} from '../../api/types';

interface MenuState {
  categories: Category[];
  items: MenuItem[];
  addonGroups: AddonGroup[];
  loading: boolean;
  error: string | null;
  categoriesFetched: boolean;
  itemsFetched: boolean;
  addonGroupsFetched: boolean;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  addonGroups: [],
  loading: false,
  error: null,
  categoriesFetched: false,
  itemsFetched: false,
  addonGroupsFetched: false,
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
  async ({ id, params }: { id: string; params?: CategoryDeleteRequest }, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/categories/${id}`, { params });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete category');
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

export const deleteItem = createAsyncThunk(
  'menu/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/items/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete item');
    }
  }
);

export const reorderItems = createAsyncThunk(
  'menu/reorderItems',
  async (payload: ItemReorderRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/items/reorder', payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder items');
    }
  }
);

export const reorderVariants = createAsyncThunk(
  'menu/reorderVariants',
  async (payload: VariantReorderRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/variants/reorder', payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder variants');
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

export const getAddonGroupDetail = createAsyncThunk(
  'menu/getAddonGroupDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/menu/addon-groups/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch addon group detail');
    }
  }
);

/** 4.4 Addon Options */

export const createAddonOption = createAsyncThunk(
  'menu/createAddonOption',
  async ({ groupId, details }: { groupId: string; details: AddonOptionCreateRequest }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/menu/addon-groups/${groupId}/options`, details);
      return { groupId, option: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create addon option');
    }
  }
);

export const fetchAddonOptions = createAsyncThunk(
  'menu/fetchAddonOptions',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/menu/addon-groups/${groupId}/options`);
      return { groupId, options: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch addon options');
    }
  }
);

export const updateAddonOption = createAsyncThunk(
  'menu/updateAddonOption',
  async ({ optionId, details }: { optionId: string; details: AddonOptionUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/menu/addon-groups/${optionId}/options`, details);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update addon option');
    }
  }
);

export const deleteAddonOption = createAsyncThunk(
  'menu/deleteAddonOption',
  async (optionId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/addon-groups/${optionId}/options`);
      return optionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete addon option');
    }
  }
);

export const reorderAddonOptions = createAsyncThunk(
  'menu/reorderAddonOptions',
  async (payload: AddonOptionReorderRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch('/menu/addon-groups/reorder/options', payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder addon options');
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
    resetMenuFetchedStates: (state) => {
      state.categoriesFetched = false;
      state.itemsFetched = false;
      state.addonGroupsFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = (action.payload || []).filter((c: any) => !!c);
        state.loading = false;
        state.categoriesFetched = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
        state.loading = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...action.payload };
        }
        state.loading = false;
      })
      .addCase(reorderCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      // Items
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = (action.payload || []).filter((i: any) => !!i);
        state.loading = false;
        state.itemsFetched = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.loading = false;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.loading = false;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
        state.loading = false;
      })
      .addCase(reorderItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(reorderVariants.fulfilled, (state, action) => {
        // Find item and update its variants
        if (action.payload && action.payload.id) {
          const index = state.items.findIndex(i => i.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
          }
        }
        state.loading = false;
      })
      // Addon Groups
      .addCase(fetchAddonGroups.fulfilled, (state, action) => {
        // Ensure every group has an addons array even if backend doesn't send it
        state.addonGroups = (action.payload || []).map((group: any) => ({
          ...group,
          addons: group.addons || []
        }));
        state.addonGroupsFetched = true;
        state.loading = false;
      })
      .addCase(getAddonGroupDetail.fulfilled, (state, action) => {
        const index = state.addonGroups.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.addonGroups[index] = action.payload;
        } else {
          state.addonGroups.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createAddonGroup.fulfilled, (state, action) => {
        const newGroup = {
          ...action.payload,
          addons: action.payload.addons || []
        };
        state.addonGroups.push(newGroup);
        state.loading = false;
      })
      .addCase(updateAddonGroup.fulfilled, (state, action) => {
        const updatedGroup = {
          ...action.payload,
          addons: action.payload.addons || []
        };
        const index = state.addonGroups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          state.addonGroups[index] = { ...state.addonGroups[index], ...updatedGroup };
        }
        state.loading = false;
      })
      .addCase(deleteAddonGroup.fulfilled, (state, action) => {
        state.addonGroups = state.addonGroups.filter(g => g.id !== action.payload);
        state.loading = false;
      })
      // Addon Options
      .addCase(fetchAddonOptions.fulfilled, (state, action) => {
        const { groupId, options } = action.payload;
        const index = state.addonGroups.findIndex(g => g.id === groupId);
        if (index !== -1) {
          state.addonGroups[index].addons = options;
        }
        state.loading = false;
      })
      .addCase(createAddonOption.fulfilled, (state, action) => {
        const { groupId, option } = action.payload;
        const index = state.addonGroups.findIndex(g => g.id === groupId);
        if (index !== -1) {
          if (!state.addonGroups[index].addons) state.addonGroups[index].addons = [];
          state.addonGroups[index].addons.push(option);
        }
        state.loading = false;
      })
      .addCase(updateAddonOption.fulfilled, (state, action) => {
        const option = action.payload;
        // Search in all groups (simplest way if we don't know the groupId)
        state.addonGroups.forEach(group => {
          if (group.addons) {
            const optIndex = group.addons.findIndex(o => o.id === option.id);
            if (optIndex !== -1) {
              group.addons[optIndex] = option;
            }
          }
        });
        state.loading = false;
      })
      .addCase(deleteAddonOption.fulfilled, (state, action) => {
        const optionId = action.payload;
        state.addonGroups.forEach(group => {
          if (group.addons) {
            group.addons = group.addons.filter(o => o.id !== optionId);
          }
        });
        state.loading = false;
      })
      .addCase(reorderAddonOptions.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const index = state.addonGroups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          state.addonGroups[index] = updatedGroup;
        }
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

export const { clearMenuError, resetMenuFetchedStates } = menuSlice.actions;
export default menuSlice.reducer;
