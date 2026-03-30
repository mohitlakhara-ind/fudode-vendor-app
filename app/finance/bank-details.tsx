import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Bank, CaretLeft, CheckCircle, Info, PencilSimple } from 'phosphor-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BankDetailsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bankInfo = {
    accountHolder: 'THE GOURMET KITCHEN PVT LTD',
    bankName: 'HDFC BANK',
    accountNumber: '•••• •••• 4291',
    ifsc: 'HDFC0001234',
    accountType: 'Current Account',
    payoutFrequency: 'Every Tuesday',
    status: 'Verified',
  };

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Bank Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Verification Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: theme.success + '10', borderColor: theme.success + '20' }]}>
          <CheckCircle size={20} color={theme.success} weight="fill" />
          <Text style={[styles.statusText, { color: theme.success }]}>Your bank account is verified and active for payouts.</Text>
        </View>

        {/* Bank Card */}
        <View style={[styles.bankCard, { borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.bankIconContainer, { backgroundColor: theme.primary + '15' }]}>
              <Bank size={24} color={theme.primary} weight="duotone" />
            </View>
            <Text style={[styles.bankName, { color: theme.text }]}>{bankInfo.bankName}</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Account Number</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{bankInfo.accountNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Account Holder</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{bankInfo.accountHolder}</Text>
            </View>

            <View style={styles.rowGroup}>
              <View style={[styles.infoRow, { flex: 1 }]}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>IFSC Code</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{bankInfo.ifsc}</Text>
              </View>
              <View style={[styles.infoRow, { flex: 1 }]}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Account Type</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{bankInfo.accountType}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payout Schedule */}
        <View style={[styles.scheduleCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleTitle, { color: theme.text }]}>Payout Schedule</Text>
          </View>
          <View style={styles.scheduleContent}>
            <Text style={[styles.scheduleValue, { color: theme.text }]}>{bankInfo.payoutFrequency}</Text>
            <Text style={[styles.scheduleDesc, { color: theme.textSecondary }]}>
              Payouts are automatically settled into your bank account according to this frequency.
            </Text>
          </View>
        </View>

        {/* Change Request CTA */}
        <Pressable style={[styles.changeButton, { borderColor: theme.border }]}>
          <PencilSimple size={20} color={theme.primary} weight="bold" />
          <Text style={[styles.changeButtonText, { color: theme.text }]}>Change bank details</Text>
        </Pressable>

        <View style={styles.noteBox}>
          <Info size={18} color={theme.textSecondary} />
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            Changes to bank details involve a verification process and may take 2-3 business days to reflect.
          </Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  statusText: {
    ...Typography.Caption,
    flex: 1,
    lineHeight: 18,
  },
  bankCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    ...Typography.H3,
    fontFamily: Fonts.poppins.semibold,
    letterSpacing: 0.5,
  },
  cardContent: {
    gap: 20,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Fonts.inter.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.semibold,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  scheduleCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  scheduleHeader: {
    marginBottom: 12,
  },
  scheduleTitle: {
    ...Typography.H3,
    fontFamily: Fonts.poppins.semibold,
  },
  scheduleContent: {
    gap: 8,
  },
  scheduleValue: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.semibold,
  },
  scheduleDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  changeButtonText: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.semibold,
  },
  noteBox: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  noteText: {
    ...Typography.Caption,
    flex: 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
