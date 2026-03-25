import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { requestOtp, verifyOtp, logout, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleRequestOtp = (number: string) => {
    return dispatch(requestOtp(number));
  };

  const handleVerifyOtp = (payload: {
    number: string;
    otp: string;
    deviceId: string;
    deviceType: string;
  }) => {
    console.log('useAuth: handleVerifyOtp called with:', payload.number, payload.otp);
    return dispatch(verifyOtp(payload));
  };

  const handleLogout = () => {
    return dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    requestOtpAction: handleRequestOtp,
    verifyOtpAction: handleVerifyOtp,
    logoutAction: handleLogout,
    clearError: handleClearError,
  };
};
