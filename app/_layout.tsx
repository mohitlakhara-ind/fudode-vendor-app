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

export const unstable_settings = {
  anchor: '(tabs)',
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

  useEffect(() => {
    if (poppinsLoaded && interLoaded) {
      dispatch(initializeAuth());
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [dispatch, poppinsLoaded, interLoaded]);

  useEffect(() => {
    if (!isReady || loading) return;

    if (!segments || segments.length < 1) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isOnboardingGroup = segments[1] === 'onboarding' || segments[1] === 'owner-profile' || segments[1] === 'kyc';

    if (isAuthenticated && !isOnboardingGroup && !inAuthGroup && kycStatus === 'PENDING') {
      // If we're authenticated but somehow ended up in tabs/etc without KYC/Onboarding
      router.replace('/(auth)/onboarding');
    }
  }, [isAuthenticated, kycStatus, segments, loading, isReady, router]);

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

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors[colorScheme].background }}>
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)/verify" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/owner-profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(auth)/kyc" options={{ headerShown: false, animation: 'slide_from_right' }} />
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
