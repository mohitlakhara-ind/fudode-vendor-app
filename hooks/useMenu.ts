import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchCategories, createCategory, fetchItems, updateItemStatus } from '../store/slices/menuSlice';

export const useMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, items, loading, error } = useSelector((state: RootState) => state.menu);

  const handleFetchCategories = () => {
    return dispatch(fetchCategories());
  };

  const handleCreateCategory = (payload: { name: string; parentCategoryId?: string }) => {
    return dispatch(createCategory(payload));
  };

  const handleFetchItems = (categoryId: string) => {
    return dispatch(fetchItems(categoryId));
  };

  const handleUpdateItemStatus = (payload: { id: string; status: string }) => {
    return dispatch(updateItemStatus(payload));
  };

  return {
    categories,
    items,
    loading,
    error,
    fetchCategories: handleFetchCategories,
    createCategory: handleCreateCategory,
    fetchItems: handleFetchItems,
    updateItemStatus: handleUpdateItemStatus,
  };
};
