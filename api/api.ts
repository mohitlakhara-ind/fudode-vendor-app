import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// In-memory fallback for broken environments (e.g. missing native module)
const memoryStorage: Record<string, string> = {};
export const storage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  }
};

const API_BASE_URL = (process.env.API_BASE_URL ? process.env.API_BASE_URL + "/restaurant" : 'https://vg4629bg-9000.inc1.devtunnels.ms/restaurant');

export const getPersistentDeviceId = async () => {
  try {
    let deviceId = await storage.getItem('deviceId');
    if (!deviceId) {
      // Generate a 16-character hex string (Android ID format)
      const hex = '0123456789abcdef';
      deviceId = '';
      for (let i = 0; i < 16; i++) {
        deviceId += hex.charAt(Math.floor(Math.random() * hex.length));
      }
      await storage.setItem('deviceId', deviceId);
    }
    return deviceId;
  } catch (e) {
    console.warn('getPersistentDeviceId fallback:', e);
    return 'f1a7b6c5d4e3f2a1'; // Standard 16-char hex fallback
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Interceptor failed to get token, proceed without it
      console.debug('[API Interceptor] Storage error:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const deviceId = await AsyncStorage.getItem('deviceId');

        if (refreshToken && deviceId) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
            deviceId,
          });

          const { accessToken } = response.data;
          await AsyncStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // You might want to trigger a logout action in Redux here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
