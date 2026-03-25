import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

interface SeparatorProps {
  style?: ViewStyle;
  type?: 'solid' | 'dashed';
  marginVertical?: number;
  opacity?: number;
}

export const Separator = ({ 
  style, 
  marginVertical = 16,
  opacity = 1 
}: SeparatorProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View 
      style={[
        styles.separator, 
        { 
          borderBottomColor: theme.border,
          borderBottomWidth: StyleSheet.hairlineWidth * 1.5,
          marginVertical,
          opacity
        }, 
        style
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    width: '100%',
  },
});
