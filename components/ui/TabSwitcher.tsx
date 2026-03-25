import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TabSwitcherProps {
  tabs: string[];
  counts?: Record<string, number>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  containerStyle?: any;
}

export const TabSwitcher = ({ tabs, counts, activeTab, onTabChange, containerStyle }: TabSwitcherProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.tabsContainer, { backgroundColor: theme.text + '50' }, containerStyle]}>
      {tabs.map((tab) => {
        const active = activeTab === tab;
        const count = counts?.[tab];
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tabBtn,
              { backgroundColor: active ? theme.text : 'transparent' },
              active && styles.activeTabShadow,
            ]}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  { color: active ? theme.surface : theme.background, fontWeight: active ? '700' : '500' },
                ]}
              >
                {tab}
              </Text>
              {typeof count === 'number' && (
                <View style={[styles.countBadge, { backgroundColor: active ? theme.surface : theme.background }]}>
                  <Text style={[styles.countText, { color: theme.text, fontWeight: '800' }]}>
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
    padding: 4,
    borderRadius: 24,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTabShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
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
