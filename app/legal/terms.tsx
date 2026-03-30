import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function TermsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const Section = ({ title, content }: { title: string; content: string }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: theme.textSecondary }]}>{content}</Text>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms of Service</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: March 20, 2026</Text>
        
        <Section 
          title="1. Acceptance of Terms" 
          content="By accessing or using the Fudode Vendor application, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application." 
        />
        
        <Section 
          title="2. Vendor Obligations" 
          content="Vendors are responsible for maintaining accurate menu information, pricing, and availability. All food safety regulations must be strictly followed as per local laws." 
        />

        <Section 
          title="3. Payments & Settlements" 
          content="Payouts are processed weekly. Fudode reserves the right to withhold payments in case of disputes or fraudulent activity until resolution." 
        />

        <Section 
          title="4. Data Usage" 
          content="We collect order and performance data to improve our services. We do not sell your personal data to third parties. Please refer to our Privacy Policy for more details." 
        />

        <Section 
          title="5. Termination" 
          content="Fudode reserves the right to suspend or terminate vendor accounts that violate our community guidelines or safety protocols." 
        />

        <View style={{ height: 60 }} />
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  lastUpdated: {
    ...Typography.Caption,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.H3,
    fontFamily: Fonts.poppins.semibold,
    marginBottom: 12,
  },
  sectionContent: {
    ...Typography.BodyRegular,
    lineHeight: 22,
  },
});
