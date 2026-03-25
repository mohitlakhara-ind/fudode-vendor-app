import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { List } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

export const InventoryFabMenu = ({ onPress }: { onPress: () => void }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity 
      style={[
        styles.fab, 
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.8)',
          borderColor: theme.border,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <List size={22} color={isDark ? theme.text : '#fff'} weight="bold" />
      <Text style={[styles.text, { color: isDark ? theme.text : '#fff' }]}>Menu</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    borderWidth: 1,
    // Native shadow for floating effect (minimal)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
