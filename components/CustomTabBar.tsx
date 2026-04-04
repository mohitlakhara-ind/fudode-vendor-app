import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown, 
  FadeOutUp,
  LinearTransition,
  ZoomIn
} from 'react-native-reanimated';

import { GlassView } from './ui/GlassView';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { isModalOpen } = useSelector((state: RootState) => state.ui);

  // Glassy background color (more transparent to show blur)
  const glassyBg = theme.surface + (isDark ? '66' : '99');

  const liveOpsRoutes = ['index', 'stock', 'reviews', 'more'];
  const manageRoutes = ['dashboard', 'promotions', 'catalog', 'earnings'];

  const currentRouteName = state.routes[state.index].name;
  const isManageMode = manageRoutes.includes(currentRouteName);
  const activeGroup = isManageMode ? manageRoutes : liveOpsRoutes;

  const handleNavigate = (routeName: string) => {
    if (routeName !== currentRouteName) {
      navigation.navigate(routeName);
    }
  };

  const animatedModeCircleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isManageMode ? theme.primary : theme.secondary),
      transform: [{ scale: withSpring(1) }],
    };
  });

  if (isModalOpen) return null;

  const renderTab = (routeName: string, index: number) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;
    const { options } = descriptors[route.key];
    const isFocused = currentRouteName === routeName;

    return (
      <Animated.View
        key={`${routeName}-${isManageMode}`}
        entering={FadeInDown.delay(index * 50).duration(400).springify()}
        exiting={FadeOutUp.duration(200)}
        style={styles.tab}
      >
        <Pressable
          onPress={() => handleNavigate(route.name)}
          style={styles.tabPressable}
        >
          {options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? theme.primary : theme.icon,
            size: 22,
          })}
          <Text
            style={[
              styles.labelText,
              { color: isFocused ? theme.primary : theme.icon, fontWeight: isFocused ? '700' : '500' }
            ]}
            numberOfLines={1}
          >
            {options.title || route.name}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: glassyBg, borderTopColor: theme.border }]}>
      <GlassView
        intensity={50}
        tint={isDark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 32, borderTopRightRadius: 32 }]}
      />
      <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>

        {/* LEFT SECTION */}
        <Animated.View layout={LinearTransition.springify()} style={styles.section}>
          {activeGroup.slice(0, 2).map((route, idx) => renderTab(route, idx))}
        </Animated.View>

        {/* OVERSIZED CIRCULAR CENTER TOGGLE */}
        <View style={styles.centerAnchor}>
          <AnimatedPressable
            onPress={() => handleNavigate(isManageMode ? 'index' : 'dashboard')}
            style={[
              styles.modeCircle,
              animatedModeCircleStyle
            ]}
          >
            <Animated.View 
              key={isManageMode ? 'manage' : 'live'}
              entering={ZoomIn.duration(400)}
              style={styles.iconContainer}
            >
              <Ionicons
                name={isManageMode ? "flash-outline" : "grid-outline"}
                size={24}
                color={theme.background}
              />
              <Text style={[styles.modeText, { color: theme.background }]}>
                {isManageMode ? 'TO LIVE' : 'TO HUB'}
              </Text>
            </Animated.View>
          </AnimatedPressable>
        </View>

        {/* RIGHT SECTION */}
        <Animated.View layout={LinearTransition.springify()} style={styles.section}>
          {activeGroup.slice(2, 4).map((route, idx) => renderTab(route, idx + 2))}
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  labelText: {
    ...Typography.Caption,
    fontSize: 10,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  centerAnchor: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -55,
    borderWidth: 6,
    borderColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    ...Typography.Caption,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  }
});