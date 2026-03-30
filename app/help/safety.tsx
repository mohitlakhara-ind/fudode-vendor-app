import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CaretLeft, ShieldCheck, Lock, ShieldWarning, IdentificationBadge } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

const SafetyItem = ({ icon: Icon, title, description }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <View style={[styles.safetyItem, { backgroundColor: theme.surfaceSecondary }]}>
      <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
        <Icon size={24} color={theme.primary} weight="fill" />
      </View>
      <View style={styles.contentBox}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>{description}</Text>
      </View>
    </View>
  );
};

export default function SafetyScreen() {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Safety & Security</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.intro, { color: theme.textSecondary }]}>
          Your security is our priority. Here's how we protect your account and data.
        </Text>

        <SafetyItem 
          icon={Lock}
          title="Two-Factor Authentication"
          description="Protect your account with an extra layer of security. We'll ask for a code whenever you log in from a new device."
        />
        <SafetyItem 
          icon={ShieldWarning}
          title="Login Notifications"
          description="Get notified immediately if someone logs into your account from an unrecognized device or location."
        />
        <SafetyItem 
          icon={IdentificationBadge}
          title="Verification Documents"
          description="Keep your FSSAI and Bank details updated and verified to ensure seamless operations."
        />
        <SafetyItem 
          icon={ShieldCheck}
          title="Secure Payments"
          description="All transactions are encrypted and processed through secure bank gateways."
        />

        <View style={[styles.contactBox, { borderColor: theme.border + '20' }]}>
          <Text style={[styles.contactTitle, { color: theme.text }]}>Need immediate help?</Text>
          <Text style={[styles.contactDesc, { color: theme.textSecondary }]}>
            If you suspect any unauthorized activity on your account, please contact our support team immediately.
          </Text>
          <Pressable style={[styles.contactBtn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.contactBtnText, { color: theme.background }]}>Report Urgently</Text>
          </Pressable>
        </View>
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
  intro: { ...Typography.BodyRegular, marginBottom: 24 },
  safetyItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: { flex: 1 },
  itemTitle: { ...Typography.H3, marginBottom: 4 },
  itemDesc: { ...Typography.Caption, lineHeight: 18 },
  contactBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  contactTitle: { ...Typography.H2, marginBottom: 8 },
  contactDesc: { ...Typography.BodyRegular, textAlign: 'center', marginBottom: 20, opacity: 0.7 },
  contactBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactBtnText: { ...Typography.H3 },
});
