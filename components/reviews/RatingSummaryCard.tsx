import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, StatusColors, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Star, CaretRight } from 'phosphor-react-native';

interface RatingSummaryCardProps {
  rating: number;
  totalRatings: number;
  totalReviews: number;
  onViewDishRatings?: () => void;
}

export const RatingSummaryCard = ({ rating, totalRatings, totalReviews, onViewDishRatings }: RatingSummaryCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  // Mock distribution since it's not in the props
  const distribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 8 },
    { stars: 2, percentage: 4 },
    { stars: 1, percentage: 3 },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.ratingBox}>
          <ThemedText style={[styles.ratingValue, { color: theme.text, fontFamily: Fonts.bold }]}>
            {rating}
          </ThemedText>
          <View style={styles.starsRow}>
            <Star size={16} color={StatusColors.Ready} weight="bold" />
            <ThemedText style={[styles.totalRatingsText, { color: theme.textSecondary }]}>
              {totalRatings} ratings
            </ThemedText>
          </View>
        </View>
        <View style={[styles.dividerVertical, { backgroundColor: theme.border }]} />
        <View style={styles.distributionContainer}>
          {distribution.map((item) => (
            <View key={item.stars} style={styles.distributionRow}>
              <ThemedText style={[styles.starLabel, { color: theme.textSecondary }]}>
                {item.stars}
              </ThemedText>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surfaceSecondary }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.stars >= 4 ? StatusColors.Ready : (item.stars >= 3 ? StatusColors.Preparing : StatusColors.Late)
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surfaceSecondary }]}>
        <ThemedText style={[styles.reviewInfo, { color: theme.textSecondary }]}>
          Based on {totalReviews} detailed reviews
        </ThemedText>
        <TouchableOpacity 
          onPress={onViewDishRatings} 
          activeOpacity={0.6}
          style={styles.linkWrapper}
        >
          <ThemedText style={[styles.linkText, { color: theme.primary }]}>Dish-wise ratings</ThemedText>
          <CaretRight size={14} color={theme.primary} weight="bold" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  ratingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 48,
    lineHeight: 56,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalRatingsText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '700',
  },
  dividerVertical: {
    width: 1,
    height: 100,
  },
  distributionContainer: {
    flex: 1,
    gap: 6,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    width: 12,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor moved to inline style
  },
  reviewInfo: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '800',
  },
});
