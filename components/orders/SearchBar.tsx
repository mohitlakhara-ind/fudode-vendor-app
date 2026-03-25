import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { MagnifyingGlass, Sliders } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle, StyleProp } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by ID or Customer...",
  onFilterPress,
  containerStyle,
}: SearchBarProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.searchSection, containerStyle]}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <MagnifyingGlass size={20} color={theme.icon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.icon}
          style={[styles.searchInput, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable onPress={onFilterPress} style={styles.filterButton}>
          <Sliders size={20} color={theme.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
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
  filterButton: {
    padding: 4,
    marginRight: -4,
  }
});
