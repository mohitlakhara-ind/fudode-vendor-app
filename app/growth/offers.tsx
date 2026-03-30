import { FilterPill } from '@/components/orders/FilterPill';
import { ThemedText } from '@/components/themed-text';
import { MOCK_GROWTH_GOALS, MOCK_GROWTH_OFFERS, MOCK_GROWTH_PERFORMANCE } from '@/constants/mockGrowth';
import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight, Gear, Info, SquaresFour } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { DateTimePicker } from '@/components/ui/DateTimePicker';



import Svg, { Circle, Path } from 'react-native-svg';

// High-fidelity SVG trendline for Track Offers
const MiniLineChart = ({ data = [0, 5, 2, 8, 4], color = '#3B82F6', width = 60, height = 20 }) => {
  const max = Math.max(...data, 1);
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * stepX,
    y: height - (val / max) * height
  }));

  const d = points.reduce((acc, p, i) =>
    i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, ''
  );

  return (
    <View style={{ width, height, justifyContent: 'center' }}>
      <Svg width={width} height={height}>
        <Path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
        ))}
      </Svg>
    </View>
  );
};

export default function OffersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const Obsidian = theme.background;
  const Gold = theme.primary;
  const GhostBorder = theme.border + '26';

  const [activeTab, setActiveTab] = useState<'create' | 'track'>('create');
  const [activeFilter, setActiveFilter] = useState('Active');
  
  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState({ id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' });
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const { queue } = useSelector((state: RootState) => state.order);

  const [perfDate, setPerfDate] = useState(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  };

  const OWNED_RESTAURANTS = [
    { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
    { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
  ];

  const renderCreateTab = () => (
    <View style={styles.createContainer}>
      <ThemedText style={[styles.subHeader, { color: theme.textSecondary }]}>CUSTOM OFFER FOR YOU</ThemedText>
      <View style={[styles.goalBanner, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5', borderColor: GhostBorder, borderWidth: 1, overflow: 'hidden' }]}>
        <View style={styles.goalBannerContent}>
          <ThemedText style={[styles.goalBannerTitle, { fontFamily: Fonts.bold, color: theme.text }]}>What's your discounting goal?</ThemedText>
        </View>
        <View style={styles.goalTarget}>
          <View style={[styles.targetOuter, { borderColor: Gold + '26' }]}>
            <View style={[styles.targetMid, { borderColor: Gold + '40' }]} />
          </View>
        </View>
      </View>

      {MOCK_GROWTH_GOALS.length > 0 ? (
        MOCK_GROWTH_GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[styles.goalItem, { borderBottomColor: theme.border }]}
            onPress={() => router.push({ pathname: '/growth/create-goal', params: { goalId: goal.id, title: goal.title } })}
          >
            <View style={[styles.goalIconContainer, { backgroundColor: Gold + '15', borderColor: GhostBorder, borderWidth: 1 }]}>
              <ThemedText style={{ fontSize: 24 }}>⭐</ThemedText>
            </View>
            <View style={styles.goalText}>
              <ThemedText style={[styles.goalTitle, { color: theme.text, fontFamily: Fonts.bold }]}>{goal.title}</ThemedText>
              <ThemedText style={[styles.goalDesc, { color: theme.textSecondary }]}>{goal.description}</ThemedText>
            </View>
            <CaretRight size={20} color={theme.primary} weight="bold" />
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={{ opacity: 0.3 }}>
            <SquaresFour size={48} color={theme.textSecondary} />
          </View>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>No goals available at the moment</ThemedText>
        </View>
      )}
    </View>
  );

  const renderTrackTab = () => (
    <View style={styles.trackContainer}>
      <View style={[styles.perfCard, { backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10', borderColor: GhostBorder, borderWidth: 1 }]}>
        <View style={styles.perfHeader}>
          <ThemedText style={[styles.perfTitle, { color: theme.text, fontFamily: Fonts.bold }]}>Overall performance</ThemedText>
          <Info size={18} color={theme.textSecondary} style={{ marginLeft: 8 }} />
        </View>
        <View style={styles.perfSubHeader}>
          <ThemedText style={[styles.perfPeriod, { color: theme.textSecondary }]}>
            Week of {formatDate(perfDate)}
          </ThemedText>
          <TouchableOpacity onPress={() => setIsPickerVisible(true)}>
            <ThemedText style={{ color: theme.primary, fontWeight: '700' }}>Change</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={[styles.perfComparison, { color: theme.textSecondary }]}>Comparison with previous week. Trendline: last 5 weeks</ThemedText>

        {[
          { label: 'Gross sales from offers', value: '₹0', color: theme.primary, data: [0, 2, 1, 3, 0] },
          { label: 'Orders from offers', value: '0', color: theme.primary, data: [1, 5, 2, 4, 1] },
          { label: 'Discount given', value: '₹0', color: '#10B981', data: [0, 1, 0.5, 2, 0] },
          { label: 'Effective discount', value: '0.0%', color: theme.primary, data: [2, 2, 2, 2, 2] },
          { label: 'Menu to order', value: '0.0%', color: theme.primary, data: [1, 2, 3, 4, 5] },
        ].map((item, idx) => (
          <View key={idx} style={styles.perfRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.perfLabel, { color: theme.text }]}>{item.label}</ThemedText>
            </View>
            <MiniLineChart color={item.color} data={item.data} />
            <View style={{ alignItems: 'flex-end', minWidth: 60 }}>
              <ThemedText style={[styles.perfValue, { color: theme.text, fontFamily: Fonts.bold }]}>{item.value}</ThemedText>
              <ThemedText style={[styles.perfChange, { color: theme.textSecondary }]}>0%</ThemedText>
            </View>
          </View>
        ))}

        <TouchableOpacity style={[styles.viewDetailedBtn, { borderTopColor: theme.border }]}>
          <ThemedText style={[styles.viewDetailedText, { color: theme.primary }]}>View detailed performance</ThemedText>
          <CaretRight size={16} color={theme.primary} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={styles.offersSection}>
        <View style={styles.offersHeaderLine}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
          <ThemedText style={[styles.offersHeaderText, { color: theme.textSecondary }]}>OFFERS</ThemedText>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.filterRow}>
          {['Active', 'Scheduled', 'Inactive'].map(f => (
            <FilterPill
              key={f}
              label={f}
              isActive={activeFilter === f}
              onPress={() => setActiveFilter(f)}
              color={theme.primary}
            />
          ))}
        </View>

        {MOCK_GROWTH_OFFERS.filter(o => o.status === activeFilter).length > 0 ? (
          MOCK_GROWTH_OFFERS.filter(o => o.status === activeFilter).map((offer, index) => (
            <AnimatedCard key={offer.id} index={index}>
              <View style={[styles.offerCard, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}>
                <View style={styles.offerCardTop}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.offerBadge, { backgroundColor: Gold + '15' }]}><ThemedText style={[styles.badgeText, { color: Gold }]}>{offer.badge}</ThemedText></View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}><ThemedText style={[styles.statusText, { color: '#10B981' }]}>{offer.status}</ThemedText></View>
                  </View>
                  <ThemedText style={[styles.offerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>{offer.title}</ThemedText>
                  <ThemedText style={[styles.startDate, { color: theme.textSecondary }]}>Start Date: {offer.startDate}</ThemedText>
                </View>
                <View style={[styles.offerCardStats, { backgroundColor: isDark ? theme.surfaceSecondary + '10' : theme.surfaceSecondary + '10' }]}>
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <ThemedText style={[styles.statValue, { color: theme.primary, fontFamily: Fonts.bold }]}>₹{offer.grossSales}</ThemedText>
                      <ThemedText style={styles.statLabel}>Gross sales</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={[styles.statValue, { color: theme.text, fontFamily: Fonts.bold }]}>{offer.ordersDelivered}</ThemedText>
                      <ThemedText style={styles.statLabel}>Orders delivered</ThemedText>
                    </View>
                  </View>
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <ThemedText style={[styles.statValue, { color: '#10B981', fontFamily: Fonts.bold }]}>₹{offer.discountGiven}</ThemedText>
                      <ThemedText style={styles.statLabel}>Discount given</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={[styles.statValue, { color: theme.text, fontFamily: Fonts.bold }]}>{offer.effectiveDiscount}%</ThemedText>
                      <ThemedText style={styles.statLabel}>Effective discount %</ThemedText>
                    </View>
                  </View>

                  <View style={[styles.line, { marginVertical: 16, backgroundColor: GhostBorder }]} />
                  <ThemedText style={[styles.updatedAt, { color: theme.textSecondary }]}>Performance updated till yesterday</ThemedText>
                  <View style={{ gap: 8, marginTop: 12 }}>
                    {offer.details.map((d, i) => (
                      <ThemedText key={i} style={[styles.detailItem, { color: theme.text }]}>{d}</ThemedText>
                    ))}
                  </View>
                </View>
              </View>
            </AnimatedCard>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={{ opacity: 0.3 }}>
              <SquaresFour size={48} color={theme.textSecondary} />
            </View>
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>No {activeFilter.toLowerCase()} offers found</ThemedText>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <RestaurantHeader
        restaurantName={currentRestaurant.name}
        locality={currentRestaurant.locality}
        isOnline={isOnline}
        onToggleStatus={() => setIsOnline(!isOnline)}
        onPressInfo={() => setIsSwitcherVisible(true)}
        onBack={() => router.back()}
      />

      <RestaurantSwitcher
        visible={isSwitcherVisible}
        onClose={() => setIsSwitcherVisible(false)}
        restaurants={OWNED_RESTAURANTS}
        selectedId={currentRestaurant.id}
        onSelect={(res: any) => {
          setCurrentRestaurant(res);
          setIsSwitcherVisible(false);
        }}
      />
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('create')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'create' && { color: theme.primary, opacity: 1 }]}>Create offers</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'track' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('track')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'track' && { color: theme.primary, opacity: 1 }]}>Track offers</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]} showsVerticalScrollIndicator={false}>
       {activeTab === 'create' ? renderCreateTab() : renderTrackTab()}
      </ScrollView>

      <DateTimePicker
        visible={isPickerVisible}
        mode="date"
        initialDate={perfDate}
        onClose={() => setIsPickerVisible(false)}
        onConfirm={(date) => {
          setPerfDate(date);
          setIsPickerVisible(false);
        }}
        title="Selecting performance period"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleArea: {
    flex: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantName: {
    ...Typography.H3,
    fontSize: 18,
  },
  locationText: {
    ...Typography.Caption,
  },
  headerSettings: {
    padding: 4,
  },
  tabsWrapper: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    ...Typography.H3,
    fontSize: 18,
    opacity: 0.6,
  },

  scrollContent: {
    paddingBottom: 120,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: 20,
  },
  emptyText: {
    ...Typography.BodyRegular,
    opacity: 0.5,
    textAlign: 'center',
  },
  createContainer: {
    padding: 16,
  },
  subHeader: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  goalBanner: {
    minHeight: 140,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  goalBannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  goalBannerTitle: {
    ...Typography.H1,
    color: '#fff',
    fontSize: 24,
  },
  goalTarget: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetMid: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 6,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
    borderBottomWidth: 1,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    flex: 1,
    gap: 2,
  },
  goalTitle: {
    ...Typography.H3,
    fontSize: 18,
  },
  goalDesc: {
    ...Typography.Caption,
  },
  trackContainer: {
    padding: 16,
  },
  perfCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  perfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  perfTitle: {
    ...Typography.H2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perfSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  perfPeriod: {
    ...Typography.BodyRegular,
    fontWeight: '700',
  },
  perfComparison: {
    ...Typography.Caption,
    opacity: 0.6,
    marginBottom: 24,
  },
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  perfLabel: {
    ...Typography.BodyRegular,
    fontSize: 15,
    opacity: 0.8,
  },
  perfValue: {
    ...Typography.BodyLarge,
    fontWeight: '800',
  },
  perfChange: {
    ...Typography.Caption,
    fontSize: 11,
    opacity: 0.5,
  },
  viewDetailedBtn: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewDetailedText: {
    fontWeight: '800',
  },
  offersSection: {
    marginTop: 10,
  },
  offersHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
  },
  offersHeaderText: {
    ...Typography.Caption,
    opacity: 0.4,
    letterSpacing: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 20,
  },
  offerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  offerCardTop: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  offerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
  },
  offerTitle: {
    ...Typography.H2,
    fontSize: 22,
    marginBottom: 4,
  },
  startDate: {
    ...Typography.BodyRegular,
    opacity: 0.6,
    fontWeight: '600',
  },
  offerCardStats: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    ...Typography.H2,
  },
  statLabel: {
    ...Typography.Caption,
    opacity: 0.5,
    marginTop: 4,
  },
  updatedAt: {
    ...Typography.Caption,
    opacity: 0.5,
  },
  detailItem: {
    ...Typography.Caption,
    fontSize: 13,
    opacity: 0.8,
  },
});
