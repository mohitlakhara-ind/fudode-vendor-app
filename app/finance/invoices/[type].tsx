import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, FileArrowDown, CaretDown } from 'phosphor-react-native';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InvoicesScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [selectedYear, setSelectedYear] = useState('2023');

  const getTitle = () => {
    switch (type) {
      case 'online_ordering': return 'Online ordering invoices';
      case 'ads': return 'Ads invoices';
      case 'recovery': return 'Recovery invoices';
      case 'tds': return 'TDS tax receipts';
      default: return 'Invoices';
    }
  };

  const invoices = [
    { id: '1', month: 'January, 2023', invoiceId: 'Z23-RJOO-097763' },
    { id: '2', month: 'February, 2023', invoiceId: 'Z23-RJOO-102541' },
    { id: '3', month: 'March, 2023', invoiceId: 'Z23-RJOO-128744' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} weight="bold" />
        </Pressable>
        <View style={styles.headerTitleRow}>
          <ThemedText style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.rounded }]}>Muggs Cafe</ThemedText>
          <ThemedText style={[styles.restaurantMeta, { color: theme.textSecondary }]}>ID: 20202954 • Balotra Locality, Balotra</ThemedText>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.pageTitle, { color: theme.text }]}>{getTitle()}</ThemedText>

        <View style={styles.yearSelector}>
          <ThemedText style={[styles.yearLabel, { color: theme.textSecondary }]}>Financial year</ThemedText>
          <Pressable style={[styles.yearValueRow, { backgroundColor: theme.surfaceSecondary }]}>
            <ThemedText style={[styles.yearValue, { color: theme.text }]}>{selectedYear}</ThemedText>
            <CaretDown size={14} color={theme.text} weight="bold" />
          </Pressable>
        </View>

        <View style={styles.invoicesList}>
          {invoices.map(invoice => (
            <View key={invoice.id} style={[styles.invoiceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.invoiceInfo}>
                <ThemedText style={[styles.monthText, { color: theme.text }]}>{invoice.month}</ThemedText>
                <ThemedText style={[styles.idText, { color: theme.textSecondary }]}>{invoice.invoiceId}</ThemedText>
              </View>
              <Pressable style={[styles.downloadBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
                <FileArrowDown size={22} color={theme.text} weight="bold" />
              </Pressable>
            </View>
          ))}
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleRow: {
    flex: 1,
  },
  restaurantName: {
    ...Typography.H3,
    fontSize: 18,
    fontWeight: '900',
  },
  restaurantMeta: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.6,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  pageTitle: {
    ...Typography.H1,
    fontSize: 28,
    marginBottom: 32,
    marginTop: 10,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  yearLabel: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '800',
    opacity: 0.6,
  },
  yearValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  yearValue: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
  },
  invoicesList: {
    gap: 16,
  },
  invoiceCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  invoiceInfo: {
    flex: 1,
    gap: 4,
  },
  monthText: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '800',
  },
  idText: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
  },
  downloadBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
