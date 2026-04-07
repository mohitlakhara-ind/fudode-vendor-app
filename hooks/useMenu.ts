import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
  fetchCategories, 
  createCategory, 
  fetchItems, 
  updateItemStatus,
  reorderItems,
  reorderVariants,
  fetchAddonGroups,
  createAddonGroup,
  updateAddonGroup,
  deleteAddonGroup,
  getAddonGroupDetail,
  createAddonOption,
  fetchAddonOptions,
  updateAddonOption,
  deleteAddonOption,
  reorderAddonOptions
} from '../store/slices/menuSlice';
import { MenuItemStatus } from '../api/types';

export const useMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, items, addonGroups, loading, error } = useSelector((state: RootState) => state.menu);

  const handleFetchCategories = () => {
    return dispatch(fetchCategories());
  };

  const handleCreateCategory = (payload: { name: string; parentCategoryId?: string }) => {
    return dispatch(createCategory(payload));
  };

  const handleFetchItems = (categoryId: string) => {
    return dispatch(fetchItems({ categoryId }));
  };

  const handleUpdateItemStatus = (payload: { id: string; status: MenuItemStatus }) => {
    return dispatch(updateItemStatus(payload));
  };

  const handleReorderItems = (payload: { categoryId: string; items: string[] }) => {
    return dispatch(reorderItems(payload));
  };

  const handleReorderVariants = (payload: { itemId: string; variants: string[] }) => {
    return dispatch(reorderVariants(payload));
  };

  const handleFetchAddonGroups = () => {
    return dispatch(fetchAddonGroups());
  };

  const handleCreateAddonGroup = (details: any) => {
    return dispatch(createAddonGroup(details));
  };

  const handleUpdateAddonGroup = (id: string, details: any) => {
    return dispatch(updateAddonGroup({ id, details }));
  };

  const handleDeleteAddonGroup = (id: string) => {
    return dispatch(deleteAddonGroup(id));
  };

  const handleGetAddonGroupDetail = (id: string) => {
    return dispatch(getAddonGroupDetail(id));
  };

  const handleCreateAddonOption = (groupId: string, details: any) => {
    return dispatch(createAddonOption({ groupId, details }));
  };

  const handleFetchAddonOptions = (groupId: string) => {
    return dispatch(fetchAddonOptions(groupId));
  };

  const handleUpdateAddonOption = (optionId: string, details: any) => {
    return dispatch(updateAddonOption({ optionId, details }));
  };

  const handleDeleteAddonOption = (optionId: string) => {
    return dispatch(deleteAddonOption(optionId));
  };

  const handleReorderAddonOptions = (payload: { groupId: string; orderedOptionIds: string[] }) => {
    return dispatch(reorderAddonOptions(payload));
  };

  return {
    categories,
    items,
    loading,
    error,
    addonGroups,
    fetchCategories: handleFetchCategories,
    createCategory: handleCreateCategory,
    fetchItems: handleFetchItems,
    updateItemStatus: handleUpdateItemStatus,
    reorderItems: handleReorderItems,
    reorderVariants: handleReorderVariants,
    fetchAddonGroups: handleFetchAddonGroups,
    createAddonGroup: handleCreateAddonGroup,
    updateAddonGroup: handleUpdateAddonGroup,
    deleteAddonGroup: handleDeleteAddonGroup,
    getAddonGroupDetail: handleGetAddonGroupDetail,
    createAddonOption: handleCreateAddonOption,
    fetchAddonOptions: handleFetchAddonOptions,
    updateAddonOption: handleUpdateAddonOption,
    deleteAddonOption: handleDeleteAddonOption,
    reorderAddonOptions: handleReorderAddonOptions,
  };
};
