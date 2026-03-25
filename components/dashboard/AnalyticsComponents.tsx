import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { CaretRight, TrendUp, TrendDown } from 'phosphor-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MetricComparisonCardProps {
  label: string;
  current: string | number;
  previous?: string | number;
  growth: number;
  prefix?: string;
  suffix?: string;
}

export const MetricComparisonCard = ({ label, current, growth, prefix = '', suffix = '' }: MetricComparisonCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isPositive = growth >= 0;

  return (
    <View style={styles.metricCard}>
      <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
      <View style={styles.metricValueRow}>
        <ThemedText style={styles.metricValue}>{prefix}{current}{suffix}</ThemedText>
        <View style={[
          styles.growthBadge, 
          { backgroundColor: isPositive ? StatusColors.Ready + '15' : StatusColors.Late + '15' }
        ]}>
          {isPositive ? <TrendUp size={12} color={StatusColors.Ready} weight="bold" /> : <TrendDown size={12} color={StatusColors.Late} weight="bold" />}
          <ThemedText style={[
            styles.growthText, 
            { color: isPositive ? StatusColors.Ready : StatusColors.Late }
          ]}>
            {Math.abs(growth)}%
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

interface FunnelStepProps {
  label: string;
  value: number;
  total: number;
  percentage: number;
  isLast?: boolean;
}

export const FunnelStep = ({ label, value, total, percentage, isLast }: FunnelStepProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.funnelStepContainer}>
      <View style={styles.funnelStepInfo}>
        <ThemedText style={styles.funnelStepLabel}>{label}</ThemedText>
        <ThemedText style={styles.funnelStepValue}>{value.toLocaleString()}</ThemedText>
      </View>
      <View style={[styles.funnelTrack, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={[styles.funnelBar, { width: `${(value / total) * 100}%`, backgroundColor: theme.primary }]} />
        <ThemedText style={[styles.funnelPercentage, { color: theme.textSecondary }]}>
          {percentage}% {isLast ? 'conversion' : 'drop-off'}
        </ThemedText>
      </View>
      {!isLast && <View style={[styles.funnelConnector, { backgroundColor: theme.border }]} />}
    </View>
  );
};

interface ListMetricItemProps {
  label: string;
  value: string | number;
  subValue?: string;
  onPress?: () => void;
}

export const ListMetricItem = ({ label, value, subValue, onPress }: ListMetricItemProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.listItem, { borderBottomColor: theme.border }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.listItemLeft}>
        <ThemedText style={styles.listItemLabel}>{label}</ThemedText>
        {subValue && <ThemedText style={[styles.listItemSubValue, { color: theme.textSecondary }]}>{subValue}</ThemedText>}
      </View>
      <View style={styles.listItemRight}>
        <ThemedText style={styles.listItemValue}>{value}</ThemedText>
        {onPress && <CaretRight size={16} color={theme.icon} />}
      </View>
    </TouchableOpacity>
  );
};

interface SummaryCardProps {
  title: string;
  value: string | number;
  growth?: number;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const SummaryCard = ({ title, value, growth, icon, onPress }: SummaryCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <TouchableOpacity 
      style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.summaryHeader}>
        <ThemedText style={[styles.summaryTitle, { color: theme.textSecondary }]}>{title}</ThemedText>
        {icon}
      </View>
      <View style={styles.summaryValueRow}>
        <ThemedText style={styles.summaryValue}>{value}</ThemedText>
        {growth !== undefined && (
          <View style={[
            styles.summaryGrowthBadge, 
            { backgroundColor: isPositive ? StatusColors.Ready + '15' : StatusColors.Late + '15' }
          ]}>
            <ThemedText style={[
              styles.summaryGrowthText, 
              { color: isPositive ? StatusColors.Ready : StatusColors.Late }
            ]}>
              {growth >= 0 ? '+' : ''}{growth}%
            </ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface StatusIndicatorProps {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export const StatusIndicator = ({ label, count, percentage, color }: StatusIndicatorProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.statusRow}>
      <View style={styles.statusLabelGroup}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <ThemedText style={styles.statusLabel}>{label}</ThemedText>
      </View>
      <View style={styles.statusValueGroup}>
        <ThemedText style={styles.statusCount}>{count}</ThemedText>
        <ThemedText style={[styles.statusPercentage, { color: theme.textSecondary }]}>({percentage}%)</ThemedText>
      </View>
    </View>
  );
};

export const MetricGrid = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.gridContainer}>
    {children}
  </View>
);

interface HorizontalBarProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
}

export const HorizontalBar = ({ label, value, max, suffix = '', color }: HorizontalBarProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.hBarContainer}>
      <View style={styles.hBarHeader}>
        <ThemedText style={styles.hBarLabel}>{label}</ThemedText>
        <ThemedText style={styles.hBarValue}>{value}{suffix}</ThemedText>
      </View>
      <View style={[styles.hBarTrack, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={[styles.hBarFill, { width: `${(value / max) * 100}%`, backgroundColor: color || theme.primary }]} />
      </View>
    </View>
  );
};

interface TimeGridItemProps {
  label: string;
  value: number;
  max: number;
  isPeak?: boolean;
}

export const TimeGridItem = ({ label, value, max, isPeak }: TimeGridItemProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const height = (value / max) * 40;

  return (
    <View style={styles.timeGridItem}>
      <View style={styles.timeBarContainer}>
        <View style={[
          styles.timeBar, 
          { 
            height: Math.max(height, 4), 
            backgroundColor: isPeak ? theme.primary : theme.border,
            opacity: isPeak ? 1 : 0.5
          }
        ]} />
      </View>
      <ThemedText style={[styles.timeLabel, { color: isPeak ? theme.primary : theme.textSecondary }]}>{label}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    marginBottom: 20,
  },
  metricLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  metricValue: {
    ...Typography.Display,
    fontSize: 32,
    fontWeight: '800',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  growthText: {
    ...Typography.Caption,
    fontWeight: '800',
    fontSize: 12,
  },
  funnelStepContainer: {
    marginBottom: 16,
  },
  funnelStepInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  funnelStepLabel: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  funnelStepValue: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '800',
  },
  funnelTrack: {
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  funnelBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 8,
  },
  funnelPercentage: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '800',
    paddingLeft: 12,
    zIndex: 1,
  },
  funnelConnector: {
    width: 2,
    height: 12,
    alignSelf: 'center',
    marginVertical: 4,
    opacity: 0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemLabel: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  listItemSubValue: {
    ...Typography.Caption,
    fontSize: 12,
    marginTop: 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listItemValue: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
  summaryCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  summaryValue: {
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '800',
  },
  summaryGrowthBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  summaryGrowthText: {
    ...Typography.Caption,
    fontSize: 10,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    ...Typography.BodyRegular,
    fontSize: 14,
    fontWeight: '600',
  },
  statusValueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statusCount: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '800',
  },
  statusPercentage: {
    ...Typography.Caption,
    fontSize: 12,
  },
  hBarContainer: {
    marginBottom: 16,
  },
  hBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hBarLabel: {
    ...Typography.BodyRegular,
    fontSize: 14,
    fontWeight: '600',
  },
  hBarValue: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '800',
  },
  hBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeGridItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 64) / 8,
  },
  timeBarContainer: {
    height: 40,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  timeBar: {
    width: 6,
    borderRadius: 3,
  },
  timeLabel: {
    ...Typography.Caption,
    fontSize: 9,
    fontWeight: '700',
  },
});
