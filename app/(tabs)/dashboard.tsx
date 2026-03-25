import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MiniAreaChart } from '@/components/dashboard/MiniAreaChart';
import { MiniBarChart } from '@/components/dashboard/MiniBarChart';
import { FilterPill } from '@/components/orders/FilterPill';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { ThemedText } from '@/components/themed-text';
import { DASHBOARD_MENU_ITEMS, MOCK_DASHBOARD_STATS } from '@/constants/mockDashboard';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Calendar, CaretDown, CaretRight, CurrencyInr, DotsThreeOutline, EnvelopeSimple, Megaphone, Storefront } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OWNED_RESTAURANTS = [
  { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
  { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
];

const HUB_TABS = ['My Feed', 'Sales', 'Funnel', 'Service quality', 'Kitchen efficiency', 'Customers'];

const ICON_MAP: any = {
  Storefront,
  Megaphone,
  CurrencyInr,
  DotsThreeOutline
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState('Sales');
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const renderMetric = (label: string, value: string | number, change: number, showChart: boolean = false) => (
    <View style={styles.metricRow}>
      <View style={styles.metricLabelArea}>
        <ThemedText style={styles.metricLabel}>{label}</ThemedText>
        <View style={styles.valueRow}>
          <ThemedText style={styles.metricValue}>{value}</ThemedText>
          <ThemedText style={[styles.changeText, { color: change >= 0 ? StatusColors.Ready : StatusColors.Late }]}>
            {change >= 0 ? '+' : ''}{change}%
          </ThemedText>
        </View>
      </View>
      {showChart && (
        <MiniAreaChart
          data={MOCK_DASHBOARD_STATS.sales.chartData}
          previousData={MOCK_DASHBOARD_STATS.sales.previousChartData}
        />
      )}
    </View>
  );

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          style={styles.tabScrollView}
        >
          {HUB_TABS.map(tab => (
            <FilterPill
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onPress={() => setActiveTab(tab)}
              color={theme.secondary}
            />
          ))}
        </ScrollView>

        {/* Date Selector */}
        <View style={styles.dateSelectorArea}>
          <View style={[styles.dateCard, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={styles.dateInfo}>
              <ThemedText style={styles.dateRange}>Yesterday • 17 Mar 26</ThemedText>
              <ThemedText style={styles.compareText}>Compared against: 10 Mar 26</ThemedText>
            </View>
            <View style={styles.dateIconRow}>
              <Calendar size={22} color={theme.icon} />
              <CaretDown size={14} color={theme.icon} />
            </View>
          </View>
          <TouchableOpacity style={[styles.emailButton, { backgroundColor: theme.surfaceSecondary }]}>
            <EnvelopeSimple size={22} color={theme.icon} />
          </TouchableOpacity>
        </View>

        {activeTab === 'Sales' && (
          <DashboardCard
            title="Sales"
            subtitle="Last updated: few seconds ago"
          >
            {renderMetric('Net sales', `₹${MOCK_DASHBOARD_STATS.sales.netSales}`, MOCK_DASHBOARD_STATS.sales.salesChange, true)}
            <View style={[styles.cardDivider, { borderColor: theme.border }]} />
            {renderMetric('Orders delivered', MOCK_DASHBOARD_STATS.sales.ordersDelivered, MOCK_DASHBOARD_STATS.sales.ordersChange, true)}
            <View style={[styles.cardDivider, { borderColor: theme.border }]} />
            {renderMetric('Avg. order value', `₹${MOCK_DASHBOARD_STATS.sales.avgOrderValue}`, MOCK_DASHBOARD_STATS.sales.avgChange, true)}

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.primary }]} />
                <ThemedText style={styles.legendText}>Yesterday</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendLine, { backgroundColor: theme.icon, height: 1, borderWidth: 1, borderColor: theme.icon + '40' }]} />
                <ThemedText style={styles.legendText}>Day before yesterday</ThemedText>
              </View>
            </View>

            <View style={[styles.cardDivider, { borderColor: theme.border }]} />
            <ThemedText style={[styles.metricLabel, { marginTop: 20 }]}>Sales by category</ThemedText>
            <View style={styles.fullChartContainer}>
              <MiniBarChart
                data={MOCK_DASHBOARD_STATS.categorySales}
                width={Dimensions.get('window').width - 64}
                height={100}
                showLabels
                color={theme.primary}
              />
            </View>
          </DashboardCard>
        )}

        {activeTab === 'Kitchen efficiency' && (
          <>
            <DashboardCard title="KPT & Delayed orders" subtitle="Last updated: a day ago">
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <ThemedText style={styles.metricLabel}>Avg. KPT</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={[styles.gridValue, { fontSize: 18 }]}>0 sec</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>-0%</ThemedText>
                  </View>
                </View>
                <View style={[styles.gridItem, styles.gridItemBorder, { borderLeftColor: theme.border }]}>
                  <ThemedText style={styles.metricLabel}>KPT delayed orders</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={[styles.gridValue, { fontSize: 18 }]}>0%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>-0%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>0 min avg. delay</ThemedText>
                </View>
              </View>

              <View style={styles.fullChartContainer}>
                <View style={styles.yAxis}>
                  <ThemedText style={styles.yLabel}>4 secs</ThemedText>
                  <ThemedText style={styles.yLabel}>2 secs</ThemedText>
                  <ThemedText style={styles.yLabel}>0 sec</ThemedText>
                </View>
                <View style={styles.chartWrapper}>
                  <MiniAreaChart
                    data={MOCK_DASHBOARD_STATS.sales.chartData}
                    previousData={MOCK_DASHBOARD_STATS.sales.chartData.map(d => ({ ...d, value: d.value * 0.8 }))}
                    width={Dimensions.get('window').width - 120}
                    height={80}
                    showXLabels
                    color={theme.text}
                    previousColor={theme.primary}
                  />
                </View>
              </View>

              <View style={[styles.legendRow, { marginTop: 30 }]}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: theme.text, width: 10, height: 10, borderRadius: 2 }]} />
                  <ThemedText style={styles.legendText}>Avg. KPT</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: theme.primary, width: 10, height: 10, borderRadius: 2 }]} />
                  <ThemedText style={styles.legendText}>Delayed orders</ThemedText>
                </View>
              </View>
            </DashboardCard>

            <DashboardCard title="Accuracy of FOR marked" subtitle="Last updated: a day ago">
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <ThemedText style={styles.metricLabel}>Food order ready accuracy</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={[styles.gridValue, { fontSize: 18 }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.foodReadyAccuracy}%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: StatusColors.Ready }]}>+{MOCK_DASHBOARD_STATS.kitchenEfficiency.foodReadyChange}%</ThemedText>
                  </View>
                </View>
                <View style={[styles.gridItem, styles.gridItemBorder, { borderLeftColor: theme.border }]}>
                  <ThemedText style={styles.metricLabel}>Orders with high rider handover time</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={[styles.gridValue, { fontSize: 18 }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.riderHandoverTime}</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.handoverChange}%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.avgHandoverTime} sec avg. time</ThemedText>
                </View>
              </View>

              <View style={styles.fullChartContainer}>
                <View style={styles.yAxis}>
                  <ThemedText style={styles.yLabel}>1%</ThemedText>
                  <ThemedText style={styles.yLabel}>0.5%</ThemedText>
                  <ThemedText style={styles.yLabel}>0%</ThemedText>
                </View>
                <View style={styles.chartWrapper}>
                  <MiniAreaChart
                    data={MOCK_DASHBOARD_STATS.sales.chartData}
                    previousData={MOCK_DASHBOARD_STATS.sales.chartData.map(d => ({ ...d, value: d.value * 1.1 }))}
                    width={Dimensions.get('window').width - 120}
                    height={80}
                    showXLabels
                    color={theme.text}
                    previousColor={theme.icon}
                  />
                </View>
              </View>

              <View style={[styles.legendRow, { marginTop: 30 }]}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: theme.text, width: 10, height: 10, borderRadius: 2 }]} />
                  <ThemedText style={styles.legendText}>FOR accuracy</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: theme.icon, width: 10, height: 10, borderRadius: 2 }]} />
                  <ThemedText style={styles.legendText}>Orders with high RHT</ThemedText>
                </View>
              </View>
            </DashboardCard>
          </>
        )}

        {activeTab === 'My Feed' && (
          <>
            <View style={[styles.insightsCard, { backgroundColor: theme.surface }]}>
              <ThemedText style={[styles.insightsValue, { color: theme.text }]}>0</ThemedText>
              <ThemedText style={[styles.insightsChange, { color: theme.textSecondary }]}>- 0%</ThemedText>
              <TouchableOpacity style={[styles.insightsButton, { borderColor: theme.border }]}>
                <ThemedText style={[styles.insightsButtonText, { color: theme.text }]}>Get deeper insights</ThemedText>
              </TouchableOpacity>
            </View>
            <DashboardCard title="Service quality" subtitle="Last updated: an hour ago">
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <ThemedText style={styles.metricLabel}>Complaints</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={styles.gridValue}>{MOCK_DASHBOARD_STATS.serviceQuality.complaints}%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>-0%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>{MOCK_DASHBOARD_STATS.serviceQuality.refundedPercent}% refunded</ThemedText>
                </View>
              </View>
              <View style={[styles.cardDivider, { marginVertical: 16, borderColor: theme.border }]} />
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <ThemedText style={styles.metricLabel}>Poor rated orders</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={styles.gridValue}>{MOCK_DASHBOARD_STATS.serviceQuality.poorRatedOrders}%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>-0%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>1 or 2 star rated</ThemedText>
                </View>
                <View style={[styles.gridItem, styles.gridItemBorder, { borderLeftColor: theme.border }]}>
                  <ThemedText style={styles.metricLabel}>Online time %</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={styles.gridValue}>{MOCK_DASHBOARD_STATS.serviceQuality.onlineTimePercent}%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: StatusColors.Ready }]}>+0%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>Est. lost sales ₹{MOCK_DASHBOARD_STATS.serviceQuality.lostSales}</ThemedText>
                </View>
              </View>
              <View style={styles.fullChartContainer}>
                <View style={styles.yAxis}>
                  <ThemedText style={styles.yLabel}>100%</ThemedText>
                  <ThemedText style={styles.yLabel}>50%</ThemedText>
                  <ThemedText style={styles.yLabel}>0%</ThemedText>
                </View>
                <View style={styles.chartWrapper}>
                  <MiniAreaChart
                    data={MOCK_DASHBOARD_STATS.sales.chartData}
                    width={Dimensions.get('window').width - 120}
                    height={80}
                    showXLabels
                    color={StatusColors.Ready}
                  />
                </View>
              </View>
            </DashboardCard>

            <DashboardCard title="Ratings Distribution" subtitle="Distribution of user ratings over current period">
              <View style={[styles.fullChartContainer, { height: 140 }]}>
                <MiniBarChart
                  data={MOCK_DASHBOARD_STATS.ratingDistribution}
                  width={Dimensions.get('window').width - 100}
                  height={100}
                  showLabels
                  color={theme.primary}
                />
              </View>
            </DashboardCard>
            <DashboardCard title="Kitchen efficiency" subtitle="Last updated: a day ago">
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <ThemedText style={styles.metricLabel}>Avg. kitchen preparation time</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={styles.gridValue}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.avgPrepTime}</ThemedText>
                  </View>
                </View>
                <View style={[styles.gridItem, styles.gridItemBorder, { borderLeftColor: theme.border }]}>
                  <ThemedText style={styles.metricLabel}>KPT delayed orders</ThemedText>
                  <View style={styles.valueRow}>
                    <ThemedText style={styles.gridValue}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.kptDelayedOrders}%</ThemedText>
                    <ThemedText style={[styles.changeTextSmall, { color: theme.textSecondary }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.kptDelayedChange}%</ThemedText>
                  </View>
                  <ThemedText style={[styles.subMetric, { color: theme.textSecondary }]}>{MOCK_DASHBOARD_STATS.kitchenEfficiency.avgDelay} min avg. delay</ThemedText>
                </View>
              </View>
            </DashboardCard>

            <DashboardCard title="Mealtime KPTs" subtitle="Last updated: a day ago">
              {MOCK_DASHBOARD_STATS.mealtimeKPT?.map((kpt, idx) => (
                <View key={idx}>
                  <View style={styles.kptRow}>
                    <View style={styles.kptLabelBox}>
                      <View style={[styles.kptDot, { backgroundColor: kpt.color }]} />
                      <View>
                        <ThemedText style={styles.kptTitle}>{kpt.label}</ThemedText>
                        <ThemedText style={styles.kptTime}>{kpt.time}</ThemedText>
                      </View>
                    </View>
                    <View style={styles.valueRow}>
                      <ThemedText style={styles.gridValue}>{kpt.value}</ThemedText>
                      <ThemedText style={[styles.changeTextSmall, { color: kpt.change >= 0 ? StatusColors.Late : StatusColors.Ready }]}>
                        {kpt.change >= 0 ? '+' : ''}{kpt.change}%
                      </ThemedText>
                    </View>
                  </View>
                  {idx < (MOCK_DASHBOARD_STATS.mealtimeKPT?.length || 0) - 1 && <View style={[styles.cardDivider, { borderColor: theme.border }]} />}
                </View>
              ))}
            </DashboardCard>
          </>
        )}

        {/* Shortcuts/Menu Items */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.menuHeadline}>How can we help you?</ThemedText>
          <View style={[styles.menuList, { borderColor: theme.border }]}>
            {DASHBOARD_MENU_ITEMS.map((item, index) => {
              const IconComp = ICON_MAP[item.icon];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index < DASHBOARD_MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                  ]}
                >
                  <View style={styles.menuItemLeft}>
                    <IconComp size={20} color={theme.icon} />
                    <ThemedText style={styles.menuItemLabel}>{item.label}</ThemedText>
                  </View>
                  <View style={{ opacity: 0.5 }}>
                    <CaretRight size={18} color={theme.icon} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.hubFooter}>
          <View style={[styles.footerLine, { backgroundColor: theme.border }]} />
          <ThemedText style={[styles.footerText, { color: theme.textSecondary }]}>You've reached the end of your hub</ThemedText>
          <View style={[styles.footerLine, { backgroundColor: theme.border }]} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  tabScrollView: {
    marginHorizontal: -16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    gap: 0,
  },
  dateSelectorArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
  },
  dateInfo: {
    gap: 2,
  },
  dateRange: {
    ...Typography.H3,
    fontWeight: '800',
  },
  compareText: {
    ...Typography.Caption,
    opacity: 0.5,
    fontWeight: '600',
  },
  dateIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricLabelArea: {
    flex: 1,
  },
  metricLabel: {
    ...Typography.BodyRegular,
    opacity: 0.6,
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metricValue: {
    ...Typography.Display,
    fontSize: 24,
  },
  changeText: {
    ...Typography.Caption,
    fontWeight: '600',
  },
  changeTextSmall: {
    ...Typography.Caption,
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    paddingRight: 10,
  },
  gridItemBorder: {
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingRight: 0,
  },
  gridValue: {
    ...Typography.H2,
  },
  subMetric: {
    ...Typography.Caption,
    opacity: 0.5,
    marginTop: 4,
    fontWeight: '600',
  },
  kptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  kptLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kptDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  kptTitle: {
    ...Typography.H3,
    fontWeight: '700',
  },
  kptTime: {
    ...Typography.Caption,
    opacity: 0.5,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    marginVertical: 4,
    borderWidth: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    ...Typography.Caption,
    opacity: 0.6,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 24,
  },
  menuHeadline: {
    ...Typography.H1,
    marginBottom: 16,
  },
  menuList: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemLabel: {
    ...Typography.H3,
    fontWeight: '600',
  },
  hubFooter: {
    marginTop: 60,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    opacity: 0.3,
  },
  footerLine: {
    flex: 1,
    height: 1,
  },
  footerText: {
    ...Typography.Caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fullChartContainer: {
    flexDirection: 'row',
    marginTop: 24,
    height: 120,
  },
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingBottom: 25,
  },
  yLabel: {
    ...Typography.Caption,
    fontSize: 10,
    opacity: 0.5,
    fontWeight: '600',
  },
  chartWrapper: {
    flex: 1,
  },
  insightsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  insightsValue: {
    ...Typography.Display,
    fontSize: 32,
    fontWeight: '900',
  },
  insightsChange: {
    ...Typography.BodyRegular,
    fontWeight: '600',
    opacity: 0.5,
    marginTop: 4,
  },
  insightsButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  insightsButtonText: {
    ...Typography.H3,
    fontWeight: '800',
  },
});
