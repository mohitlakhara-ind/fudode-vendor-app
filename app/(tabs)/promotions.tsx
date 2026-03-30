import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { TrendUp, CaretRight, Ticket, ChartLineUp, ShieldCheck, Lightning, Eye, Receipt, CurrencyInr, ArrowUpRight } from 'phosphor-react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { LinearGradient } from 'expo-linear-gradient';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MetricCardProps {
  label: string;
  value: string;
  growth: string;
  icon: React.ReactNode;
  theme: any;
}

const MetricCard = ({ label, value, growth, icon, theme }: MetricCardProps) => (
  <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.metricHeader}>
      <View style={[styles.metricIconContainer, { backgroundColor: theme.surfaceSecondary }]}>
        {icon}
      </View>
      <View style={[styles.miniGrowthBadge, { backgroundColor: theme.success + '15' }]}>
        <TrendUp size={10} color={theme.success} weight="bold" />
        <ThemedText style={[styles.miniGrowthText, { color: theme.success }]}>{growth}</ThemedText>
      </View>
    </View>
    <ThemedText style={[styles.metricValue, { color: theme.text }]}>{value}</ThemedText>
    <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
  </View>
);

export default function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const OWNED_RESTAURANTS = [
    { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
    { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
  ];

  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const { queue } = useSelector((state: RootState) => state.order);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
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
        onSelect={(res) => {
          setCurrentRestaurant(res);
          setIsSwitcherVisible(false);
        }}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Insights Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Growth Insights</ThemedText>
          <ThemedText style={[styles.sectionSub, { color: theme.textSecondary }]}>Last 30 days performance</ThemedText>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsContainer}
          snapToInterval={160 + 12}
          decelerationRate="fast"
        >
          <MetricCard 
            label="Total Reach" 
            value="2.4k" 
            growth="12%" 
            theme={theme}
            icon={<Eye size={20} color={theme.text} weight="bold" />}
          />
          <MetricCard 
            label="Revenue" 
            value="₹1.2L" 
            growth="8.4%" 
            theme={theme}
            icon={<CurrencyInr size={20} color={theme.text} weight="bold" />}
          />
          <MetricCard 
            label="Orders" 
            value="456" 
            growth="15.2%" 
            theme={theme}
            icon={<Receipt size={20} color={theme.text} weight="bold" />}
          />
        </ScrollView>

        {/* Featured Ad Card */}
        <AnimatedCard index={1}>
          <Pressable 
            onPress={() => router.push('/ads/create-ad')}
            style={({ pressed }) => [
              styles.featuredCard,
              { opacity: pressed ? 0.95 : 1 }
            ]}
          >
            <LinearGradient
              colors={isDark ? [theme.surface, theme.background] : [theme.surface, theme.surfaceSecondary]}
              style={[styles.featuredGradient, { borderColor: theme.border }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredLeft}>
                  <View style={[styles.adBadge, { backgroundColor: theme.primary }]}>
                    <ThemedText style={[styles.adBadgeText, { color: theme.background }]}>BOOST VISIBILITY</ThemedText>
                  </View>
                  <ThemedText style={[styles.featuredTitle, { color: theme.text }]}>Drive 3x More Orders with Ads</ThemedText>
                  <ThemedText style={[styles.featuredDesc, { color: theme.textSecondary }]}>
                    Get premium placement at the top of search results.
                  </ThemedText>
                  
                  <TouchableOpacity 
                    style={[styles.featuredCta, { backgroundColor: theme.text }]}
                    onPress={() => router.push('/ads/create-ad')}
                  >
                    <ThemedText style={[styles.featuredCtaText, { color: theme.background }]}>Start Campaign</ThemedText>
                    <ArrowUpRight size={16} color={theme.background} weight="bold" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.featuredRight}>
                  <View style={[styles.accentCircle, { backgroundColor: theme.primary + '10' }]}>
                    <ChartLineUp size={80} color={theme.primary} weight="bold" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </AnimatedCard>

        <ThemedText style={[styles.smallSectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>MARKETING TOOLS</ThemedText>

        <View style={styles.toolsGrid}>
          {/* Offers Service Card */}
          <Pressable 
            style={({ pressed }) => [
              styles.toolCard, 
              { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                opacity: pressed ? 0.9 : 1,
              }
            ]}
            onPress={() => router.push('/growth/offers')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: theme.error + '15' }]}>
              <Ticket size={24} color={theme.error} weight="bold" />
            </View>
            <ThemedText style={styles.toolTitle}>Offers</ThemedText>
            <ThemedText style={[styles.toolDesc, { color: theme.textSecondary }]}>Discounts & Deals</ThemedText>
          </Pressable>

          {/* Visit Packs Card */}
          <Pressable 
            style={({ pressed }) => [
              styles.toolCard, 
              { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                opacity: pressed ? 0.9 : 1,
              }
            ]}
            onPress={() => router.push('/growth/loyalty')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: theme.info + '15' }]}>
              <Lightning size={24} color={theme.info} weight="bold" />
            </View>
            <ThemedText style={styles.toolTitle}>Visit Packs</ThemedText>
            <ThemedText style={[styles.toolDesc, { color: theme.textSecondary }]}>Loyalty Program</ThemedText>
          </Pressable>
        </View>

        {/* Growth Tip Section */}
        <View style={[styles.tipsCard, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <View style={styles.tipsHeader}>
            <View style={[styles.tipIconCircle, { backgroundColor: theme.primary }]}>
               <ShieldCheck size={20} color={theme.background} weight="fill" />
            </View>
            <View>
              <ThemedText style={[styles.tipsTitle, { color: theme.text }]}>Growth Strategy</ThemedText>
              <ThemedText style={[styles.tipsSubtitle, { color: theme.textSecondary }]}>Pro Tip of the day</ThemedText>
            </View>
          </View>
          
          <ThemedText style={[styles.tipText, { color: theme.text }]}>
            Restaurants using <ThemedText style={{ color: theme.primary, fontWeight: '700' }}>Visit Packs</ThemedText> see a 40% higher customer retention rate in their first month.
          </ThemedText>
          
          <TouchableOpacity style={styles.learnMoreBtn}>
             <ThemedText style={[styles.learnMoreText, { color: theme.primary }]}>Explore full guide →</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.H1,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSub: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.8,
  },
  metricsContainer: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 8,
    gap: 12,
  },
  metricCard: {
    width: 160,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniGrowthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2,
  },
  miniGrowthText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricValue: {
    ...Typography.H2,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  featuredCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 28,
    overflow: 'hidden',
  },
  featuredGradient: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLeft: {
    flex: 1,
    gap: 12,
  },
  adBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  featuredTitle: {
    ...Typography.H2,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  featuredDesc: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 8,
  },
  featuredCtaText: {
    fontSize: 14,
    fontWeight: '700',
  },
  featuredRight: {
    marginLeft: 12,
  },
  accentCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallSectionTitle: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  toolCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  toolIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  toolTitle: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '700',
  },
  toolDesc: {
    ...Typography.Caption,
    fontSize: 12,
    opacity: 0.7,
  },
  tipsCard: {
    margin: 20,
    marginTop: 32,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    gap: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tipIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsTitle: {
    ...Typography.H3,
    fontSize: 18,
    fontWeight: '800',
  },
  tipsSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  tipText: {
    ...Typography.BodyRegular,
    fontSize: 15,
    lineHeight: 24,
  },
  learnMoreBtn: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
