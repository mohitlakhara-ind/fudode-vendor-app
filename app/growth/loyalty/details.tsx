import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  CaretLeft, 
  UsersThree, 
  Gift, 
  TrendUp, 
  Clock,
  DotsThreeVertical,
  Calendar,
  Ticket
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { PremiumButton } from '@/components/ui/PremiumButton';

const { width } = Dimensions.get('window');

interface PerformanceMetricProps {
  label: string;
  value: string;
  growth?: string;
  theme: any;
  isDark: boolean;
}

const PerformanceMetric = ({ label, value, growth, theme, isDark }: PerformanceMetricProps) => (
  <View style={[
    styles.metricCard, 
    { 
      backgroundColor: isDark ? theme.surface + '80' : theme.surface,
      borderColor: theme.border + '26' 
    }
  ]}>
    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
    <View style={styles.metricRow}>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      {growth && (
        <View style={[styles.growthBadge, { backgroundColor: theme.success + '15' }]}>
          <TrendUp size={10} color={theme.success} weight="bold" />
          <Text style={[styles.growthText, { color: theme.success }]}>{growth}</Text>
        </View>
      )}
    </View>
  </View>
);

export default function LoyaltyDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  // Mock data based on ID
  const program = {
    id: id || 'lp1',
    title: 'Diamond Rewards',
    description: 'Visit 5 times, get ₹100 off',
    status: 'Active',
    startDate: '12 Mar 2026',
    enrolled: 124,
    claimCount: 42,
    revenueImpact: '₹12,400',
    avgOrderValue: '₹540',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <Pressable 
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.surface }]}
          >
            <CaretLeft size={24} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Program Details</Text>
          <Pressable style={[styles.backBtn, { backgroundColor: theme.surface }]}>
            <DotsThreeVertical size={24} color={theme.text} weight="bold" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.programInfo}>
          <View style={[styles.statusBadge, { backgroundColor: theme.primary + '15' }]}>
            <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.statusText, { color: theme.primary }]}>{program.status}</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{program.title}</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{program.description}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>Started {program.startDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>Ongoing</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PERFORMANCE OVERVIEW</Text>
        <View style={styles.metricsGrid}>
          <PerformanceMetric 
            label="ENROLLED USERS" 
            value={program.enrolled.toString()} 
            growth="12%" 
            theme={theme} 
            isDark={isDark} 
          />
          <PerformanceMetric 
            label="REWARDS CLAIMED" 
            value={program.claimCount.toString()} 
            growth="8%" 
            theme={theme} 
            isDark={isDark} 
          />
          <PerformanceMetric 
            label="EST. REVENUE" 
            value={program.revenueImpact} 
            theme={theme} 
            isDark={isDark} 
          />
          <PerformanceMetric 
            label="AVG. ORDER VALUE" 
            value={program.avgOrderValue} 
            theme={theme} 
            isDark={isDark} 
          />
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? theme.surface + '80' : theme.surface, borderColor: theme.border + '26' }]}>
            <View style={styles.cardHeader}>
                <UsersThree size={20} color={theme.primary} weight="bold" />
                <Text style={[styles.cardTitle, { color: theme.text }]}>Retention Insights</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Loyalty customers are <Text style={{ color: theme.success, fontWeight: '700' }}>2.4x</Text> more likely to order again within 14 days compared to regular customers.
            </Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? theme.surface + '80' : theme.surface, borderColor: theme.border + '26' }]}>
            <View style={styles.cardHeader}>
                <Ticket size={20} color={theme.primary} weight="bold" />
                <Text style={[styles.cardTitle, { color: theme.text }]}>Program Rules</Text>
            </View>
            <View style={styles.rulesList}>
                <View style={[styles.ruleItem, { borderBottomColor: theme.border + '26' }]}>
                    <Text style={[styles.ruleLabel, { color: theme.textSecondary }]}>Visits required</Text>
                    <Text style={[styles.ruleValue, { color: theme.text }]}>5</Text>
                </View>
                <View style={[styles.ruleItem, { borderBottomColor: theme.border + '26' }]}>
                    <Text style={[styles.ruleLabel, { color: theme.textSecondary }]}>Reward value</Text>
                    <Text style={[styles.ruleValue, { color: theme.text }]}>₹100 Flat Off</Text>
                </View>
                <View style={styles.ruleItem}>
                    <Text style={[styles.ruleLabel, { color: theme.textSecondary }]}>Minimum order</Text>
                    <Text style={[styles.ruleValue, { color: theme.text }]}>₹249</Text>
                </View>
            </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PremiumButton
          label="End Program"
          onPress={() => router.back()}
          variant="glassy"
          color={theme.error}
          style={styles.stopBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.H2,
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  programInfo: {
    marginBottom: 32,
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.H1,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  desc: {
    ...Typography.BodyRegular,
    fontSize: 15,
    opacity: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  metricLabel: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
    opacity: 0.7,
  },
  metricValue: {
    ...Typography.H2,
    fontSize: 22,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '800',
  },
  card: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    ...Typography.H3,
    fontSize: 18,
  },
  cardDesc: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  rulesList: {
    gap: 0,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ruleLabel: {
    ...Typography.Caption,
    fontSize: 14,
  },
  ruleValue: {
    ...Typography.H3,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stopBtn: {
    width: '100%',
  },
});
