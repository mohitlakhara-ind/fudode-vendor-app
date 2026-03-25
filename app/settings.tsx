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
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';

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
    <View style={styles.rowWrapper}>
      <View style={styles.rowMain}>
        <View style={styles.rowLeft}>
          <View
            style={[styles.iconContainer, { backgroundColor: theme.surfaceSecondary + '30' }]}
          >
            <Icon size={22} color={theme.text} weight="regular" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
            )}
          </View>
        </View>
        {hasSwitch && (
          <PremiumSwitch
            value={value}
            onValueChange={onValueChange}
            activeColor={theme.success} // Changed to theme.success
          />
        )}
      </View>
    </View>
  );
};

const LinkRow = ({ label, showArrow = true, onPress }: { label: string; showArrow?: boolean; onPress?: () => void }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable style={styles.linkRow} onPress={onPress}>
      <Text style={[styles.linkLabel, { color: theme.info }]}>{label}</Text> {/* Changed to theme.info */}
      {showArrow && <CaretRight size={16} color={theme.info} weight="bold" />} {/* Changed to theme.info */}
    </Pressable>
  );
};

// New component based on the provided snippet, assuming it's a specific link action
const TroubleshootingLink = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable style={styles.linkAction}>
      <Text style={[styles.linkText, { color: theme.info }]}>Troubleshoot printing issues</Text>
      <ArrowRight size={16} color={theme.info} weight="bold" />
    </Pressable>
  );
};


export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [autoKot, setAutoKot] = useState(false);
  const [liveOrderCount, setLiveOrderCount] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* KOT Settings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>KOT settings</Text>
        </View>
        <View style={[styles.section, { backgroundColor: theme.surface + '50' }]}>
          <SettingRow
            icon={Printer}
            title="Automatic KOT printing"
            subtitle="Choose whether you want KOTs to be printed automatically when you accept new orders"
            value={autoKot}
            onValueChange={setAutoKot}
          />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Overlay Settings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Overlay settings</Text>
        </View>
        <View style={[styles.section, { backgroundColor: theme.surface + '50' }]}>
          <SettingRow
            icon={Queue}
            title="Floating live order count"
            subtitle="Display a floating counter on your home screen to track orders in real-time"
            value={liveOrderCount}
            onValueChange={setLiveOrderCount}
          />
        </View>

        <View style={{ height: SECTION_SPACING }} />

        {/* Links */}
        <View style={styles.linksContainer}>
          <LinkRow label="Check system notification settings" />
          <View style={{ height: 20 }} />
          <LinkRow label="Still having problems? Open troubleshooting guide" />
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
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rowWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 14,
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
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    ...Typography.Caption,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  linksContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLabel: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  linkAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  linkText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '600',
  },
});
