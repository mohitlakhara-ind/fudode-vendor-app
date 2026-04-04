import React from 'react';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  FadeOutLeft
} from 'react-native-reanimated';
import { StyleSheet, ViewProps, Dimensions, View } from 'react-native';
import { usePathname } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedPageProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that provides horizontal slide and fade animations
 * when shifting between the 'Live' and 'Hub' sections of the app.
 */
const LIVE_ROUTES = ['/', '/stock', '/reviews', '/more'];
const MANAGE_ROUTES = ['/dashboard', '/promotions', '/catalog', '/earnings'];

// Module-level variable to track last known route globally
let globalLastPathname = '';

function getGroup(path: string) {
  if (MANAGE_ROUTES.some(r => path.startsWith(r) && r !== '/') || MANAGE_ROUTES.includes(path)) return 'manage';
  return 'live';
}

export function AnimatedPage({ children, style, ...props }: AnimatedPageProps) {
  const pathname = usePathname();
  
  // Determine if this is a transition between 'Live' and 'Hub' modes
  const currentGroup = getGroup(pathname);
  const lastGroup = getGroup(globalLastPathname);
  const isModeSwitch = globalLastPathname !== '' && currentGroup !== lastGroup;

  const opacity = useSharedValue(isModeSwitch ? 0 : 1);
  const translateY = useSharedValue(isModeSwitch ? 50 : 0);
  const prevPathname = React.useRef(pathname);

  React.useEffect(() => {
    if (isModeSwitch && prevPathname.current !== pathname) {
      // Safe to set values here
      opacity.value = 0;
      translateY.value = 50;
      
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    }
    
    prevPathname.current = pathname;
    globalLastPathname = pathname;
  }, [pathname, isModeSwitch]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isModeSwitch ? opacity.value : 1,
    transform: [{ translateY: isModeSwitch ? translateY.value : 0 }],
  }));

  // If it's not a mode switch, we return a standard view to respect default navigation behavior
  if (!isModeSwitch && globalLastPathname !== '') {
    return (
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, isModeSwitch ? { opacity: 0 } : null, animatedStyle, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
