import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

/**
 * Common View with theme-aware background
 */
export const ThemedView = ({ style, ...props }: ViewProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View 
      style={[{ backgroundColor: Colors[colorScheme].background }, style]} 
      {...props} 
    />
  );
};

/**
 * Common Text with theme-aware color
 */
export const ThemedText = ({ style, ...props }: TextProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <Text 
      style={[{ color: Colors[colorScheme].text, fontFamily: 'Inter' }, style]} 
      {...props} 
    />
  );
};

/**
 * Vertical or Horizontal Spacer
 */
export const Spacer = ({ size = 16, horizontal = false }: { size?: number; horizontal?: boolean }) => (
  <View style={horizontal ? { width: size } : { height: size }} />
);

/**
 * Subtle Separator line
 */
export const AtomSeparator = ({ marginVertical = 12 }: { marginVertical?: number }) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View 
      style={[
        styles.separator, 
        { 
          backgroundColor: Colors[colorScheme].icon, 
          opacity: 0.1,
          marginVertical 
        }
      ]} 
    />
  );
};

/**
 * Card Container with glassmorphism or plain background
 */
export const Surface = ({ children, style, glass = false }: { children: React.ReactNode; style?: any; glass?: boolean }) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[
      styles.surface, 
      { 
        backgroundColor: glass ? 'transparent' : Colors[colorScheme].background,
        borderColor: Colors[colorScheme].icon + '20'
      }, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
  },
  surface: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  }
});
