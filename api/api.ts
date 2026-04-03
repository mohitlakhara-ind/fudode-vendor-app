import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

// --- AUTH HANDLERS ---
let logoutHandler: () => void = () => {};

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

// --- STORAGE CONFIGURATION (Guide Section 3) ---

const AUTH_KEYS = {
  ACCESS_TOKEN: 'fudode_access_token',
  REFRESH_TOKEN: 'fudode_refresh_token',
  USER_ID: 'fudode_user_id',
  DEVICE_ID: 'fudode_device_id',
  KYC_STATUS: 'fudode_kyc_status'
};

// High-security storage for tokens
export const storage = {
  getItem: async (key: string) => {
    try {
      // Use SecureStore for potentially sensitive auth keys
      if (key.includes('Token') || key.includes('fudode')) {
        return await SecureStore.getItemAsync(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (key.includes('Token') || key.includes('fudode')) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.error(`[Storage] Failed to set ${key}:`, e);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (key.includes('Token') || key.includes('fudode')) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`[Storage] Failed to remove ${key}:`, e);
    }
  }
};

// --- API CONFIGURATION (Guide Section 4) ---
// Remove "/restaurant" suffix to allow multi-module routing (/auth, /profile, etc)
const API_BASE_URL = (process.env.API_BASE_URL || 'https://vg4629bg-9000.inc1.devtunnels.ms/restaurant');

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getPersistentDeviceId = async () => {
  try {
    let deviceId = await storage.getItem(AUTH_KEYS.DEVICE_ID);
    
    // Check if deviceId exists and follows UUID v4 format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!deviceId || !uuidRegex.test(deviceId)) {
      deviceId = generateUUID();
      await storage.setItem(AUTH_KEYS.DEVICE_ID, deviceId);
    }
    return deviceId as string;
  } catch (e) {
    return '00000000-0000-4000-8000-000000000000';
  }
};



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor (Guide Section 6)
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // LOG REQUEST
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('Body:', config.data instanceof FormData ? '[FormData]' : JSON.stringify(config.data, null, 2));
    }
    
    return config;
  },

  (error) => Promise.reject(error)
);

// Response Interceptor for Silent Refresh (Guide Section 7)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // LOG SUCCESSFUL RESPONSE
    console.log(`✅ [API Success] ${response.config.method?.toUpperCase()} ${response.config.url} | Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    return response;
  },
  async (error) => {
    // LOG ERROR RESPONSE
    console.log(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response?.status || 'Network Error'}`);
    if (error.response?.data) {
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
    }

    const originalRequest = error.config;


    // Handle 401 Unauthorized errors
    const isAuthEndpoint = originalRequest.url?.includes('/auth/logout') || 
                          originalRequest.url?.includes('/auth/verify') || 
                          originalRequest.url?.includes('/auth/request');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storage.getItem(AUTH_KEYS.REFRESH_TOKEN);
        const deviceId = await getPersistentDeviceId();

        if (!refreshToken) throw new Error('No refresh token available');

        // Silent Refresh Call
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
          deviceId,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // SAVE BOTH TOKENS (Rotation strategy)
        await storage.setItem(AUTH_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          await storage.setItem(AUTH_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear session on refresh failure
        await storage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
        await storage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
        
        // Trigger global logout
        logoutHandler();
        
        return Promise.reject(refreshError);
      }

    }

    return Promise.reject(error);
  }
);

export default api;

