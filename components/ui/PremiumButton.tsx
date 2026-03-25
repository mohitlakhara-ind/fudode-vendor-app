import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface PremiumButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glassy';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string; // Force a specific color (e.g. status color)
  onDisabledPress?: () => void;
  progress?: number; // 0 to 1
  isPulsing?: boolean;
}


export const PremiumButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  color,
  onDisabledPress,
  progress,
  isPulsing = false,
}: PremiumButtonProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (isPulsing) {
      pulse.value = withRepeat(
        withTiming(1.05, { duration: 800 }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [isPulsing]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const isDisabled = disabled || isLoading;

  const handlePress = () => {
    if (isDisabled) {
      onDisabledPress?.();
    } else {
      onPress();
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: progress !== undefined ? (color || theme.primary) + '60' : (color || theme.primary),
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.surfaceSecondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: color || theme.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'glassy':
        return {
          backgroundColor: (color || theme.primary) + (isDark ? '15' : '10'),
          borderWidth: 1.5,
          borderColor: (color || theme.primary) + (isDark ? '40' : '30'),
        };
      default:
        return {};
    }
  };

  const getTextStyle = () => {
    const isGlassy = variant === 'glassy';
    const baseColor = variant === 'primary' ? '#000' : (color || theme.text);
    return {
      color: isGlassy ? (color || theme.primary) : (variant === 'primary' && !color ? '#000' : baseColor),
      ...Typography.BodyLarge,
      fontSize: size === 'small' ? 13 : (size === 'large' ? 17 : 16),
      letterSpacing: 0.3,
    };
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { minHeight: 40, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 };
      case 'large':
        return { minHeight: 60, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 16 };
      default:
        return { minHeight: 52, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 };
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={isDisabled ? 0.9 : 0.7}
      style={[
        styles.base,
        getVariantStyle(),
        { 
          minHeight: getSizeStyle().minHeight, 
          borderRadius: getSizeStyle().borderRadius 
        },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedPulseStyle, { backgroundColor: getVariantStyle().backgroundColor, borderRadius: getSizeStyle().borderRadius, opacity: isPulsing ? 0.8 : 0 }]} />

      {progress !== undefined && progress > 0 && (
        <Animated.View 
          style={[
            isPulsing && animatedPulseStyle,
            { 
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: progress >= 1 ? 0 : undefined,
              backgroundColor: color || theme.primary, 
              width: (progress >= 1 ? '100%' : `${(progress * 100).toFixed(2)}%`) as any,
              minWidth: progress > 0 ? 6 : 0,
              zIndex: -1,
            }
          ]} 
        />
      )}

      {isLoading ? (
        <ActivityIndicator color={getTextStyle().color} size="small" />
      ) : (
        <View style={[styles.content, { paddingHorizontal: getSizeStyle().paddingHorizontal, paddingVertical: getSizeStyle().paddingVertical }]}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{label}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
