import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  Printer,
  Queue,
  CaretRight,
  ArrowRight,
  SignOut,
  Trash,
  Info
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import { PremiumButton } from '@/components/ui/PremiumButton';

const SECTION_SPACING = 24;

const SettingRow = ({
  icon: Icon,
  title,
  subtitle,
  value,
  onValueChange,
  hasSwitch = true,
}: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.rowCard, { backgroundColor: theme.surfaceSecondary + '10', borderColor: theme.border }]}>
      <View style={styles.rowMain}>
        <View style={styles.rowLeft}>
          <View
            style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}
          >
            <Icon size={22} color={theme.text} weight="bold" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text, fontFamily: Fonts.inter.semibold }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
            )}
          </View>
        </View>
        {hasSwitch && (
          <PremiumSwitch
            value={value}
            onValueChange={onValueChange}
            activeColor={theme.success}
          />
        )}
      </View>
    </View>
  );
};

const LinkRow = ({ label, icon: Icon, showArrow = true, onPress, color, weight }: { label: string; icon?: any; showArrow?: boolean; onPress?: () => void, color?: string, weight?: any }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.linkCard, 
        { 
          backgroundColor: theme.surfaceSecondary + '10', 
          borderColor: theme.border,
          opacity: pressed ? 0.8 : 1
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        {Icon && (
          <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Icon size={20} color={color || theme.info} weight="bold" />
          </View>
        )}
        <Text style={[styles.linkLabel, { color: color || theme.info, fontWeight: weight || '600' }]}>{label}</Text>
      </View>
      {showArrow && <CaretRight size={16} color={color || theme.info} weight="bold" />}
    </Pressable>
  );
};

// New component based on the provided snippet, assuming it's a specific link action
const TroubleshootingLink = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <PremiumButton
      label="Troubleshoot printing issues"
      onPress={() => {}}
      variant="glassy"
      color={theme.info}
      rightIcon={<ArrowRight size={18} color={theme.info} weight="bold" />}
      style={styles.troubleBtn}
    />
  );
};


export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [autoKot, setAutoKot] = useState(false);
  const [liveOrderCount, setLiveOrderCount] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <CaretLeft size={24} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* KOT Settings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.poppins.bold }]}>KOT SETTINGS</Text>
        </View>
        <View style={styles.section}>
          <SettingRow
            icon={Printer}
            title="Automatic KOT printing"
            subtitle="Automatically print KOTs when you accept new orders"
            value={autoKot}
            onValueChange={setAutoKot}
          />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Overlay Settings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.poppins.bold }]}>OVERLAY SETTINGS</Text>
        </View>
        <View style={styles.section}>
          <SettingRow
            icon={Queue}
            title="Floating live order count"
            subtitle="Display a floating counter on your home screen"
            value={liveOrderCount}
            onValueChange={setLiveOrderCount}
          />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Support Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.poppins.bold }]}>SUPPORT & HELP</Text>
        </View>
        <View style={styles.section}>
          <LinkRow label="System notification settings" />
          <View style={{ height: 12 }} />
          <LinkRow label="Troubleshooting guide" />
          
          <View style={{ height: 32 }} />
          <TroubleshootingLink />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Account Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.poppins.bold }]}>ACCOUNT</Text>
        </View>
        <View style={styles.section}>
          <LinkRow 
            label="Delete my account" 
            icon={Trash}
            color={theme.error} 
            onPress={() => setDeleteVisible(true)} 
          />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Legal Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.poppins.bold }]}>LEGAL</Text>
        </View>
        <View style={styles.section}>
          <LinkRow label="About Fudode" icon={Info} onPress={() => router.push('/about')} />
          <View style={{ height: 12 }} />
          <LinkRow label="Terms of Service" onPress={() => router.push('/legal/terms')} />
          <View style={{ height: 12 }} />
          <LinkRow label="Privacy Policy" onPress={() => router.push('/legal/privacy')} />
        </View>

        <View style={{ height: SECTION_SPACING }} />
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>App Version 2.4.0</Text>
        </View>
      </ScrollView>

      <DeleteAccountModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={() => {
          console.log('Account deletion requested');
          setDeleteVisible(false);
        }}
      />
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
    gap: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    opacity: 0.6,
  },
  section: {
    paddingHorizontal: 20,
  },
  rowCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  linkCard: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
  },
  rowSubtitle: {
    ...Typography.Caption,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.6,
  },
  linkLabel: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  troubleBtn: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
  },
  footerText: {
    ...Typography.Caption,
    opacity: 0.5,
  },
});
