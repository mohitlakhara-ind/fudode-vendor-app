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
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 18,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.H2,
  },
  subtitle: {
    ...Typography.Caption,
    marginTop: 2,
    fontWeight: '600',
  },
  optionsButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
});
