import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface PremiumSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  disabled?: boolean;
}

export const PremiumSwitch = ({
  value,
  onValueChange,
  activeColor,
  disabled = false
}: PremiumSwitchProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 15, stiffness: 150 });
  }, [value]);

  const animatedOuterStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', activeColor || theme.primary]
    );
    return { backgroundColor };
  });

  const animatedInnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * 22 }]
    };
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[styles.container,]}
    >
      <Animated.View style={[styles.outer, animatedOuterStyle]}>
        <Animated.View style={[styles.inner, animatedInnerStyle, { backgroundColor: '#fff' }]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 28,
    justifyContent: 'center',
  },
  outer: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  inner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  }
});
