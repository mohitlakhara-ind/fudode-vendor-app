import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  ArrowsClockwise,
  CalendarBlank,
  CaretDown,
  CaretRight,
  FileArrowDown,
  FileText,
  Question,
  Receipt,
  SpeakerHigh,
} from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TabButton = ({ label, active, onPress }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabBtn,
        { backgroundColor: active ? theme.surface : 'transparent' },
        active && styles.activeTabShadow,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          { color: active ? theme.text : theme.textSecondary, fontWeight: active ? '700' : '500' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const FinanceHeader = ({ restaurantName, id, location }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={styles.financeHeader}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.nameRow}>
            <Text style={[styles.restaurantName, { color: theme.text }]}>{restaurantName}</Text>
            <CaretDown size={20} color={theme.text} weight="bold" />
          </View>
          <Text style={[styles.restaurantMeta, { color: theme.textSecondary }]}>
            ID: {id} • {location}
          </Text>
        </View>
        <Pressable style={styles.helpIcon}>
          <Question size={24} color={theme.text} weight="bold" />
        </Pressable>
      </View>
    </View>
  );
};

const PayoutCard = ({ amount, dateRange, orders }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={[styles.payoutCard, { backgroundColor: theme.surfaceSecondary + '50' }]}>
      <Text style={[styles.payoutLabel, { color: theme.textSecondary }]}>
        Est. payout ({dateRange})
      </Text>
      <Text style={[styles.payoutAmount, { color: theme.text }]}>₹{amount}</Text>
      <Text style={[styles.orderCount, { color: theme.textSecondary }]}>{orders} orders</Text>

      <View style={[styles.payoutDivider, { borderTopColor: theme.border + '15' }]} />

      <View style={styles.payoutStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Payout for</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{dateRange}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Payout date</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>-</Text>
        </View>
      </View>

      <Pressable style={styles.viewDetailsBtn}>
        <Text style={[styles.viewDetailsText, { color: theme.primary }]}>View details</Text>
        <ArrowRight size={16} color={theme.primary} weight="bold" />
      </Pressable>
    </View>
  );
};

const InvoiceCard = ({ title, subtitle, icon: Icon, colors }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <Pressable style={styles.invoiceCard}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
      >
        <Icon size={32} color="#FFF" weight="light" />
      </LinearGradient>
      <View style={styles.invoiceContent}>
        <Text style={[styles.invoiceTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.invoiceSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
      <CaretRight size={20} color={theme.textSecondary} weight="bold" />
    </Pressable>
  );
};

export default function EarningsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('payouts');

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <FinanceHeader
        restaurantName="Muggs Cafe"
        id="20202954"
        location="Balotra Locality, Balotra"
      />

      <View style={[styles.tabsContainer, { backgroundColor: theme.surfaceSecondary + '50' }]}>
        <TabButton
          label="Payouts"
          active={activeTab === 'payouts'}
          onPress={() => setActiveTab('payouts')}
        />
        <TabButton
          label="Invoices & Taxes"
          active={activeTab === 'invoices'}
          onPress={() => setActiveTab('invoices')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'payouts' ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Current cycle</Text>
            <PayoutCard amount="0.00" dateRange="16 - 22 Mar" orders={0} />

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Past cycles</Text>
            <View style={styles.pastCyclesRow}>
              <Pressable style={[styles.datePicker, { backgroundColor: theme.surface, borderColor: theme.border + '30' }]}>
                <CalendarBlank size={20} color={theme.textSecondary} />
                <Text style={[styles.datePickerText, { color: theme.text }]}>15 Feb - 15 Mar'26</Text>
                <CaretDown size={14} color={theme.textSecondary} />
              </Pressable>
              <Pressable style={[styles.reportBtn, { backgroundColor: theme.surface, borderColor: theme.border + '30' }]}>
                <FileArrowDown size={20} color={theme.text} />
                <Text style={[styles.reportBtnText, { color: theme.text }]}>Get report</Text>
              </Pressable>
            </View>

            <View style={[styles.emptyState, { backgroundColor: theme.surfaceSecondary + '40' }]}>
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                No past payouts are available for the selected date range
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Download invoices</Text>
            <InvoiceCard
              title="Online ordering"
              subtitle="Monthly commission invoices on an outlet level"
              icon={Receipt}
              colors={['#434343', '#000000']}
            />
            <InvoiceCard
              title="Ads invoice"
              subtitle="Monthly Ads invoices on a Legal entity level"
              icon={SpeakerHigh}
              colors={['#004e92', '#000428']}
            />
            <InvoiceCard
              title="Recovery"
              subtitle="Monthly recovery invoices on an outlet level"
              icon={ArrowsClockwise}
              colors={['#134E5E', '#71B280']}
            />

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Download tax receipts</Text>
            <InvoiceCard
              title="TDS"
              subtitle="Tax deducted at source for products & services"
              icon={FileText}
              colors={['#3a6186', '#89253e']}
            />
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  financeHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restaurantName: {
    ...Typography.H1,
  },
  restaurantMeta: {
    ...Typography.Caption,
    marginTop: 2,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 24,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15, // Keep specific tab size
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...Typography.H2,
    marginBottom: 16,
  },
  payoutCard: {
    padding: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  payoutLabel: {
    ...Typography.Caption,
    marginBottom: 8,
  },
  payoutAmount: {
    ...Typography.Display,
    marginBottom: 4,
  },
  orderCount: {
    ...Typography.BodyRegular,
  },
  payoutDivider: {
    borderTopWidth: 1,
    marginVertical: 20,
  },
  payoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    ...Typography.Caption,
  },
  statValue: {
    ...Typography.H3,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewDetailsText: {
    ...Typography.H3,
  },
  pastCyclesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  datePickerText: {
    flex: 1,
    ...Typography.H3,
    fontSize: 14,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  reportBtnText: {
    ...Typography.H3,
    fontSize: 14,
  },
  emptyState: {
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    ...Typography.Caption,
    textAlign: 'center',
  },
  invoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  gradientBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceContent: {
    flex: 1,
    gap: 4,
  },
  invoiceTitle: {
    ...Typography.H2,
  },
  invoiceSubtitle: {
    ...Typography.Caption,
    lineHeight: 18,
  },
});
