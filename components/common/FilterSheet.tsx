import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { MagnifyingGlass, Check } from 'phosphor-react-native';
import { ThemedText } from '@/components/themed-text';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: any) => void;
  categories: { id: string; label: string; options: { id: string; label: string }[] }[];
}

export const FilterSheet = ({
  visible,
  onClose,
  onApply,
  categories
}: FilterSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleOption = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const categoryOptions = prev[categoryId] || [];
      if (categoryOptions.includes(optionId)) {
        return { ...prev, [categoryId]: categoryOptions.filter(id => id !== optionId) };
      } else {
        return { ...prev, [categoryId]: [...categoryOptions, optionId] };
      }
    });
  };

  const currentOptions = categories.find(c => c.id === activeCategory)?.options || [];
  const filteredOptions = currentOptions.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Filters"
      scrollEnabled={false}
    >
      <View style={styles.container}>
        <View style={styles.contentRow}>
          {/* Sidebar */}
          <View style={[styles.sidebar, { borderRightColor: theme.border }]}>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={[
                  styles.sidebarItem,
                  activeCategory === cat.id && { backgroundColor: theme.surfaceSecondary }
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
              >
                {activeCategory === cat.id && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
                <ThemedText style={[
                  styles.sidebarLabel,
                  { color: activeCategory === cat.id ? theme.text : theme.textSecondary },
                  activeCategory === cat.id && { fontWeight: '800' }
                ]}>
                  {cat.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
 
          {/* Options Area */}
          <View style={styles.optionsArea}>
            <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <MagnifyingGlass size={18} color={theme.textSecondary} weight="bold" />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search"
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
 
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsScroll}>
              {filteredOptions.length > 0 ? filteredOptions.map(opt => {
                const isSelected = selectedFilters[activeCategory]?.includes(opt.id);
                return (
                  <Pressable
                    key={opt.id}
                    style={styles.optionRow}
                    onPress={() => handleToggleOption(activeCategory, opt.id)}
                  >
                    <View style={[
                      styles.checkbox,
                      { 
                        borderColor: isSelected ? theme.primary : theme.border,
                        backgroundColor: isSelected ? theme.primary : 'transparent'
                      }
                    ]}>
                      {isSelected && <Check size={14} color="#000" weight="bold" />}
                    </View>
                    <ThemedText style={[styles.optionLabel, { color: isSelected ? theme.text : theme.textSecondary }]}>
                      {opt.label}
                    </ThemedText>
                  </Pressable>
                );
              }) : (
                <View style={styles.noResults}>
                  <ThemedText style={{ color: theme.textSecondary }}>No options found</ThemedText>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
 
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <PremiumButton
            label="Clear all"
            variant="ghost"
            onPress={() => setSelectedFilters({})}
            style={styles.footerBtn}
          />
          <PremiumButton
            label="Apply"
            variant="primary"
            onPress={() => onApply(selectedFilters)}
            style={styles.footerBtn}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 480,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: -24,
  },
  sidebar: {
    width: 140,
    borderRightWidth: 1,
  },
  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  sidebarLabel: {
    ...Typography.BodyRegular,
    fontSize: 14,
  },
  optionsArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  optionsScroll: {
    paddingBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    ...Typography.BodyRegular,
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
  },
});
