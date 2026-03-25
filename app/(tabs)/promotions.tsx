import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { TrendUp, SquaresFour, CaretRight, Ticket, SpeakerHigh, ChartLineUp, ShieldCheck, Lightning } from 'phosphor-react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={styles.headerInfo}>
          <TouchableOpacity style={styles.restaurantRow}>
            <ThemedText style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.rounded }]}>Muggs Cafe</ThemedText>
            <ThemedText style={{ color: theme.primary, fontSize: 12 }}>▼</ThemedText>
          </TouchableOpacity>
          <ThemedText style={[styles.restaurantSub, { color: theme.textSecondary }]}>Balotra Locality, Balotra</ThemedText>
        </View>
        <TouchableOpacity style={[styles.headerIcon, { backgroundColor: theme.surfaceSecondary }]}>
            <SquaresFour size={24} color={theme.text} weight="bold" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Growth Summary Banner */}
        <AnimatedCard index={0}>
          <LinearGradient
            colors={isDark ? ['#1A1A1A', '#0D0D0D'] : ['#FFF', '#F8F9FA']}
            style={[styles.summaryBanner, { borderColor: theme.border + '20' }]}
          >
            <View style={styles.summaryTop}>
              <View style={[styles.growthBadge, { backgroundColor: theme.success + '15' }]}>
                <TrendUp size={14} color={theme.success} weight="bold" />
                <ThemedText style={[styles.growthBadgeText, { color: theme.success }]}>+12.5% Growth</ThemedText>
              </View>
              <ThemedText style={[styles.summaryPeriod, { color: theme.textSecondary }]}>Last 30 days</ThemedText>
            </View>
            
            <ThemedText style={[styles.summaryTitle, { color: theme.text }]}>Propel your business to the next level</ThemedText>
            <ThemedText style={[styles.summaryDesc, { color: theme.textSecondary }]}>Use our marketing tools to reach more customers and increase your order volume.</ThemedText>
            
            <View style={styles.summaryFooter}>
              <View style={styles.insightItem}>
                <ThemedText style={[styles.insightValue, { color: theme.text }]}>2.4k</ThemedText>
                <ThemedText style={[styles.insightLabel, { color: theme.textSecondary }]}>Reach</ThemedText>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border + '20' }]} />
              <View style={styles.insightItem}>
                <ThemedText style={[styles.insightValue, { color: theme.text }]}>₹1.2L</ThemedText>
                <ThemedText style={[styles.insightLabel, { color: theme.textSecondary }]}>Revenue</ThemedText>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border + '20' }]} />
              <View style={styles.insightItem}>
                <ThemedText style={[styles.insightValue, { color: theme.text }]}>456</ThemedText>
                <ThemedText style={[styles.insightLabel, { color: theme.textSecondary }]}>Orders</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>

        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>BOOST YOUR VISIBILITY</ThemedText>
        
        {/* Ad Service Card */}
        <AnimatedCard index={1}>
          <Pressable 
            style={({ pressed }) => [
              styles.serviceCard, 
              { backgroundColor: theme.surface, borderColor: theme.border + '15', transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => router.push('/ads/create-ad')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <ChartLineUp size={28} color="#4F46E5" weight="duotone" />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.cardHeaderRow}>
                <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Create Ads</ThemedText>
                <View style={[styles.newTag, { backgroundColor: theme.primary }]}>
                  <ThemedText style={styles.newTagText}>NEW</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Get premium placement on the Fudode app. Increase impressions by up to 3x.
              </ThemedText>
            </View>
            <CaretRight size={20} color={theme.textSecondary} weight="bold" />
          </Pressable>
        </AnimatedCard>

        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>REWARD YOUR CUSTOMERS</ThemedText>

        {/* Offers Service Card */}
        <AnimatedCard index={2}>
          <Pressable 
            style={({ pressed }) => [
              styles.serviceCard, 
              { backgroundColor: theme.surface, borderColor: theme.border + '15', transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => router.push('/growth/offers')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ticket size={28} color="#EF4444" weight="duotone" />
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Offers & Discounts</ThemedText>
              <ThemedText style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Create custom discounts to attract new customers and reward loyal diners.
              </ThemedText>
            </View>
            <CaretRight size={20} color={theme.textSecondary} weight="bold" />
          </Pressable>
        </AnimatedCard>

        {/* Visit Packs Card */}
        <AnimatedCard index={3}>
          <Pressable 
            style={({ pressed }) => [
              styles.serviceCard, 
              { backgroundColor: theme.surface, borderColor: theme.border + '15', marginTop: 16, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Lightning size={28} color="#22C55E" weight="duotone" />
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Visit Packs</ThemedText>
              <ThemedText style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Offer special bundles to drive repeat visits and build long-term retention.
              </ThemedText>
            </View>
            <CaretRight size={20} color={theme.textSecondary} weight="bold" />
          </Pressable>
        </AnimatedCard>

        {/* Tips Section */}
        <View style={[styles.tipsSection, { backgroundColor: theme.surfaceSecondary + '50' }]}>
          <View style={styles.tipsHeader}>
            <ShieldCheck size={20} color={theme.primary} weight="fill" />
            <ThemedText style={[styles.tipsTitle, { color: theme.text }]}>Growth Tips</ThemedText>
          </View>
          <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
            Restaurants with high-quality photos and active offers see a 40% higher conversion rate.
          </ThemedText>
          <Pressable style={styles.learnMoreBtn}>
             <ThemedText style={[styles.learnMoreText, { color: theme.primary }]}>Learn how to grow →</ThemedText>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerInfo: {
    gap: 2,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  restaurantSub: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerIcon: {
    padding: 10,
    borderRadius: 14,
  },
  scrollContent: { 
    padding: 16,
    paddingBottom: 120,
  },
  summaryBanner: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 28,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  growthBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  summaryPeriod: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.8,
  },
  summaryDesc: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 24,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  insightItem: {
    flex: 1,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingLeft: 4,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  newTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },
  tipsSection: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    gap: 12,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  learnMoreBtn: {
    marginTop: 4,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
