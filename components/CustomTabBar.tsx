import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons'; // Or your preferred icon set
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

import { GlassView } from './ui/GlassView';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { isModalOpen } = useSelector((state: RootState) => state.ui);

  if (isModalOpen) return null;

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

  const renderTab = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;
    const { options } = descriptors[route.key];
    const isFocused = currentRouteName === routeName;

    return (
      <Pressable
        key={route.key}
        onPress={() => handleNavigate(route.name)}
        style={styles.tab}
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
        <View style={styles.section}>
          {activeGroup.slice(0, 2).map(renderTab)}
        </View>

        {/* OVERSIZED CIRCULAR CENTER TOGGLE */}
        <View style={styles.centerAnchor}>
          <Pressable
            onPress={() => handleNavigate(isManageMode ? 'index' : 'dashboard')}
            style={[
              styles.modeCircle,
              { backgroundColor: isManageMode ? theme.primary : theme.secondary } // TODO: change this color
            ]}
          >
            <Ionicons
              name={isManageMode ? "flash-outline" : "grid-outline"}
              size={24}
              color={theme.background} // Dynamic color for icon
            />
            <Text style={[styles.modeText, { color: theme.background }]}>
              {isManageMode ? 'TO LIVE' : 'TO HUB'}
            </Text>
          </Pressable>
        </View>

        {/* RIGHT SECTION */}
        <View style={styles.section}>
          {activeGroup.slice(2, 4).map(renderTab)}
        </View>

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
    // Standard shadow
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
  labelText: {
    ...Typography.Caption,
    fontSize: 10, // Overriding for ultra-compact tab bar
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
    top: -55, // High overlap
    borderWidth: 6,
    borderColor: 'transparent',
  },
  modeText: {
    ...Typography.Caption,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  }
});