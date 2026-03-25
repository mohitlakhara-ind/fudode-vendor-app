import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowUpRight, CaretLeft, CheckCircle, Info, Question } from 'phosphor-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_PAYOUTS = [
  { id: '1', date: 'Mar 24, 2026', amount: '₹12,450.50', status: 'Paid', method: 'HDFC Bank •• 4291' },
  { id: '2', date: 'Mar 17, 2026', amount: '₹8,920.00', status: 'Paid', method: 'HDFC Bank •• 4291' },
  { id: '3', date: 'Mar 10, 2026', amount: '₹15,100.25', status: 'Paid', method: 'HDFC Bank •• 4291' },
  { id: '4', date: 'Mar 03, 2026', amount: '₹11,240.00', status: 'Paid', method: 'HDFC Bank •• 4291' },
  { id: '5', date: 'Feb 24, 2026', amount: '₹9,850.75', status: 'Paid', method: 'HDFC Bank •• 4291' },
];

export default function PayoutsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => router.back()}
        >
          <CaretLeft size={24} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Payouts</Text>
        <Pressable style={styles.helpButton}>
          <Question size={24} color={theme.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Next Payout Card */}
        <View style={[styles.summaryCard, { borderColor: theme.border }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Next Payout</Text>
            <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.dateBadgeText, { color: theme.primary, fontFamily: Fonts.inter.semibold }]}>Mar 31, 2026</Text>
            </View>
          </View>

          <Text style={[styles.summaryAmount, { color: theme.text }]}>₹18,240.50</Text>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.bankInfo}>
            <View style={styles.bankLeft}>
              <Text style={[styles.bankLabel, { color: theme.textSecondary }]}>Settling to</Text>
              <Text style={[styles.bankDetails, { color: theme.text }]}>HDFC Bank •• 4291</Text>
            </View>
            <View style={[styles.bankStatus, { backgroundColor: theme.success + '15' }]}>
              <CheckCircle size={14} color={theme.success} weight="fill" />
              <Text style={[styles.bankStatusText, { color: theme.success }]}>Verified</Text>
            </View>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Payout History</Text>
          <Pressable>
            <Text style={[styles.viewMore, { color: theme.primary }]}>View All</Text>
          </Pressable>
        </View>

        {MOCK_PAYOUTS.map((payout, index) => (
          <Pressable
            key={payout.id}
            style={[
              styles.payoutItem,
              { borderBottomColor: index === MOCK_PAYOUTS.length - 1 ? 'transparent' : theme.border }
            ]}
          >
            <View style={styles.payoutLeft}>
              <View style={[styles.payoutIcon, { backgroundColor: theme.success + '10' }]}>
                <ArrowUpRight size={20} color={theme.success} weight="bold" />
              </View>
              <View>
                <Text style={[styles.payoutDate, { color: theme.text }]}>{payout.date}</Text>
                <Text style={[styles.payoutMethod, { color: theme.textSecondary }]}>{payout.method}</Text>
              </View>
            </View>
            <View style={styles.payoutRight}>
              <Text style={[styles.payoutAmount, { color: theme.text }]}>{payout.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: theme.success + '10' }]}>
                <Text style={[styles.statusText, { color: theme.success }]}>Paid</Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={[styles.supportCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={[styles.supportIcon, { backgroundColor: theme.primary + '15' }]}>
            <Info size={24} color={theme.primary} weight="duotone" />
          </View>
          <View style={styles.supportContent}>
            <Text style={[styles.supportTitle, { color: theme.text }]}>Need help with payouts?</Text>
            <Text style={[styles.supportDesc, { color: theme.textSecondary }]}>
              Reach out to our support team for any billing or settlement queries.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.H2,
    fontFamily: Fonts.poppins.semibold,
  },
  helpButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.medium,
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadgeText: {
    fontSize: 12,
  },
  summaryAmount: {
    fontSize: 36,
    fontFamily: Fonts.poppins.bold,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  bankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bankLeft: {
    flex: 1,
  },
  bankLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bankDetails: {
    ...Typography.H3,
    fontFamily: Fonts.inter.semibold,
  },
  bankStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  bankStatusText: {
    fontSize: 11,
    fontFamily: Fonts.inter.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    ...Typography.H2,
  },
  viewMore: {
    ...Typography.BodyRegular,
    fontFamily: Fonts.inter.semibold,
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  payoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutDate: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.semibold,
    marginBottom: 2,
  },
  payoutMethod: {
    fontSize: 12,
  },
  payoutRight: {
    alignItems: 'flex-end',
  },
  payoutAmount: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.poppins.semibold,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.inter.bold,
    textTransform: 'uppercase',
  },
  supportCard: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    ...Typography.H3,
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
