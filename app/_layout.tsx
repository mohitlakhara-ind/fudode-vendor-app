import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router';
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
  initialRouteName: '(auth)',
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
  const segments = useSegments() as string[];
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = !!rootNavigationState?.key;
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

  const { status: restaurantStatus, loading: restaurantLoading, error: restaurantError } = useSelector((state: RootState) => state.restaurant);

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
    const isAppInitializing = !isReady || loading || !isNavigationReady || (isAuthenticated && !restaurantStatus && restaurantLoading);

    if (isAppInitializing) {
      console.log('[AppNavigator] Initializing/Fetching state. Waiting to mount navigator...');
      return;
    }

    const inAuthGroup = (segments as any).includes('(auth)');
    const currentPath = segments.join('/');
    console.log('[AppNavigator] State:', { 
      currentPath, 
      segments, 
      isAuthenticated, 
      restaurantStatus: restaurantStatus?.onboardingStatus, 
      restaurantLoading, // Added for better debugging
      loading, 
      isReady, 
      restaurantError 
    });

    if (!isAuthenticated) {
      if (!currentPath.includes('login') && !currentPath.includes('verify')) {
        console.log('[AppNavigator] Redirecting to login');
        requestAnimationFrame(() => {
          router.replace('/(auth)/login');
        });
      }
    } else {
      // 2. Decide based on status
      if (!restaurantStatus) {
        if (!restaurantLoading) {
           // If we have an error, don't automatically redirect as it might cause a loop if the target screen also fetches
           if (restaurantError) {
             console.log('[AppNavigator] Status fetch failed with error:', restaurantError);
             return;
           }

            console.log('[AppNavigator] No restaurant status found, defaulting to owner-profile');
            // Simplified check: since we are authenticated, we should arrive at owner-profile if no restaurant exists
            if (!segments.includes('owner-profile') && !segments.includes('verify')) {
              requestAnimationFrame(() => {
                router.replace('/(auth)/owner-profile');
              });
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
        if (!segments.includes('owner-profile') && !segments.includes('verify')) {
          console.log('[AppNavigator] Owner profile incomplete, forcing Phase 2 Identity Verification');
          requestAnimationFrame(() => {
            router.replace('/(auth)/owner-profile');
          });
          return;
        }
      } 
      // PHASE 3 CHECK: Restaurant Verification
      else if (!isVerified) {
        // Only redirect to onboarding if we are not already in its sub-screens
        if (!inOnboardingGroup && !segments.includes('onboarding')) {
          console.log('[AppNavigator] Phase 2 complete, transitioning to Phase 3 Onboarding');
          requestAnimationFrame(() => {
            router.replace('/(auth)/onboarding');
          });
          return;
        }
      } 
      // VERIFIED: Move to Tabs
      else if (currentPath === '' || (segments as any).includes('(auth)') || currentPath === '/') {
        // Only redirect if we ARE NOT already in the tabs group
        if (!segments.includes('(tabs)')) {
          console.log('[AppNavigator] Fully verified, redirecting to tabs');
          requestAnimationFrame(() => {
            router.replace('/(tabs)');
          });
        }
        return;
      }
    }
    
    // Hide splash screen only when we are sure where the user belongs
    if (isReady && !loading && isNavigationReady && (!isAuthenticated || restaurantStatus || !restaurantLoading)) {
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, restaurantStatus, segments, loading, isReady, router, restaurantLoading, isNavigationReady, restaurantError]);

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
  // We stay in loading state until:
  // 1. Core JS/Fonts are ready
  // 2. Auth state is determined
  // 3. If authenticated, restaurant status is determined
  const isAppInitializing = !isReady || loading || !isNavigationReady || (isAuthenticated && !restaurantStatus && restaurantLoading);

  if (isAppInitializing) {
    return <Loading />;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* We use the (auth) group which now contains its own layout stack
            This improves initialization reliability */}
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        
        {/* Main App tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Helper screens */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Settings' }} />
        <Stack.Screen name="restaurant-status" options={{ animation: 'slide_from_right' }} />
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
