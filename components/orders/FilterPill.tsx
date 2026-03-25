import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolateColor,
  withSpring
} from 'react-native-reanimated';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  count?: number;
  color?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterPill = ({ label, isActive, onPress, icon, count, color }: FilterPillProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const activeColor = color || theme.primary;

  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const glassyBg = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.7)';

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [glassyBg, `${activeColor}15`]
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(0, 0, 0, 0.08)', activeColor]
      ),
      borderWidth: withTiming(isActive ? 1.5 : 1),
      transform: [{ scale: withSpring(isActive ? 1.05 : 1, { damping: 15, stiffness: 150 }) }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [theme.icon, activeColor]
      ),
    };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scaleX: progress.value }],
    };
  });

  const animatedBadgeStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [`${theme.icon}20`, activeColor]
      ),
    };
  });

  const animatedBadgeTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [theme.icon, '#FFFFFF']
      ),
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.pill, animatedPillStyle]}
    >
      <View style={styles.content}>
        {icon}
        <Animated.Text
          style={[
            styles.label,
            animatedTextStyle,
            { fontWeight: isActive ? '700' : '600' }
          ]}
        >
          {label}
        </Animated.Text>
        
        {typeof count === 'number' && count > 0 && (
          <Animated.View style={[styles.countBadge, animatedBadgeStyle]}>
            <Animated.Text style={[styles.countText, animatedBadgeTextStyle]}>
              {count}
            </Animated.Text>
          </Animated.View>
        )}
      </View>

      <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle, { backgroundColor: activeColor }]} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 4,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...Typography.Caption,
    textTransform: 'capitalize',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '30%',
    right: '30%',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: -2,
  },
  countText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
  },
});