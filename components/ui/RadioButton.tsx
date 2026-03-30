import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  activeColor?: string;
}

export const RadioButton = ({ selected, onPress, label, size = 24, activeColor }: RadioButtonProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const finalActiveColor = activeColor || theme.primary;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[
        styles.outline, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderColor: selected ? finalActiveColor : theme.border,
          backgroundColor: selected ? 'transparent' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
          borderWidth: 1,
        }
      ]}>
        {selected && (
          <View style={[
            styles.inner, 
            { 
              width: size / 2, 
              height: size / 2, 
              borderRadius: size / 4,
              backgroundColor: finalActiveColor 
            }
          ]} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outline: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {},
  label: {
    ...Typography.BodyRegular,
    marginLeft: 12,
  }
});
