import { FilterPill } from '@/components/orders/FilterPill';
import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { SearchBar } from '@/components/orders/SearchBar';
import { RatingSummaryCard } from '@/components/reviews/RatingSummaryCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ThemedText } from '@/components/themed-text';
import { MOCK_REVIEWS, RATING_SUMMARY } from '@/constants/mockReviews';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { Colors, Typography, StatusColors, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CalendarBlank, ChatCircleDots, Info, Funnel, CaretDown, StarHalf, MagnifyingGlass } from 'phosphor-react-native';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { DateRangePickerSheet } from '@/components/common/DateRangePickerSheet';
import { FilterSheet } from '@/components/common/FilterSheet';



export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const { status: restaurantStatus } = useSelector((state: RootState) => state.restaurant);
  const [activeTab, setActiveTab] = useState<'complaints' | 'reviews'>('reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const { queue } = useSelector((state: RootState) => state.order);

  // Bottom Sheet States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 5 days');
  const [activeFilters, setActiveFilters] = useState({});

  const filterCategories = [
    {
      id: 'issue_type',
      label: 'Issue type',
      options: [
        { id: 'wrong_item', label: 'Wrong item' },
        { id: 'quality', label: 'Food quality' },
        { id: 'packaging', label: 'Packaging' },
        { id: 'spillage', label: 'Spillage' },
      ]
    },
    {
      id: 'reasons',
      label: 'Reasons',
      options: [
        { id: 'dismissed', label: 'Dismissed' },
        { id: 'winback', label: 'Winback' },
        { id: 'open', label: 'Open' },
        { id: 'resolved', label: 'Resolved' },
        { id: 'expired', label: 'Expired' },
      ]
    }
  ];

  const filteredReviews = MOCK_REVIEWS.filter(rev =>
    rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rev.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return StatusColors.Ready;
    if (rating >= 3) return StatusColors.Preparing;
    return StatusColors.Late;
  };

  const handleReviewPress = (id: string) => {
    router.push({
      pathname: '/reviews/[id]',
      params: { id }
    });
  };

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <GlobalRestaurantHeader />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 270 : 150 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Pills */}
        <TabSwitcher 
          tabs={['Complaints', 'Reviews']}
          counts={{
            'Complaints': 0,
            'Reviews': MOCK_REVIEWS.length
          }}
          activeTab={activeTab === 'complaints' ? 'Complaints' : 'Reviews'}
          onTabChange={(tab: string) => setActiveTab(tab === 'Complaints' ? 'complaints' : 'reviews')}
          containerStyle={{ marginHorizontal: 20, marginVertical: 16 }}
        />

        {/* Unified Control Row */}
        <View style={styles.controlRow}>
          <Pressable 
            style={[styles.datePicker, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarBlank size={20} color={theme.text} weight="bold" />
            <View style={styles.datePickerContent}>
              <Text style={[styles.datePickerLabel, { color: theme.text }]}>{selectedRange}</Text>
              <Text style={[styles.datePickerSub, { color: theme.textSecondary }]}>Custom Range</Text>
            </View>
            <CaretDown size={14} color={theme.textSecondary} weight="bold" />
          </Pressable>

          <Pressable 
            style={[styles.filterBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowFilters(true)}
          >
            <Funnel size={22} color={theme.text} weight="bold" />
            {Object.keys(activeFilters).length > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: theme.primary, borderColor: theme.surface }]} />
            )}
          </Pressable>
        </View>

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
                containerStyle={{ paddingHorizontal: 20 }}
              />
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.headerTop}>
                <ThemedText style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                  Customer Reviews
                </ThemedText>
                <View style={[styles.countBadge, { backgroundColor: theme.surfaceSecondary }]}>
                  <ThemedText style={[styles.countText, { color: theme.text }]}>
                    {filteredReviews.length}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Info size={14} color={theme.textSecondary} weight="bold" />
                <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
                  Delivery reviews are private to you
                </ThemedText>
              </View>
            </View>

            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onReply={() => handleReviewPress(review.id)}
                />
              ))
            ) : (
              <EmptyState
                icon={searchQuery ? MagnifyingGlass : ChatCircleDots}
                title={searchQuery ? "No matches" : "No reviews yet"}
                description={searchQuery 
                  ? `We couldn't find any reviews matching "${searchQuery}".` 
                  : "You haven't received any customer reviews for this period."
                }
                actionLabel={searchQuery ? "Clear Search" : undefined}
                onAction={searchQuery ? () => setSearchQuery('') : undefined}
                style={{ marginTop: 20 }}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={ChatCircleDots}
            title="Silence is Golden!"
            description="We couldn't find any complaints for the selected range. That's a great sign of quality!"
            style={{ marginTop: 40 }}
          />
        )}
      </ScrollView>

      <DateRangePickerSheet
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedRange={selectedRange}
        onApply={(range) => {
          setSelectedRange(range);
          setShowDatePicker(false);
        }}
      />

      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        categories={filterCategories}
        onApply={(filters) => {
          setActiveFilters(filters);
          setShowFilters(false);
        }}
      />
    </AnimatedPage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 150,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  datePickerContent: {
    flex: 1,
  },
  datePickerLabel: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '800',
  },
  datePickerSub: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
    opacity: 0.6,
  },
  filterBtn: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  searchSection: {
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    ...Typography.H2,
    fontSize: 20,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    ...Typography.Caption,
    fontWeight: '700',
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
    marginBottom: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    ...Typography.H2,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    ...Typography.Caption,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
