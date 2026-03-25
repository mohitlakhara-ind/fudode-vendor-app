import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, DotsThreeVertical, Star, PaperPlaneTilt, User } from 'phosphor-react-native';
import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { MOCK_REVIEWS } from '@/constants/mockReviews';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';

export default function ReviewDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [reply, setReply] = useState('');

  const review = MOCK_REVIEWS.find(r => r.id === id);

  if (!review) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Review not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.primary }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return StatusColors.Ready;
    if (rating >= 3) return StatusColors.Preparing;
    return StatusColors.Late;
  };

  const handleSend = () => {
    if (!reply.trim()) return;
    console.log('Sending reply:', reply);
    setReply('');
    // In a real app, this would be an API call
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]} 
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={24} color={theme.text} weight="bold" />
            </Pressable>
            <ThemedText style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.rounded }]}>Review</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Subheader / Order Info */}
        <View style={styles.orderInfoRow}>
          <ThemedText style={[styles.orderInfoText, { color: theme.textSecondary }]}>
            Order {review.orderId} • {review.restaurantName}, {review.locality}
          </ThemedText>
          <DotsThreeVertical size={20} color={theme.text} weight="bold" />
        </View>

        {/* User Section */}
        <View style={styles.userSection}>
          <View style={[styles.avatarWrapper, { borderColor: theme.border }]}>
            {review.userImage ? (
              <Image source={{ uri: review.userImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.surfaceSecondary }]}>
                <User size={24} color={theme.textSecondary} />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={[styles.userName, { color: theme.text }]}>{review.userName}</ThemedText>
            <ThemedText style={[styles.userOrders, { color: theme.textSecondary }]}>{review.userOrderCount} orders with you</ThemedText>
          </View>
        </View>

        {/* Review Bubble */}
        <View style={[styles.reviewBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.bubbleHeader}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(review.rating) }]}>
              <ThemedText style={styles.ratingText}>{review.rating}</ThemedText>
              <Star size={12} color="#fff" weight="fill" />
            </View>
            <ThemedText style={[styles.timestamp, { color: theme.textSecondary }]}>{review.date}</ThemedText>
          </View>
          <ThemedText style={[styles.commentText, { color: theme.text }]}>{review.comment}</ThemedText>
          <View style={[styles.bubblePointer, { borderBottomColor: theme.border }]} />
          <View style={[styles.bubblePointerInner, { borderBottomColor: theme.surface }]} />
        </View>
      </ScrollView>

      {/* Reply Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Type your reply"
            placeholderTextColor={theme.textSecondary}
            value={reply}
            onChangeText={setReply}
            multiline
          />
        </View>
        <Pressable 
          style={[styles.sendBtn, { backgroundColor: theme.primary, opacity: reply.trim() ? 1 : 0.5 }]} 
          onPress={handleSend}
          disabled={!reply.trim()}
        >
          <PaperPlaneTilt size={24} color="#000" weight="bold" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 8,
  },
  orderInfoText: {
    ...Typography.BodyRegular,
    fontSize: 13,
    fontWeight: '600',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...Typography.H3,
    fontSize: 18,
    fontWeight: '900',
  },
  userOrders: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
  },
  reviewBubble: {
    marginHorizontal: 20,
    marginTop: 28,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    position: 'relative',
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    ...Typography.Caption,
    fontWeight: '900',
    color: '#fff',
    fontSize: 13,
  },
  timestamp: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  commentText: {
    ...Typography.BodyRegular,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  bubblePointer: {
    position: 'absolute',
    top: -12,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bubblePointerInner: {
    position: 'absolute',
    top: -10,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 12,
    minHeight: 52,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    ...Typography.BodyRegular,
    fontSize: 15,
    fontWeight: '600',
  },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
