import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { store, AppDispatch, RootState } from '@/store/store';
import { initializeAuth } from '@/store/slices/authSlice';
import { getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { getOwnerProfile } from '@/store/slices/profileSlice';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

import { 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold, 
  useFonts as usePoppins 
} from '@expo-google-fonts/poppins';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  useFonts as useInter 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { Loading } from '@/components/ui/Loading';

function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { colorScheme } = useAppTheme();
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, loading, kycStatus } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  // Load Fonts
  const [poppinsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { status: restaurantStatus, loading: restaurantLoading } = useSelector((state: RootState) => state.restaurant);

  useEffect(() => {
    if (poppinsLoaded && interLoaded) {
      dispatch(initializeAuth());
      setIsReady(true);
    }
  }, [dispatch, poppinsLoaded, interLoaded]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getRestaurantStatus());
      // getOwnerProfile is now redundant as getRestaurantStatus fetches the profile
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isReady || loading) return;

    const inAuthGroup = (segments as any).includes('(auth)');
    const currentPath = segments.join('/');
    console.log('[AppNavigator] State:', { currentPath, segments, isAuthenticated, restaurantStatus: restaurantStatus?.onboardingStatus, loading, isReady });

    if (!isAuthenticated) {
      if (!currentPath.includes('login') && !currentPath.includes('verify')) {
        console.log('[AppNavigator] Redirecting to login');
        router.replace('/(auth)/login');
      }
    } else {
      // 1. Wait if we're in the middle of fetching the status for the first time
      if (restaurantLoading && !restaurantStatus) {
        console.log('[AppNavigator] Initial status fetch in progress...');
        return;
      }

      // 2. Decide based on status
      if (!restaurantStatus) {
        if (!restaurantLoading) {
           console.log('[AppNavigator] No restaurant status found, defaulting to owner-profile');
           if (currentPath !== '(auth)/owner-profile' && !currentPath.includes('verify')) {
             router.replace('/(auth)/owner-profile');
           }
        }
        return;
      }

      // 3. Status exists, follow the steps
      // Note: If onboardingStatus exists, Phase 2 (Identity) MUST be complete as it's the prerequisite for restaurant creation
      const isVerified = restaurantStatus.onboardingStatus === 'VERIFIED' || restaurantStatus.onboardingStatus === 'COMPLETED';
      const isOwnerComplete = restaurantStatus.profileData?.isOwnerProfileComplete || !!restaurantStatus.onboardingStatus;

      const inOnboardingGroup = 
        currentPath.includes('onboarding') || 
        currentPath.includes('store-profile') ||
        currentPath.includes('kyc') || 
        currentPath.includes('contract');

      // PHASE 2 CHECK: Owner Identity
      if (!isOwnerComplete) {
        if (!currentPath.includes('owner-profile') && !currentPath.includes('verify')) {
          console.log('[AppNavigator] Owner profile incomplete, forcing Phase 2 Identity Verification');
          router.replace('/(auth)/owner-profile');
          return;
        }
      } 
      // PHASE 3 CHECK: Restaurant Verification
      else if (!isVerified) {
        // Only redirect to onboarding if we are not already in its sub-screens
        if (!inOnboardingGroup && !currentPath.includes('onboarding')) {
          console.log('[AppNavigator] Phase 2 complete, transitioning to Phase 3 Onboarding');
          router.replace('/(auth)/onboarding');
          return;
        }
      } 
      // VERIFIED: Move to Tabs
      else if (currentPath === '' || (segments as any).includes('(auth)')) {
        console.log('[AppNavigator] Fully verified, redirecting to dashboard');
        router.replace('/(tabs)');
        return;
      }
    }
    
    // Hide splash screen only when we are sure where the user belongs
    SplashScreen.hideAsync();
  }, [isAuthenticated, restaurantStatus, segments, loading, isReady, router, restaurantLoading]);

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.surface,
      text: Colors.dark.text,
      border: Colors.dark.border,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.surface,
      text: Colors.light.text,
      border: Colors.light.border,
    },
  };

  const inAuthGroup = (segments as any).includes('(auth)');
  
  // INITIAL INITIALIZATION ONLY
  // Once the app is ready, we keep the stack mounted to prevent native de-sync errors
  const isAppInitializing = !isReady || (loading && !inAuthGroup);

  if (isAppInitializing) {
    return <Loading />;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)/verify" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/owner-profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/store-profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/kyc" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/contract" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Settings' }} />

        <Stack.Screen name="restaurant-status" options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
