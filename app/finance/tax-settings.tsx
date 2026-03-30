import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CaretLeft, FileText, IdentificationCard, Info, MapPin } from 'phosphor-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TaxSettingsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const businessInfo = {
    registeredName: 'THE GOURMET KITCHEN PRIVATE LIMITED',
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    registeredAddress: '123, 4th Cross, Indiranagar 2nd Stage, Bangalore, Karnataka - 560038',
    entityType: 'Private Limited Company',
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tax Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>REGISTERED BUSINESS INFO</Text>

        <View style={[styles.infoGroup, { borderColor: theme.border }]}>
          <View style={styles.infoItem}>
            <View style={styles.infoLabelContainer}>
              <IdentificationCard size={18} color={theme.textSecondary} weight="duotone" />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>LEGAL BUSINESS NAME</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.text }]}>{businessInfo.registeredName}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoItem}>
            <View style={styles.infoLabelContainer}>
              <FileText size={18} color={theme.textSecondary} weight="duotone" />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>TAX INFORMATION</Text>
            </View>
            <View style={styles.taxRow}>
              <View style={styles.taxItem}>
                <Text style={[styles.taxLabel, { color: theme.textSecondary }]}>GSTIN</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{businessInfo.gstNumber}</Text>
              </View>
              <View style={styles.taxItem}>
                <Text style={[styles.taxLabel, { color: theme.textSecondary }]}>PAN</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{businessInfo.panNumber}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoItem}>
            <View style={styles.infoLabelContainer}>
              <MapPin size={18} color={theme.textSecondary} weight="duotone" />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>REGISTERED ADDRESS</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.text, lineHeight: 22 }]}>{businessInfo.registeredAddress}</Text>
          </View>
        </View>

        <View style={[styles.supportCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.supportHeader}>
            <Text style={[styles.supportTitle, { color: theme.text }]}>Need to update details?</Text>
          </View>
          <View style={styles.supportContent}>
            <Text style={[styles.supportDesc, { color: theme.textSecondary }]}>
              For any changes to your GST, PAN, or registered address, please contact our administrative team via the
              <Text style={{ color: theme.primary, fontFamily: Fonts.inter.semibold }}> Help Center. </Text>
              Identity verification is required for these updates.
            </Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Info size={16} color={theme.textSecondary} />
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            Tax information is strictly used for compliance and invoicing purposes as per local regulations.
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
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: Fonts.inter.bold,
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoGroup: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
  },
  infoItem: {
    gap: 12,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: Fonts.inter.semibold,
    letterSpacing: 0.8,
  },
  infoValue: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.semibold,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 20,
  },
  taxRow: {
    flexDirection: 'row',
    gap: 32,
  },
  taxItem: {
    gap: 4,
  },
  taxLabel: {
    fontSize: 10,
    fontFamily: Fonts.inter.medium,
  },
  supportCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  supportHeader: {
    marginBottom: 8,
  },
  supportTitle: {
    ...Typography.H3,
    fontFamily: Fonts.poppins.semibold,
  },
  supportContent: {
    gap: 8,
  },
  supportDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  noteBox: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
  },
  noteText: {
    fontSize: 12,
    fontFamily: Fonts.inter.regular,
    flex: 1,
    lineHeight: 18,
  },
});
