import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CaretLeft, FileText, Scales, Handshake, Info } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

const PolicySection = ({ title, date, children }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.sectionDate, { color: theme.textSecondary }]}>Last updated: {date}</Text>
      </View>
      <View style={[styles.sectionContent, { backgroundColor: theme.surfaceSecondary + '30', borderColor: theme.border + '15' }]}>
        <Text style={[styles.sectionBody, { color: theme.text }]}>{children}</Text>
      </View>
      <Pressable style={styles.readMore}>
        <Text style={[styles.readMoreText, { color: theme.primary }]}>Read full document</Text>
      </Pressable>
    </View>
  );
};

export default function PoliciesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms & Policies</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PolicySection title="Terms of Service" date="Mar 15, 2026">
          By using our platform, you agree to abide by our operational standards and service level agreements. This includes maintaining accurate menu items, fulfilling orders on time, and ensuring quality standards.
        </PolicySection>

        <PolicySection title="Privacy Policy" date="Jan 20, 2026">
          We take your data seriously. We only collect necessary information to facilitate order processing, payments, and app functionality. We never share your commercial data with third parties.
        </PolicySection>

        <PolicySection title="Cancellation Policy" date="Feb 10, 2026">
          Order cancellations are subject to review. Excessive cancellations may affect your restaurant's visibility or lead to temporary account suspension to maintain platform reliability.
        </PolicySection>

        <PolicySection title="Payout Policy" date="Dec 05, 2025">
          Payouts are processed daily/weekly depending on your selected cycle. Deductions may include commissions, taxes (TCS/TDS), and packaging charges as per your agreement.
        </PolicySection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { ...Typography.H1 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 32 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { ...Typography.H2, marginBottom: 4 },
  sectionDate: { ...Typography.Caption, fontSize: 12 },
  sectionContent: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionBody: { ...Typography.BodyRegular, lineHeight: 22, opacity: 0.8 },
  readMore: { marginTop: 12, alignSelf: 'flex-start' },
  readMoreText: { ...Typography.H3, fontSize: 14 }
});
