import React, { useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface StickyCategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onCategoryPress: (id: string) => void;
}

export const StickyCategoryNav = ({ categories, activeCategoryId, onCategoryPress }: StickyCategoryNavProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border + '15' }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onCategoryPress(cat.id)}
              style={[
                styles.pill,
                { 
                  backgroundColor: isActive ? theme.text : theme.surface,
                  borderColor: isActive ? theme.text : theme.border + '30'
                }
              ]}
              activeOpacity={0.8}
            >
              <ThemedText 
                style={[
                  styles.pillText, 
                  { color: isActive ? theme.background : theme.text }
                ]}
              >
                {cat.name}
              </ThemedText>
              {cat.count !== undefined && (
                <View style={[styles.countBadge, { backgroundColor: isActive ? theme.background + '20' : theme.surfaceSecondary }]}>
                  <ThemedText style={[styles.countText, { color: isActive ? theme.background : theme.textSecondary }]}>
                    {cat.count}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 18,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
