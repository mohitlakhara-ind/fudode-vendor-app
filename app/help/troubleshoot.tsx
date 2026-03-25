import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight, CheckCircle, WarningCircle } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

interface TroubleshootItemProps {
  label: string;
  status: 'success' | 'warning' | 'info';
  onPress?: () => void;
  showArrow?: boolean;
}

const TroubleshootItem = ({ label, status, onPress, showArrow }: TroubleshootItemProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.item, 
        { borderBottomColor: theme.border + '15', opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={styles.itemLeft}>
        {status === 'success' ? (
          <CheckCircle size={22} color="#22C55E" weight="fill" />
        ) : status === 'warning' ? (
          <WarningCircle size={22} color="#EF4444" weight="fill" />
        ) : (
          <View style={{ width: 22 }} />
        )}
        <ThemedText style={[styles.itemLabel, { color: theme.text }]}>{label}</ThemedText>
      </View>
      {(showArrow || status === 'warning') && (
        <CaretRight size={18} color="#3B82F6" weight="bold" />
      )}
    </Pressable>
  );
};

export default function TroubleshootScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Troubleshoot</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Notifications</ThemedText>
          <TroubleshootItem label="Notifications enabled" status="success" />
          <TroubleshootItem label="Google play services are installed" status="success" />
          <TroubleshootItem label="Order notifications enabled" status="success" />
          <TroubleshootItem label="Ring in silent mode is disabled" status="warning" />
          <TroubleshootItem label="Order notifications should be audible" status="success" />
          <TroubleshootItem label="Send a test notification to ensure you receive order alerts" status="info" showArrow={true} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>System</ThemedText>
          <TroubleshootItem label="Background data is not restricted" status="success" />
          <TroubleshootItem label="Background restrictions are disabled" status="success" />
          <TroubleshootItem label="Overlay permission" status="warning" />
          <TroubleshootItem label="Something isn't working? try restarting the app" status="info" showArrow={true} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>IVR calls</ThemedText>
          <TroubleshootItem label="Verify order reminder phone numbers" status="info" showArrow={true} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Optional settings</ThemedText>
          <TroubleshootItem label="Enable floating order status to keep the app always alive" status="warning" showArrow={true} />
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
    gap: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#E0E0E0',
  },
  divider: {
    height: 8,
    backgroundColor: '#1E1E1E',
    marginTop: 10,
  },
});
