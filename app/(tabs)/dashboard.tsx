import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MiniAreaChart } from '@/components/dashboard/MiniAreaChart';
import { MiniBarChart } from '@/components/dashboard/MiniBarChart';
import { FilterPill } from '@/components/orders/FilterPill';
import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { ThemedText } from '@/components/themed-text';
import { DASHBOARD_MENU_ITEMS, MOCK_DASHBOARD_STATS } from '@/constants/mockDashboard';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { 
  Calendar, 
  CaretDown, 
  CaretRight, 
  CurrencyInr, 
  DotsThreeOutline, 
  EnvelopeSimple, 
  Megaphone, 
  Storefront,
  Rss,
  TrendUp,
  Funnel,
  Users,
  Tag,
  Star,
  Clock,
  WarningCircle
} from 'phosphor-react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FunnelSection, CustomersSection, OffersSection, AdsSection, SummarySection, SalesSection, KitchenEfficiencySection, ServiceQualitySection } from '@/components/dashboard/AnalyticsSections';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import { AnimatedPage } from '@/components/ui/AnimatedPage';

const HUB_TABS = ['My Feed', 'Sales', 'Funnel', 'Customers', 'Offers', 'Ads', 'Service quality', 'Kitchen efficiency'];

const TAB_ICON_MAP: any = {
  'My Feed': Rss,
  'Sales': TrendUp,
  'Funnel': Funnel,
  'Customers': Users,
  'Offers': Tag,
  'Ads': Megaphone,
  'Service quality': Star,
  'Kitchen efficiency': Clock,
};

const ICON_MAP: any = {
  Storefront,
  Megaphone,
  CurrencyInr,
  DotsThreeOutline
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { status: restaurantStatus } = useSelector((state: RootState) => state.restaurant);
  const [activeTab, setActiveTab] = useState('Sales');
  const { queue } = useSelector((state: RootState) => state.order);

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
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <GlobalRestaurantHeader />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          style={styles.tabScrollView}
        >
          {HUB_TABS.map(tab => {
            const IconComp = TAB_ICON_MAP[tab];
            return (
              <FilterPill
                key={tab}
                label={tab}
                isActive={activeTab === tab}
                onPress={() => setActiveTab(tab)}
                color={theme.secondary}
                icon={IconComp ? <IconComp size={16} color={activeTab === tab ? theme.secondary : theme.icon} weight={activeTab === tab ? "bold" : "regular"} /> : null}
              />
            );
          })}
        </ScrollView>

        {/* Date Selector */}
        <View style={styles.dateSelectorArea}>
          <TouchableOpacity 
            style={[styles.dateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.8}
          >
            <View style={styles.dateInfo}>
              <ThemedText style={styles.dateRange}>Yesterday • 17 Mar 26</ThemedText>
              <ThemedText style={[styles.compareText, { color: theme.textSecondary }]}>vs 10 Mar 26</ThemedText>
            </View>
            <View style={[styles.dateIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
              <Calendar size={18} color={theme.text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.emailButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <EnvelopeSimple size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        {activeTab === 'Sales' && (
          <>
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
            <SalesSection />
          </>
        )}

        {activeTab === 'Funnel' && <FunnelSection />}
        {activeTab === 'Customers' && <CustomersSection />}
        {activeTab === 'Offers' && <OffersSection />}
        {activeTab === 'Ads' && <AdsSection />}

        {activeTab === 'Kitchen efficiency' && <KitchenEfficiencySection />}
        {activeTab === 'Service quality' && <ServiceQualitySection />}

        {activeTab === 'My Feed' && (
          <>
            <View style={[styles.insightsCard, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 24 }]}>
               <View style={styles.insightsHeader}>
                  <ThemedText style={[styles.insightsTitle, { color: theme.textSecondary }]}>YOUR FEED INSIGHTS</ThemedText>
               </View>
              <View style={styles.insightsMain}>
                <ThemedText style={[styles.insightsValue, { color: theme.text }]}>0</ThemedText>
                <ThemedText style={[styles.insightsChange, { color: theme.textSecondary }]}>- 0% from last week</ThemedText>
              </View>
              <TouchableOpacity style={[styles.insightsButton, { backgroundColor: theme.primary }]}>
                <ThemedText style={[styles.insightsButtonText, { color: theme.background }]}>Get deeper insights</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={[styles.menuHeadline, { marginBottom: 16 }]}>Dashboard Summary</ThemedText>
            <SummarySection onTabPress={setActiveTab} />
          </>
        )}

        {/* Shortcuts/Menu Items */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.menuHeadline}>How can we help you?</ThemedText>
          <View style={styles.menuGrid}>
            {DASHBOARD_MENU_ITEMS.map((item) => {
              const IconComp = ICON_MAP[item.icon];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.gridCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => item.route && router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, { backgroundColor: (item as any).color + '15' }]}>
                    <IconComp size={22} color={(item as any).color} weight="fill" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.gridLabel}>{item.label}</ThemedText>
                    <CaretRight size={14} color={theme.textSecondary} weight="bold" />
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
    </AnimatedPage>
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
  },
  dateSelectorArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    height: 64,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  dateInfo: {
    gap: 2,
  },
  dateRange: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
  },
  compareText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
  },
  dateIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButton: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  metricLabelArea: {
    flex: 1,
  },
  metricLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metricValue: {
    ...Typography.Display,
    fontSize: 28,
    lineHeight: 34,
  },
  changeText: {
    ...Typography.Caption,
    fontWeight: '800',
    fontSize: 12,
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
    marginTop: 32,
  },
  menuHeadline: {
    ...Typography.H2,
    fontSize: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: (Dimensions.get('window').width - 44) / 2,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridLabel: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '700',
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
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  insightsHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  insightsTitle: {
    ...Typography.Caption,
    fontWeight: '900',
    letterSpacing: 1,
  },
  insightsMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  insightsValue: {
    ...Typography.Display,
    fontSize: 48,
    lineHeight: 56,
  },
  insightsChange: {
    ...Typography.BodyRegular,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  insightsButton: {
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsButtonText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
  },
});
