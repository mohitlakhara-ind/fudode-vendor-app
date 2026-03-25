import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Info, ChartBar, CurrencyInr, ShoppingBag, CaretDown, Warning } from 'phosphor-react-native';

interface AdCampaignCardProps {
  status: 'Active' | 'Paused' | 'Completed' | 'Scheduled' | 'Cancelled';
}

export const AdCampaignCard = ({ status }: AdCampaignCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <ThemedText style={[styles.title, { color: theme.text }]}>Visit Pack</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}> (Segmented)</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: theme.border + '30' }]}>
          <ThemedText style={[styles.statusText, { color: theme.textSecondary }]}>{status}</ThemedText>
        </View>
      </View>

      <View style={styles.details}>
        <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>Ad ID: <ThemedText style={{ color: theme.text }}>33375385</ThemedText></ThemedText>
        <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>Outlet ID: <ThemedText style={{ color: theme.text }}>20202954</ThemedText></ThemedText>
        <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>Duration: <ThemedText style={{ color: theme.text }}>15 Jan, 2026 - 15 Jan, 2026</ThemedText></ThemedText>
        <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>Budget: <ThemedText style={{ color: theme.text }}>₹1,000 per week</ThemedText></ThemedText>
      </View>

      <View style={styles.metrics}>
        <View style={[styles.metricRow, { borderTopColor: theme.border + '15' }]}>
          <View style={styles.metricLeft}>
            <View style={[styles.metricIcon, { backgroundColor: '#EBF3FF' }]}>
              <CurrencyInr size={18} color="#1A73E8" weight="bold" />
            </View>
            <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>ROI</ThemedText>
          </View>
          <ThemedText style={[styles.metricValue, { color: theme.textSecondary }]}>--</ThemedText>
        </View>

        <View style={[styles.metricRow, { borderTopColor: theme.border + '15' }]}>
          <View style={styles.metricLeft}>
            <View style={[styles.metricIcon, { backgroundColor: '#F0F4F8' }]}>
              <ShoppingBag size={18} color="#4A5568" weight="bold" />
            </View>
            <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>Ad spend</ThemedText>
          </View>
          <ThemedText style={[styles.metricValue, { color: theme.textSecondary }]}>--</ThemedText>
        </View>

        <View style={[styles.metricRow, { borderTopColor: theme.border + '15' }]}>
          <View style={styles.metricLeft}>
            <View style={[styles.metricIcon, { backgroundColor: '#EEF2FF' }]}>
              <ChartBar size={18} color="#4F46E5" weight="bold" />
            </View>
            <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>Ad sales</ThemedText>
          </View>
          <ThemedText style={[styles.metricValue, { color: theme.textSecondary }]}>--</ThemedText>
        </View>
      </View>

      <View style={styles.seeMore}>
        <ThemedText style={[styles.seeMoreText, { color: theme.textSecondary }]}>See more</ThemedText>
        <CaretDown size={16} color={theme.textSecondary} />
      </View>

      {status === 'Cancelled' && (
        <View style={[styles.warningBox, { backgroundColor: '#FAFAFA', borderColor: theme.border + '20' }]}>
          <View style={styles.warningHeader}>
            <View style={[styles.warningIconWrapper, { backgroundColor: '#B0B0B0' }]}>
              <Warning size={14} color="#FFF" weight="fill" />
            </View>
            <ThemedText style={[styles.warningTitle, { color: theme.textSecondary }]}>Payment not completed in time</ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border + '20' }]} />
          <ThemedText style={[styles.warningDesc, { color: theme.textSecondary }]}>
            Your ad got cancelled as the payment of 1,000 INR wasn't completed by 6:01 pm, 16 Jan 2026
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  details: {
    marginBottom: 20,
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  metrics: {
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 24,
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginBottom: 16,
  },
  seeMoreText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  warningBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  warningIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  warningDesc: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
});
