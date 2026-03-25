import { FilterPill } from '@/components/orders/FilterPill';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { SearchBar } from '@/components/orders/SearchBar';
import { RatingSummaryCard } from '@/components/reviews/RatingSummaryCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ThemedText } from '@/components/themed-text';
import { MOCK_REVIEWS, RATING_SUMMARY } from '@/constants/mockReviews';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { Colors, Typography, StatusColors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ChatCircleDots, Info } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OWNED_RESTAURANTS = [
  { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
  { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
];

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [activeTab, setActiveTab] = useState<'complaints' | 'reviews'>('reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);

  const filteredReviews = MOCK_REVIEWS.filter(rev =>
    rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rev.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return StatusColors.Ready;
    if (rating >= 3) return StatusColors.Preparing;
    return StatusColors.Late;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <RestaurantHeader
        restaurantName={currentRestaurant.name}
        locality={currentRestaurant.locality}
        isOnline={isOnline}
        onToggleStatus={() => setIsOnline(!isOnline)}
        onPressInfo={() => setIsSwitcherVisible(true)}
      />

      <RestaurantSwitcher
        visible={isSwitcherVisible}
        onClose={() => setIsSwitcherVisible(false)}
        restaurants={OWNED_RESTAURANTS}
        selectedId={currentRestaurant.id}
        onSelect={(restaurant) => {
          setCurrentRestaurant(restaurant);
          setIsSwitcherVisible(false);
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Pills */}
        <TabSwitcher 
        tabs={['Review complaints', 'Orders review']}
        counts={{
          'Review complaints': 0,
          'Orders review': MOCK_REVIEWS.length
        }}
        activeTab={activeTab === 'complaints' ? 'Review complaints' : 'Orders review'}
        onTabChange={(tab: string) => setActiveTab(tab === 'Review complaints' ? 'complaints' : 'reviews')}
        containerStyle={{ marginHorizontal: 20, marginBottom: 16 }}
      />

        {activeTab === 'reviews' ? (
          <>
            <RatingSummaryCard
              rating={RATING_SUMMARY.averageRating}
              totalRatings={RATING_SUMMARY.totalRatings}
              totalReviews={RATING_SUMMARY.totalReviews}
            />

            <View style={styles.searchSection}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search reviews"
              />
            </View>

            <View style={styles.reviewHeader}>
              <View style={styles.reviewTitleRow}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Reviews ({filteredReviews.length})
                </ThemedText>
              </View>
              <View style={styles.infoBox}>
                <Info size={14} color={theme.icon} />
                <ThemedText style={styles.infoText}>Delivery reviews are only visible to you</ThemedText>
              </View>
            </View>

            {filteredReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={{ opacity: 0.3 }}>
                <ChatCircleDots size={48} color={theme.icon} weight="thin" />
              </View>
            </View>
            <ThemedText style={styles.emptyTitle}>No complaints found!</ThemedText>
            <ThemedText style={styles.emptySubtitle}>We couldn't find any complaints for the selected date range.</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 120,
  },
  tabScrollView: {
    marginHorizontal: 10,
  },
  tabContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 2,
  },
  searchSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  reviewHeader: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  reviewTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    ...Typography.Display,
    fontSize: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  infoText: {
    ...Typography.Caption,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.H2,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    ...Typography.Caption,
    textAlign: 'center',
    opacity: 0.5,
    lineHeight: 20,
  },
});
