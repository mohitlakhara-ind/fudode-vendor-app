import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { DotsThreeVertical } from 'phosphor-react-native';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  onPressOptions?: () => void;
  children: React.ReactNode;
}

export const DashboardCard = ({ title, subtitle, onPressOptions, children }: DashboardCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerTitleRow}>
            <View>
                <ThemedText style={styles.title}>{title}</ThemedText>
                {subtitle && <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</ThemedText>}
            </View>
            <TouchableOpacity onPress={onPressOptions} style={styles.optionsButton}>
                <DotsThreeVertical size={24} color={theme.icon} />
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1.5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.H3,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.Caption,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.5,
  },
  optionsButton: {
    padding: 4,
    marginTop: -4,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
});
