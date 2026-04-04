import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          animation: 'fade' 
        }} 
      />
      <Stack.Screen name="verify" />
      <Stack.Screen name="owner-profile" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="store-profile" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="contract" />
    </Stack>
  );
}
