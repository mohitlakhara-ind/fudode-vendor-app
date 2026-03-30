import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
}

export const AnimatedCard = ({ children, index = 0, delay = 100 }: AnimatedCardProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      index * delay, 
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      index * delay, 
      withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};
