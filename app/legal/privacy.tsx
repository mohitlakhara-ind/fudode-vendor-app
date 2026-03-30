import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function PrivacyScreen() {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: March 20, 2026</Text>
        
        <Section 
          title="1. Information We Collect" 
          content="We collect information you provide directly, such as your restaurant name, contact details, and bank information. We also collect automated data like device IP and usage logs." 
        />
        
        <Section 
          title="2. How We Use Your Data" 
          content="Your data is primarily used to facilitate order processing, settlements, and to send important operational updates. We also analyze aggregated data for platform improvement." 
        />

        <Section 
          title="3. Data Sharing" 
          content="We share your data with payment processors and courier partners for business operations. We do not sell your data to marketing third parties." 
        />

        <Section 
          title="4. Data Security" 
          content="We implement industry-standard security measures including encryption and secure server infrastructure to protect your sensitive information." 
        />

        <Section 
          title="5. Your Choices" 
          content="You can update your account information from the settings page. For account deletion requests, please contact support or use the delete account option in the app." 
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
