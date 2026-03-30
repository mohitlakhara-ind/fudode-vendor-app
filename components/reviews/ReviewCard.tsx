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
        <View style={styles.header}>
          <Image 
            source={{ uri: review.userImage || 'https://i.pravatar.cc/150' }} 
            style={[styles.avatar, { borderColor: theme.border }]} 
          />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <ThemedText style={[styles.userName, { fontFamily: Fonts.bold }]}>{review.userName}</ThemedText>
              <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(review.rating) }]}>
                <ThemedText style={styles.ratingText}>{review.rating}</ThemedText>
                <Star size={10} color="#FFF" weight="bold" />
              </View>
            </View>
            <ThemedText style={[styles.orderMeta, { color: theme.textSecondary }]}>
              Order {review.orderId} • {review.userOrderCount} orders
            </ThemedText>
          </View>
        </View>

        <View style={styles.content}>
          <ThemedText style={[styles.comment, { color: theme.text }]}>
            {review.comment}
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>
            {review.date}
          </ThemedText>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.metrics}>
            <ChatCircleDots size={18} color={theme.textSecondary} weight="bold" />
            <ThemedText style={[styles.metricText, { color: theme.textSecondary }]}>
              {review.replyCount} {review.replyCount === 1 ? 'reply' : 'replies'}
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.replyBtn, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => onReply?.(review.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.replyBtnText, { color: theme.text }]}>View & Reply</ThemedText>
            <CaretRight size={14} color={theme.text} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    ...Typography.H3,
    fontSize: 15,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  orderMeta: {
    ...Typography.Caption,
    fontSize: 12,
    marginTop: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  comment: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  dateText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    // backgroundColor moved to inline style
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricText: {
    ...Typography.Caption,
    fontWeight: '700',
    fontSize: 12,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  replyBtnText: {
    ...Typography.H3,
    fontSize: 13,
    fontWeight: '800',
  },
});
