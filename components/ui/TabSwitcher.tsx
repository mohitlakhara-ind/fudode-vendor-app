import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface TabSwitcherProps {
  tabs: string[];
  counts?: Record<string, number>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TabSwitcher = ({ tabs, counts, activeTab, onTabChange, containerStyle }: TabSwitcherProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const activeIndex = tabs.indexOf(activeTab);

  const indicatorStyle = useAnimatedStyle(() => {
    const leftValue = (activeIndex * 100) / tabs.length;
    return {
      left: withSpring(`${leftValue}%` as any),
      width: `${100 / tabs.length}%` as DimensionValue,
    };
  });

  return (
    <View style={[styles.tabsContainer, { backgroundColor: theme.surfaceSecondary }, containerStyle]}>
      <Animated.View 
        style={[
          styles.activeIndicator, 
          { 
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          },
          indicatorStyle
        ]} 
      />
      {tabs.map((tab) => {
        const active = activeTab === tab;
        const count = counts?.[tab];
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={styles.tabBtn}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  { 
                    color: active ? theme.text : theme.textSecondary, 
                    fontWeight: active ? '900' : '600',
                  },
                ]}
              >
                {tab}
              </Text>
              {typeof count === 'number' && count > 0 && (
                <View style={[
                  styles.countBadge, 
                  { backgroundColor: theme.surfaceSecondary }
                ]}>
                  <Text style={[
                    styles.countText, 
                    { color: theme.text, fontWeight: '800' }
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 24,
    height: 54,
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    height: 42,
    borderRadius: 20,
    top: 6,
    borderWidth: 1.5,
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
  },
});
