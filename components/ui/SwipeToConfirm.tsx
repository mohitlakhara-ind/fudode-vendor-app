import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { ArrowRight } from 'phosphor-react-native';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  label?: string;
  color?: string;
}

const BUTTON_WIDTH = Dimensions.get('window').width - 48;
const BUTTON_HEIGHT = 64;
const BUTTON_PADDING = 4;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

export const SwipeToConfirm = ({
  onConfirm,
  label = 'Slide to Accept',
  color
}: SwipeToConfirmProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const activeColor = color || theme.primary;

  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);

  const onConfirmInternal = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
  }, [onConfirm]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newVal = contextX.value + event.translationX;
      translateX.value = Math.min(Math.max(newVal, 0), SWIPE_RANGE);
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_RANGE * 0.85) {
        translateX.value = withSpring(SWIPE_RANGE);
        runOnJS(onConfirmInternal)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: interpolateColor(
        translateX.value,
        [0, SWIPE_RANGE],
        [activeColor, '#10B981']
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, SWIPE_RANGE * 0.4], [1, 0], Extrapolate.CLAMP),
      transform: [{ translateX: interpolate(translateX.value, [0, SWIPE_RANGE], [0, 20]) }],
    };
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + BUTTON_HEIGHT,
      backgroundColor: interpolateColor(
        translateX.value,
        [0, SWIPE_RANGE],
        [activeColor, '#10B981']
      ),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
      <Animated.View style={[styles.progressBar, animatedProgressStyle]} />

      <Animated.View style={[styles.textWrapper, animatedTextStyle]}>
        <Text style={[styles.text, { color: theme.text }]}>
          {label}
        </Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.handle, animatedHandleStyle]}>
          <ArrowRight size={28} weight="bold" color="#000" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BUTTON_HEIGHT,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    padding: BUTTON_PADDING,
    borderWidth: 1,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  handle: {
    width: BUTTON_HEIGHT - BUTTON_PADDING * 2,
    height: BUTTON_HEIGHT - BUTTON_PADDING * 2,
    borderRadius: 12,
    position: 'absolute',
    left: BUTTON_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    ...Typography.Caption,
    fontSize: 14,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
