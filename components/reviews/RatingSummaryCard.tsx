import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, StatusColors } from '@/constants/theme';
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

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.content}>
        <View style={[styles.ratingBadge, { backgroundColor: StatusColors.Ready }]}>
          <ThemedText style={styles.ratingText}>{rating}</ThemedText>
          <Star size={16} color="#fff" weight="fill" />
        </View>
        
        <View style={styles.infoColumn}>
          <ThemedText type="defaultSemiBold" style={styles.statsText}>
            {totalRatings} ratings • {totalReviews} reviews
          </ThemedText>
          <TouchableOpacity onPress={onViewDishRatings} activeOpacity={0.6}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>View dish ratings</ThemedText>
          </TouchableOpacity>
        </View>

        <CaretRight size={20} color={theme.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    padding: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  ratingText: {
    ...Typography.H2,
    color: '#fff',
  },
  infoColumn: {
    flex: 1,
    gap: 4,
  },
  statsText: {
    ...Typography.BodyLarge,
  },
  linkText: {
    ...Typography.Caption,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
});
