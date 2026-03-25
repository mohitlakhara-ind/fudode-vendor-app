import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { MagnifyingGlass, Sliders } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by ID or Customer...",
}: SearchBarProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.searchSection}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <MagnifyingGlass size={20} color={theme.icon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.icon}
          style={[styles.searchInput, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
        />
        <Sliders size={20} color={theme.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
