import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
import { DateRangePickerSheet } from '@/components/common/DateRangePickerSheet';
import { ReportFormatSheet } from '@/components/common/ReportFormatSheet';
import { FilterSheet } from '@/components/common/FilterSheet';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { StatusColors } from '@/constants/theme';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { width } = Dimensions.get('window');

const OWNED_RESTAURANTS = [
  { id: '1', name: 'Muggs Cafe', locality: 'Balotra Locality' },
  { id: '2', name: 'Pizza Palace', locality: 'HSR Layout, Bangalore' },
];

const PayoutCard = ({ amount, dateRange, orders }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
 
  return (
    <View style={[styles.payoutCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.payoutHeader}>
        <ThemedText style={[styles.payoutLabel, { color: theme.textSecondary }]}>Estimated payout</ThemedText>
        <View style={[styles.dateBadge, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
          <ThemedText style={[styles.dateBadgeText, { color: theme.text }]}>{dateRange}</ThemedText>
        </View>
      </View>
      
      <View style={styles.amountSection}>
        <ThemedText style={[styles.payoutCurrency, { color: theme.primary, fontWeight: '900' }]}>₹</ThemedText>
        <ThemedText style={[styles.payoutAmount, { color: theme.text, fontFamily: Fonts.rounded }]}>{amount}</ThemedText>
      </View>
      
      <View style={[styles.payoutFooter, { borderTopColor: theme.border }]}>
        <View style={styles.payoutDetail}>
          <ThemedText style={[styles.detailValue, { color: theme.text }]}>{orders}</ThemedText>
          <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Orders</ThemedText>
        </View>
        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />
        <Pressable style={styles.viewDetailsRow}>
          <ThemedText style={[styles.viewDetailsText, { color: theme.primary }]}>Analysis</ThemedText>
          <ArrowRight size={14} color={theme.primary} weight="bold" />
        </Pressable>
      </View>
    </View>
  );
};

const InvoiceCard = ({ title, subtitle, icon: Icon, onPress }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.invoiceCard, 
        { 
          backgroundColor: theme.surface, 
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
        <Icon size={24} color={theme.text} weight="bold" />
      </View>
      <View style={styles.invoiceContent}>
        <ThemedText style={[styles.invoiceTitle, { color: theme.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.invoiceSubtitle, { color: theme.textSecondary }]}>{subtitle}</ThemedText>
      </View>
      <View style={[styles.caretCircleSmall, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
        <CaretRight size={12} color={theme.text} weight="bold" />
      </View>
    </Pressable>
  );
};

export default function EarningsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Payouts');
  const [isOnline, setIsOnline] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(OWNED_RESTAURANTS[0]);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const { queue } = useSelector((state: RootState) => state.order);
  
  // Bottom Sheet States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReportFormat, setShowReportFormat] = useState(false);
  const [selectedRange, setSelectedRange] = useState('week');

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
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

      <TabSwitcher
        tabs={['Payouts', 'Invoices & Taxes']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        containerStyle={{ marginHorizontal: 20, marginTop: 20, marginBottom: 24 }}
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'Payouts' ? (
          <>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Current cycle</ThemedText>
            <PayoutCard amount="0.00" dateRange="16 - 22 Mar" orders={0} />

            <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Past cycles</ThemedText>
            <View style={styles.pastCyclesRow}>
              <Pressable 
                style={[styles.datePicker, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <CalendarBlank size={20} color={theme.textSecondary} />
                <ThemedText style={[styles.datePickerText, { color: theme.text }]}>
                  {selectedRange === 'week' ? "16 Feb - 15 Mar'26" : selectedRange}
                </ThemedText>
                <CaretDown size={14} color={theme.textSecondary} />
              </Pressable>
              <Pressable 
                style={[styles.reportBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setShowReportFormat(true)}
              >
                <FileArrowDown size={20} color={theme.text} />
                <ThemedText style={[styles.reportBtnText, { color: theme.text }]}>Get report</ThemedText>
              </Pressable>
            </View>

            <View style={[styles.emptyState, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <ThemedText style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                No past payouts are available for the selected date range
              </ThemedText>
            </View>
          </>
        ) : (
          <>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Download invoices</ThemedText>
            <InvoiceCard
              title="Online ordering"
              subtitle="Monthly commission invoices on an outlet level"
              icon={Receipt}
              onPress={() => router.push('/finance/invoices/online_ordering')}
            />
            <InvoiceCard
              title="Ads invoice"
              subtitle="Monthly Ads invoices on a Legal entity level"
              icon={SpeakerHigh}
              onPress={() => router.push('/finance/invoices/ads')}
            />
            <InvoiceCard
              title="Recovery"
              subtitle="Monthly recovery invoices on an outlet level"
              icon={ArrowsClockwise}
              onPress={() => router.push('/finance/invoices/recovery')}
            />
 
            <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Download tax receipts</ThemedText>
            <InvoiceCard
              title="TDS"
              subtitle="Tax deducted at source for products & services"
              icon={FileText}
              onPress={() => router.push('/finance/invoices/tds')}
            />
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <DateRangePickerSheet
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedRange={selectedRange}
        onApply={(range) => {
          setSelectedRange(range);
          setShowDatePicker(false);
        }}
      />

      <ReportFormatSheet
        visible={showReportFormat}
        onClose={() => setShowReportFormat(false)}
        onSelect={(format) => {
          console.log('Selected format:', format);
          setShowReportFormat(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  financeHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 6,
    borderRadius: 24,
    marginBottom: 24,
    marginTop: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabShadow: {
  },
  tabText: {
    ...Typography.H3,
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...Typography.H2,
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
    fontWeight: '900',
  },
  payoutCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  payoutLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  dateBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  dateBadgeText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '800',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 6,
  },
  payoutCurrency: {
    ...Typography.H1,
    fontSize: 28,
  },
  payoutAmount: {
    ...Typography.Display,
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '900',
  },
  payoutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: 1.5,
  },
  payoutDetail: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  detailValue: {
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '900',
  },
  detailLabel: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1.5,
    height: 24,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewDetailsText: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '800',
  },
  pastCyclesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
  },
  datePickerText: {
    flex: 1,
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
  },
  reportBtnText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    height: 120,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyStateText: {
    ...Typography.Caption,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  invoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1.5,
    gap: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceContent: {
    flex: 1,
    gap: 4,
  },
  invoiceTitle: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '800',
  },
  invoiceSubtitle: {
    ...Typography.Caption,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  caretCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
