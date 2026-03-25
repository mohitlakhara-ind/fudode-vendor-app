import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { getMyRestaurants, kycOnboard } from '../store/slices/profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, loading, error } = useSelector((state: RootState) => state.profile);

  const handleGetMyRestaurants = () => {
    return dispatch(getMyRestaurants());
  };

  const handleKycOnboard = (payload: any) => {
    return dispatch(kycOnboard(payload));
  };

  return {
    restaurants,
    loading,
    error,
    getMyRestaurants: handleGetMyRestaurants,
    kycOnboard: handleKycOnboard,
  };
};
