import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { 
  CaretLeft, 
  Plus, 
  Lightning, 
  UsersThree, 
  Gift, 
  ChartLineUp,
  Clock,
  DotsThreeVertical,
  CaretRight
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { PremiumButton } from '@/components/ui/PremiumButton';

const { width } = Dimensions.get('window');

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  theme: any;
  isDark: boolean;
}

const MetricCard = ({ label, value, icon: Icon, theme, isDark }: MetricCardProps) => (
  <View style={[
    styles.metricCard, 
    { 
      backgroundColor: isDark ? theme.surface + '80' : theme.surface,
      borderColor: theme.border + '26' // Ghost Border
    }
  ]}>
    <View style={[styles.metricIconBox, { backgroundColor: theme.primary + '15' }]}>
      <Icon size={20} color={theme.primary} weight="bold" />
    </View>
    <View>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  </View>
);

export default function LoyaltyDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const MOCK_LOYALTY_PROGRAMS = [
    {
      id: 'lp1',
      title: 'Diamond Rewards',
      description: 'Visit 5 times, get ₹100 off',
      status: 'Active',
      customers: 124,
      completions: 42,
    },
    {
      id: 'lp2',
      title: 'Weekend Warrior',
      description: '3 orders above ₹500, get free dessert',
      status: 'Active',
      customers: 86,
      completions: 12,
    }
  ];

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Loyalty Programs</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.headerContent}>
          <Text style={[styles.headerDesc, { color: theme.textSecondary }]}>
            Engage your regulars with "Visit Packs" and performance-based rewards.
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <MetricCard 
            label="Enrolled" 
            value="210" 
            icon={UsersThree} 
            theme={theme} 
            isDark={isDark} 
          />
          <MetricCard 
            label="Rewards Given" 
            value="₹5.4k" 
            icon={Gift} 
            theme={theme} 
            isDark={isDark} 
          />
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <PremiumButton
            label="Create New Program"
            onPress={() => router.push('/growth/loyalty/create')}
            variant="glassy"
            leftIcon={<Plus size={20} color={theme.background} weight="bold" />}
            style={styles.createBtn}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable 
            onPress={() => setActiveTab('active')}
            style={[styles.tab, activeTab === 'active' && { borderBottomColor: theme.primary }]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'active' ? theme.primary : theme.textSecondary }
            ]}>Active (2)</Text>
          </Pressable>
          <Pressable 
            onPress={() => setActiveTab('history')}
            style={[styles.tab, activeTab === 'history' && { borderBottomColor: theme.primary }]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'history' ? theme.primary : theme.textSecondary }
            ]}>History</Text>
          </Pressable>
        </View>

        {/* Program List */}
        <View style={styles.listContainer}>
          {activeTab === 'active' ? (
            MOCK_LOYALTY_PROGRAMS.map((program) => (
              <Pressable 
                key={program.id}
                onPress={() => router.push({ pathname: '/growth/loyalty/details', params: { id: program.id } })}
                style={[
                  styles.programCard, 
                  { 
                    backgroundColor: isDark ? theme.surface + '80' : theme.surface,
                    borderColor: theme.border + '26'
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: theme.primary + '10' }]}>
                    <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.statusText, { color: theme.primary }]}>{program.status}</Text>
                  </View>
                  <DotsThreeVertical size={20} color={theme.textSecondary} />
                </View>

                <Text style={[styles.programTitle, { color: theme.text }]}>{program.title}</Text>
                <Text style={[styles.programDesc, { color: theme.textSecondary }]}>{program.description}</Text>

                <View style={[styles.cardDivider, { backgroundColor: theme.border + '26' }]} />

                <View style={styles.cardFooter}>
                  <View style={styles.footerStat}>
                    <UsersThree size={16} color={theme.textSecondary} />
                    <Text style={[styles.footerStatText, { color: theme.textSecondary }]}>
                      <Text style={{ color: theme.text, fontWeight: '700' }}>{program.customers}</Text> Enrolled
                    </Text>
                  </View>
                  <View style={styles.footerStat}>
                    <Gift size={16} color={theme.textSecondary} />
                    <Text style={[styles.footerStatText, { color: theme.textSecondary }]}>
                      <Text style={{ color: theme.text, fontWeight: '700' }}>{program.completions}</Text> Rewarded
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
            <View style={{ opacity: 0.3 }}>
              <Clock size={48} color={theme.textSecondary} weight="light" />
            </View>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No inactive programs yet.</Text>
            </View>
          )}
        </View>

        {/* Growth Tip */}
        <View style={[styles.tipCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
            <Lightning size={24} color={theme.primary} weight="fill" />
            <View style={{ flex: 1 }}>
                <Text style={[styles.tipTitle, { color: theme.text }]}>Loyalty Boost</Text>
                <Text style={[styles.tipDesc, { color: theme.textSecondary }]}>
                    Programs with 5-7 visits see the highest completion rates.
                </Text>
            </View>
            <CaretRight size={16} color={theme.primary} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  headerContent: {
    marginTop: 20,
  },
  headerDesc: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.H3,
    fontSize: 18,
  },
  metricLabel: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 32,
  },
  createBtn: {
    width: '100%',
    height: 56,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    gap: 16,
  },
  programCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
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
  programTitle: {
    ...Typography.H3,
    fontSize: 18,
    marginBottom: 4,
  },
  programDesc: {
    ...Typography.BodyRegular,
    fontSize: 14,
    opacity: 0.7,
  },
  cardDivider: {
    height: 1,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 24,
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerStatText: {
    ...Typography.Caption,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    ...Typography.BodyRegular,
    opacity: 0.5,
  },
  tipCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tipTitle: {
    ...Typography.H3,
    fontSize: 16,
    marginBottom: 2,
  },
  tipDesc: {
    ...Typography.Caption,
    fontSize: 12,
    opacity: 0.7,
  },
});
