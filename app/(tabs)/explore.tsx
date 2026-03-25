import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChartLineUp, 
  TrendUp, 
  Users, 
  Star, 
  BookOpen, 
  Megaphone, 
  ListChecks,
  CaretRight,
  ArrowUpRight,
  Lightbulb,
  ChatDots
} from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassView } from '@/components/ui/GlassView';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Separator } from '@/components/ui/Separator';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATS = [
  { label: 'Orders', value: '124', trend: '+12%', icon: ChartLineUp, color: '#0066FF' },
  { label: 'Revenue', value: '₹42.5k', trend: '+8.4%', icon: TrendUp, color: '#10B981' },
  { label: 'Customers', value: '86', trend: '+5%', icon: Users, color: '#8833FF' },
  { label: 'Rating', value: '4.8', trend: 'Stable', icon: Star, color: '#facb04' },
];

const QUICK_ACTIONS = [
  { title: 'Manage Menu', subtitle: 'Update prices & availability', icon: ListChecks, color: '#FF8800' },
  { title: 'Promotions', subtitle: 'Create new offers for customers', icon: Megaphone, color: '#FF3366' },
  { title: 'Reviews', subtitle: 'Respond to customer feedback', icon: ChatDots, color: '#00AAFF' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* DECORATIVE BACKGROUND */}
      <View style={[styles.bgCircle, { backgroundColor: theme.primary, opacity: isDark ? 0.08 : 0.04, left: -50, top: -50 }]} />
      <View style={[styles.bgCircle, { backgroundColor: '#8833FF', opacity: isDark ? 0.06 : 0.03, right: -100, top: 300 }]} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Growth & Insights</ThemedText>
          <ThemedText style={styles.subtitle}>Track your business progress today</ThemedText>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <GlassView key={index} intensity={isDark ? 30 : 50} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={20} color={stat.color} weight="fill" />
                </View>
                {stat.trend !== 'Stable' && (
                  <View style={styles.trendBadge}>
                    <ArrowUpRight size={10} color="#10B981" weight="bold" />
                    <Text style={styles.trendText}>{stat.trend}</Text>
                  </View>
                )}
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </GlassView>
          ))}
        </View>

        <Separator marginVertical={24} opacity={0.3} />

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Business Tools</ThemedText>
        </View>

        {QUICK_ACTIONS.map((action, index) => (
          <Pressable key={index} style={({ pressed }) => [styles.actionItem, pressed && { opacity: 0.7 }]}>
            <GlassView intensity={isDark ? 20 : 40} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <action.icon size={24} color={action.color} weight="duotone" />
              </View>
              <View style={styles.actionText}>
                <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
                <ThemedText style={styles.actionSubtitle}>{action.subtitle}</ThemedText>
              </View>
              <CaretRight size={20} color={theme.icon} />
            </GlassView>
          </Pressable>
        ))}

        <Separator marginVertical={24} opacity={0.3} />

        {/* RESOURCE CENTER */}
        <GlassView intensity={isDark ? 40 : 60} style={styles.resourceCard}>
          <View style={styles.resourceContent}>
            <View style={styles.resourceHeader}>
              <Lightbulb size={24} color={theme.primary} weight="fill" />
              <ThemedText style={styles.resourceTag}>GROWTH TIP</ThemedText>
            </View>
            <ThemedText style={styles.resourceTitle}>How to increase your 'Repeat Customer' rate by 20%</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Learn how targeted promotions and quality consistency can transform your business.
            </ThemedText>
            <PremiumButton 
              label="Read Guide" 
              onPress={() => {}} 
              variant="glassy" 
              size="small"
              style={styles.resourceButton}
              leftIcon={<BookOpen size={16} color={theme.primary} />}
            />
          </View>
        </GlassView>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ThemedView>
  );
}

// Stats trend badge needs regular Text for color stability
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: -1,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    ...Typography.Display,
    fontSize: 28,
  },
  subtitle: {
    ...Typography.BodyRegular,
    opacity: 0.6,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  statValue: {
    ...Typography.H1,
    fontSize: 24,
  },
  statLabel: {
    ...Typography.Caption,
    opacity: 0.6,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.H2,
  },
  actionItem: {
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.H3,
  },
  actionSubtitle: {
    ...Typography.Caption,
    opacity: 0.6,
    marginTop: 2,
  },
  resourceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(250, 203, 4, 0.05)',
  },
  resourceContent: {
    padding: 24,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resourceTag: {
    ...Typography.Caption,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#facb04',
  },
  resourceTitle: {
    ...Typography.H2,
    lineHeight: 28,
    marginBottom: 8,
  },
  resourceDescription: {
    ...Typography.BodyRegular,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 22,
  },
  resourceButton: {
    alignSelf: 'flex-start',
  },
});
