import React from 'react';
import { View } from 'react-native';
import { DashboardCard } from './DashboardCard';
import { MetricComparisonCard, FunnelStep, ListMetricItem, MetricGrid, SummaryCard, StatusIndicator, HorizontalBar, TimeGridItem } from './AnalyticsComponents';
import { MOCK_DASHBOARD_STATS } from '@/constants/mockDashboard';
import { Typography, Colors, StatusColors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { CurrencyInr, Funnel, Users, Gift, Megaphone, Clock, Star } from 'phosphor-react-native';

export const SummarySection = ({ onTabPress }: { onTabPress: (tab: string) => void }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const { sales, funnel, customers, offers, ads, serviceQuality, kitchenEfficiency } = MOCK_DASHBOARD_STATS;
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <SummaryCard 
        title="Sales" 
        value={`₹${sales.netSales}`} 
        growth={sales.salesChange} 
        icon={<CurrencyInr size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Sales')}
      />
      <SummaryCard 
        title="Funnel" 
        value={`${funnel.summary.ordersDelivered}`} 
        growth={15} 
        icon={<Funnel size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Funnel')}
      />
      <SummaryCard 
        title="Customers" 
        value={`${customers.segments.reduce((acc, s) => acc + s.count, 0)}`} 
        growth={10} 
        icon={<Users size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Customers')}
      />
      <SummaryCard 
        title="Offers" 
        value={`₹${offers.summary.grossSalesFromOffers}`} 
        growth={22} 
        icon={<Gift size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Offers')}
      />
      <SummaryCard 
        title="Ads" 
        value={`₹${ads.summary.revenue}`} 
        growth={18} 
        icon={<Megaphone size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Ads')}
      />
      <SummaryCard 
        title="Service" 
        value={`${serviceQuality.onlineTimePercent}%`} 
        growth={2} 
        icon={<Star size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Service quality')}
      />
      <SummaryCard 
        title="Kitchen" 
        value={kitchenEfficiency.avgPrepTime} 
        growth={-5} 
        icon={<Clock size={14} color={theme.textSecondary} />} 
        onPress={() => onTabPress('Kitchen efficiency')}
      />
    </View>
  );
};

export const SalesSection = () => {
  const { sales } = MOCK_DASHBOARD_STATS;
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View>
      <DashboardCard title="Order Status Breakdown" subtitle="Distribution of today's orders">
        {sales.statusBreakdown.map(status => (
          <StatusIndicator 
            key={status.status}
            label={status.status}
            count={status.count}
            percentage={Math.round((status.count / sales.ordersDelivered) * 100)}
            color={status.color}
          />
        ))}
      </DashboardCard>

      <DashboardCard title="Peak Hour Distribution" subtitle="When do customers order most?">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
          {sales.hourlyDistribution.map(item => {
            const maxValue = Math.max(...sales.hourlyDistribution.map(h => h.value));
            return (
              <TimeGridItem 
                key={item.label}
                label={item.label}
                value={item.value}
                max={maxValue}
                isPeak={item.value > maxValue * 0.7}
              />
            );
          })}
        </View>
      </DashboardCard>

      <DashboardCard title="Top Selling Items" subtitle="Highest revenue generators">
        {sales.topItems.map(item => (
          <HorizontalBar 
            key={item.name}
            label={item.name}
            value={item.revenue}
            max={Math.max(...sales.topItems.map(i => i.revenue))}
            suffix=""
            color={theme.primary} 
          />
        ))}
      </DashboardCard>
    </View>
  );
};

export const FunnelSection = () => {
  const { funnel } = MOCK_DASHBOARD_STATS;
  return (
    <DashboardCard title="Order Funnel" subtitle="Track your customer journey">
      {funnel.steps.map((step, index) => (
        <FunnelStep 
          key={step.label}
          label={step.label}
          value={step.count}
          total={funnel.steps[0].count}
          percentage={step.percentage}
          isLast={index === funnel.steps.length - 1}
        />
      ))}
    </DashboardCard>
  );
};

export const CustomersSection = () => {
  const { customers } = MOCK_DASHBOARD_STATS;
  return (
    <DashboardCard title="Customer Insights" subtitle="Who are your buyers?">
      <MetricGrid>
        <MetricComparisonCard 
          label="New Customers" 
          current={customers.segments.find(s => s.type === 'new')?.count || 0}
          growth={12}
        />
        <MetricComparisonCard 
          label="Repeat Customers" 
          current={customers.segments.find(s => s.type === 'repeat')?.count || 0}
          growth={8}
        />
      </MetricGrid>
      <View style={{ marginTop: 20 }}>
        <ThemedText style={{ ...Typography.H3, marginBottom: 16 }}>Segments</ThemedText>
        {customers.segments.map(segment => (
          <ListMetricItem 
            key={segment.type}
            label={segment.type.charAt(0).toUpperCase() + segment.type.slice(1)}
            value={segment.count}
            subValue={`Revenue Potential: ${segment.spendingPotential}`}
          />
        ))}
      </View>
      <View style={{ marginTop: 24 }}>
        <ThemedText style={{ ...Typography.H3, marginBottom: 16 }}>Loyalty Breakdown</ThemedText>
        {customers.loyalty.map(item => (
          <HorizontalBar 
            key={item.label}
            label={item.label}
            value={item.value}
            max={100}
            suffix="%"
          />
        ))}
      </View>
      <View style={{ marginTop: 24 }}>
        <ThemedText style={{ ...Typography.H3, marginBottom: 16 }}>Distance Breakdown</ThemedText>
        {customers.distanceBreakup.map(dist => (
          <ListMetricItem 
            key={dist.range}
            label={dist.range}
            value={dist.users}
            subValue="active users"
          />
        ))}
      </View>
    </DashboardCard>
  );
};

export const OffersSection = () => {
  const { offers } = MOCK_DASHBOARD_STATS;
  return (
    <DashboardCard title="Offers Performance" subtitle="Effectiveness of your deals">
      {offers.list.map(offer => (
        <ListMetricItem 
          key={offer.id}
          label={offer.id}
          value={`₹${offer.revenueGenerated}`}
          subValue={`${offer.ordersGenerated} orders • ROI: ${(offer.revenueGenerated / (offer.spend || 1)).toFixed(1)}x`}
        />
      ))}
    </DashboardCard>
  );
};

export const AdsSection = () => {
  const { ads } = MOCK_DASHBOARD_STATS;
  return (
    <DashboardCard title="Ads Performance" subtitle="ROI on your spends">
      <MetricGrid>
        <MetricComparisonCard 
          label="Ad Spend" 
          current={`₹${ads.summary.spend}`}
          growth={5}
        />
        <MetricComparisonCard 
          label="ROAS" 
          current={`${ads.summary.roi}x`}
          growth={12}
        />
      </MetricGrid>
      
      <View style={{ marginTop: 24 }}>
        <ThemedText style={{ ...Typography.H3, marginBottom: 16 }}>Ad Conversion Funnel</ThemedText>
        {ads.conversionFunnel.map((step, index) => (
          <FunnelStep 
            key={step.label}
            label={step.label}
            value={step.count}
            total={ads.conversionFunnel[0].count}
            percentage={step.percentage}
            isLast={index === ads.conversionFunnel.length - 1}
          />
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <ThemedText style={{ ...Typography.H3, marginBottom: 16 }}>Campaigns</ThemedText>
        {ads.list.map(ad => (
          <ListMetricItem 
            key={ad.id}
            label={`Campaign ${ad.id}`}
            value={`₹${ad.revenueGenerated}`}
            subValue={`Spend: ₹${ad.spend} • ${ad.clicks} clicks`}
          />
        ))}
      </View>
    </DashboardCard>
  );
};

export const KitchenEfficiencySection = () => {
  const { kitchenEfficiency, mealtimeKPT } = MOCK_DASHBOARD_STATS;
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View>
      <DashboardCard title="KPT & Delayed orders" subtitle="Last updated: a day ago">
        <MetricGrid>
          <MetricComparisonCard 
            label="Avg. Prep Time" 
            current={kitchenEfficiency.avgPrepTime} 
            growth={-5} 
          />
          <MetricComparisonCard 
            label="KPT Delayed" 
            current={`${kitchenEfficiency.kptDelayedOrders}%`} 
            growth={kitchenEfficiency.kptDelayedChange} 
          />
        </MetricGrid>
      </DashboardCard>

      <DashboardCard title="Mealtime KPTs" subtitle="Preparation efficiency by period">
        {mealtimeKPT?.map((kpt, idx) => (
          <View key={idx}>
            <ListMetricItem 
              label={kpt.label}
              value={kpt.value}
              subValue={kpt.time}
            />
            {idx < (mealtimeKPT?.length || 0) - 1 && <View style={[styles.cardDivider, { borderColor: theme.border }]} />}
          </View>
        ))}
      </DashboardCard>
    </View>
  );
};

export const ServiceQualitySection = () => {
  const { serviceQuality, ratingDistribution } = MOCK_DASHBOARD_STATS;
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View>
      <DashboardCard title="Service quality" subtitle="Last updated: an hour ago">
        <MetricGrid>
          <MetricComparisonCard 
            label="Complaints" 
            current={`${serviceQuality.complaints}%`} 
            growth={0} 
          />
          <MetricComparisonCard 
            label="Online Time" 
            current={`${serviceQuality.onlineTimePercent}%`} 
            growth={2} 
          />
        </MetricGrid>
      </DashboardCard>

      <DashboardCard title="Ratings Distribution" subtitle="Customer feedback breakdown">
        {ratingDistribution.map(rating => (
          <HorizontalBar 
            key={rating.label}
            label={rating.label}
            value={rating.value}
            max={Math.max(...ratingDistribution.map(r => r.value))}
            color={StatusColors.Ready}
          />
        ))}
      </DashboardCard>

      <DashboardCard title="Rejection Reasons" subtitle="Why orders were declined">
        {serviceQuality.rejectionReasons.map(reason => (
          <HorizontalBar 
            key={reason.label}
            label={reason.label}
            value={reason.value}
            max={Math.max(...serviceQuality.rejectionReasons.map(r => r.value))}
            color={StatusColors.Late}
          />
        ))}
      </DashboardCard>
    </View>
  );
};

const styles = {
  cardDivider: {
    height: 1,
    marginVertical: 4,
    borderWidth: 1,
    opacity: 0.1,
  },
};
