import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight, Globe, Heart, LinkedinLogo, TwitterLogo } from 'phosphor-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const appVersion = '2.4.0 (Build 124)';

  const MenuItem = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable
      style={[styles.menuItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
    >
      <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
      <CaretRight size={18} color={theme.textSecondary} weight="bold" />
    </Pressable>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>About</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoSection}>
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={[styles.logoLetter, { color: theme.background }]}>F</Text>
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>Fudode Vendor</Text>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version {appVersion}</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            Fudode is built to empower local restaurant owners and vendors with premium technology to manage orders, grow their business, and reach more customers.
          </Text>
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            label="Terms of Service"
            onPress={() => router.push('/legal/terms')}
          />
          <MenuItem
            label="Privacy Policy"
            onPress={() => router.push('/legal/privacy')}
          />
          <MenuItem
            label="Open Source Licenses"
            onPress={() => { }}
          />
        </View>

        <View style={styles.socialHeader}>
          <Text style={[styles.socialTitle, { color: theme.textSecondary }]}>FOLLOW US</Text>
        </View>

        <View style={styles.socialRow}>
          <Pressable style={[styles.socialIcon, { backgroundColor: theme.surfaceSecondary }]}>
            <Globe size={20} color={theme.text} />
          </Pressable>
          <Pressable style={[styles.socialIcon, { backgroundColor: theme.surfaceSecondary }]}>
            <TwitterLogo size={20} color={theme.text} />
          </Pressable>
          <Pressable style={[styles.socialIcon, { backgroundColor: theme.surfaceSecondary }]}>
            <LinkedinLogo size={20} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Crafted with <Heart size={14} color={theme.secondary} weight="fill" /> by Fudode Team
          </Text>
          <Text style={[styles.copyright, { color: theme.textSecondary }]}>
            © 2026 Fudode Technologies Pvt Ltd.
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
    paddingTop: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoLetter: {
    fontSize: 40,
    fontFamily: Fonts.poppins.bold,
  },
  appName: {
    ...Typography.H1,
    fontFamily: Fonts.poppins.semibold,
    marginBottom: 4,
  },
  versionText: {
    ...Typography.Caption,
    fontFamily: Fonts.inter.medium,
  },
  descriptionCard: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  descriptionText: {
    ...Typography.BodyRegular,
    textAlign: 'center',
    lineHeight: 22,
  },
  menuSection: {
    marginBottom: 48,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  menuLabel: {
    ...Typography.BodyLarge,
    fontFamily: Fonts.inter.medium,
  },
  socialHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  socialTitle: {
    fontSize: 11,
    fontFamily: Fonts.inter.bold,
    letterSpacing: 1.5,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 64,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.inter.medium,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    fontFamily: Fonts.inter.regular,
  },
});
