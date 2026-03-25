import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { Review } from '@/constants/mockReviews';
import { Star, CaretRight, ChatCircleDots } from 'phosphor-react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { ThemedText } from '@/components/themed-text';

interface ReviewCardProps {
  review: Review;
  onReply?: (id: string) => void;
}

export const ReviewCard = ({ review, onReply }: ReviewCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return StatusColors.Ready;
    if (rating >= 3) return StatusColors.Preparing;
    return StatusColors.Late;
  };

  return (
    <AnimatedCard>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Header: Order Info */}
        <TouchableOpacity style={[styles.header, { backgroundColor: theme.surfaceSecondary }]} activeOpacity={0.7}>
          <ThemedText style={[styles.orderLabel, { color: theme.textSecondary }]}>
            Order {review.orderId} • {review.restaurantName}
          </ThemedText>
          <CaretRight size={14} color={theme.primary} weight="bold" />
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userContainer}>
          <Image 
            source={{ uri: review.userImage || 'https://i.pravatar.cc/150' }} 
            style={[styles.avatar, { borderColor: theme.border, borderWidth: 1 }]} 
          />
          <View style={styles.userInfo}>
            <ThemedText style={[styles.userName, { color: theme.text }]}>
              {review.userName}
            </ThemedText>
            <ThemedText style={[styles.orderCount, { color: theme.textSecondary }]}>
              {review.userOrderCount} orders with you
            </ThemedText>
          </View>
        </View>

        {/* Review Content */}
        <View style={[styles.contentBox, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.ratingRow}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(review.rating) }]}>
              <ThemedText style={styles.ratingText}>{review.rating}</ThemedText>
              <Star size={12} color="#fff" weight="fill" />
            </View>
            <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>{review.date}</ThemedText>
          </View>
          <ThemedText style={[styles.comment, { color: theme.text }]}>{review.comment}</ThemedText>
          
          <View style={styles.actionRow}>
            <View style={[styles.replyBadge, { backgroundColor: theme.background }]}>
              <ChatCircleDots size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.replyCount, { color: theme.textSecondary }]}>{review.replyCount}</ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.replyButton} 
              onPress={() => onReply?.(review.id)}
              activeOpacity={0.6}
            >
              <ThemedText style={[styles.replyText, { color: theme.primary }]}>Reply</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  orderLabel: {
    ...Typography.Caption,
    opacity: 0.6,
  },
  userContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.H3,
  },
  orderCount: {
    ...Typography.Caption,
    opacity: 0.5,
    marginTop: 2,
  },
  contentBox: {
    margin: 12,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    ...Typography.Caption,
    fontWeight: '800',
    color: '#fff',
  },
  dateText: {
    ...Typography.Caption,
    opacity: 0.5,
    fontWeight: '500',
  },
  comment: {
    ...Typography.BodyRegular,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  replyCount: {
    ...Typography.Caption,
    fontWeight: '700',
    opacity: 0.7,
  },
  replyButton: {
    paddingHorizontal: 4,
  },
  replyText: {
    ...Typography.BodyRegular,
    fontWeight: '700',
  },
});
