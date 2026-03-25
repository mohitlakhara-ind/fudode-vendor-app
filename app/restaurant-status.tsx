import {
  OfflineReasonSheet,
  OfflineTimingSheet,
  ReopenTimingSheet,
  RushDurationSheet,
  ScheduleTimingSheet
} from '@/components/status/StatusBottomSheets';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { Separator } from '@/components/ui/Separator';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  CaretRight,
  Gear,
  Info
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RestaurantStatusScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Main States
  const [isOnline, setIsOnline] = useState(true);
  const [isRushMode, setIsRushMode] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);

  // Sheet Visibility States
  const [showOfflineTiming, setShowOfflineTiming] = useState(false);
  const [showReopenTiming, setShowReopenTiming] = useState(false);
  const [showOfflineReason, setShowOfflineReason] = useState(false);
  const [showScheduleTiming, setShowScheduleTiming] = useState(false);
  const [showRushDuration, setShowRushDuration] = useState(false);

  // Flow State
  const [isScheduledFlow, setIsScheduledFlow] = useState(false);

  const handleBack = () => router.back();

  const handleToggleOnline = (val: boolean) => {
    if (!val) {
      setShowOfflineTiming(true);
    } else {
      setIsOnline(true);
    }
  };

  const handleToggleRush = (val: boolean) => {
    if (val) {
      setShowRushDuration(true);
    } else {
      setIsRushMode(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <CaretLeft size={24} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.rounded }]}>
          Restaurant status
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Restaurant Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoLeft}>
            <Text style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.rounded }]}>Muggs Cafe</Text>
            <Text style={[styles.restaurantId, { color: theme.textSecondary }]}>ID: 20202954 | Balotra Locality, Balotra</Text>
          </View>
          <Pressable style={[styles.settingsBtn, { backgroundColor: theme.surface }]}>
            <Gear size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Status Switches */}
        <View style={styles.section}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.text }]}>Delivery status</Text>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
                <Text style={[styles.statusValue, { color: isOnline ? '#10B981' : '#EF4444' }]}>
                  {isOnline ? 'Receiving orders' : 'Currently Offline'}
                </Text>
              </View>
            </View>
            <PremiumSwitch
              value={isOnline}
              onValueChange={handleToggleOnline}
              activeColor="#10B981"
            />
          </View>

          <View style={[styles.statusRow, { opacity: 0.6 }]}>
            <View style={styles.statusInfo}>
              <View style={styles.labelWithIcon}>
                <Text style={[styles.statusLabel, { color: theme.text }]}>Auto-accept orders</Text>
                <Info size={16} color={theme.textSecondary} />
              </View>
              <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
                Currently unavailable for this restaurant
              </Text>
            </View>
            <PremiumSwitch
              disabled
              value={autoAccept}
              onValueChange={setAutoAccept}
            />
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.text }]}>Rush mode</Text>
              {isRushMode && (
                <Text style={[styles.statusSubtext, { color: theme.primary }]}>
                  Ends in 28 mins
                </Text>
              )}
            </View>
            <PremiumSwitch
              value={isRushMode}
              onValueChange={handleToggleRush}
            />
          </View>
        </View>

        <Separator marginVertical={20} opacity={0.1} />

        {/* Delivery Slot */}
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <Text style={[styles.slotLabel, { color: theme.textSecondary }]}>Current delivery slot</Text>
            <Text style={[styles.slotTime, { color: theme.text }]}>11:15 am - 10:30 pm</Text>
          </View>
          <Pressable style={styles.detailsBtn}>
            <Text style={[styles.detailsText, { color: theme.primary }]}>Details</Text>
            <CaretRight size={16} color={theme.primary} weight="bold" />
          </Pressable>
        </View>

        {/* App Settings */}
        <View style={[styles.statusRow, { marginTop: 12 }]}>
          <View style={styles.appSettingsLeft}>
            <Gear size={24} color={theme.text} />
            <Text style={[styles.appSettingsText, { color: theme.text }]}>App settings</Text>
          </View>
          <CaretRight size={20} color={theme.textSecondary} />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <OfflineTimingSheet
        visible={showOfflineTiming}
        onClose={() => setShowOfflineTiming(false)}
        onSelect={(type: 'now' | 'schedule') => {
          setShowOfflineTiming(false);
          if (type === 'now') {
            setIsScheduledFlow(false);
            setShowReopenTiming(true);
          } else {
            setIsScheduledFlow(true);
            setShowOfflineReason(true);
          }
        }}
      />

      <ReopenTimingSheet
        visible={showReopenTiming}
        onClose={() => setShowReopenTiming(false)}
        onSelect={(timing: string) => {
          setShowReopenTiming(false);
          setShowOfflineReason(true);
        }}
      />

      <OfflineReasonSheet
        visible={showOfflineReason}
        onClose={() => setShowOfflineReason(false)}
        onSelect={(reason: string) => {
          setShowOfflineReason(false);
          if (isScheduledFlow) {
            setShowScheduleTiming(true);
          } else {
            setIsOnline(false);
          }
        }}
      />

      <ScheduleTimingSheet
        visible={showScheduleTiming}
        onClose={() => setShowScheduleTiming(false)}
        onConfirm={() => {
          setShowScheduleTiming(false);
          setIsOnline(false);
        }}
      />

      <RushDurationSheet
        visible={showRushDuration}
        onClose={() => setShowRushDuration(false)}
        onSelect={(duration: string) => {
          setShowRushDuration(false);
          setIsRushMode(true);
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.H2,
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  infoLeft: {
    gap: 4,
  },
  restaurantName: {
    ...Typography.H2,
    fontSize: 20,
  },
  restaurantId: {
    ...Typography.Caption,
    fontSize: 13,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  statusInfo: {
    flex: 1,
    gap: 4,
  },
  statusLabel: {
    ...Typography.H3,
    fontSize: 17,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusValue: {
    ...Typography.Caption,
    fontWeight: '700',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusSubtext: {
    ...Typography.Caption,
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 20,
  },
  slotLabel: {
    ...Typography.Caption,
    fontSize: 13,
  },
  slotTime: {
    ...Typography.H3,
    fontSize: 17,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    ...Typography.BodyRegular,
    fontWeight: '700',
  },
  appSettingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  appSettingsText: {
    ...Typography.H3,
    fontSize: 17,
  }
});
