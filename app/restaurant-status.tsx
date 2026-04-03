import {
  OfflineReasonSheet,
  OfflineTimingSheet,
  ReopenTimingSheet,
  RushDurationSheet,
  ScheduleTimingSheet
} from '@/components/status/StatusBottomSheets';
import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  CaretRight,
  Clock,
  Gear,
  Info,
  Lightning,
  Motorcycle,
  Robot,
  UserCircle
} from 'phosphor-react-native';
import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { getOwnerProfile } from '@/store/slices/profileSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RestaurantStatusScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { status: restaurantStatus, loading: restaurantLoading } = useAppSelector((state) => state.restaurant);
  const { ownerProfile, loading: profileLoading } = useAppSelector((state) => state.profile);

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

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        {/* Restaurant Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border + '15' }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.surfaceSecondary }]}>
            <UserCircle size={40} color={theme.primary} weight="bold" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.poppins.bold }]}>
              {restaurantStatus?.name || ownerProfile?.name || 'My Restaurant'}
            </Text>
            <View style={styles.idRow}>
              <Text style={[styles.restaurantIdLabel, { color: theme.textSecondary }]}>RESTAURANT ID:</Text>
              <Text style={[styles.restaurantIdValue, { color: theme.text, fontFamily: Fonts.inter.semibold }]}> 
                {restaurantStatus?.id?.slice(-8).toUpperCase() || 'PND-001'}
              </Text>
            </View>
            <Text style={[styles.restaurantLocation, { color: theme.textSecondary }]} numberOfLines={1}>
              {typeof restaurantStatus?.address === 'string' 
                ? restaurantStatus.address 
                : (restaurantStatus?.area 
                    ? `${restaurantStatus.shopno ? restaurantStatus.shopno + ', ' : ''}${restaurantStatus.area}, ${restaurantStatus.city}` 
                    : 'Location details pending')}
            </Text>
          </View>
        </View>

        {/* Operational Status Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>OPERATIONAL STATUS</Text>
        </View>

        <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border + '15' }]}>
          {/* Delivery Toggle */}
          <View style={styles.statusRow}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceSecondary }]}>
              <Motorcycle size={22} color={isOnline ? '#10B981' : theme.textSecondary} weight="bold" />
            </View>
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

          <View style={[styles.rowSeparator, { backgroundColor: theme.border + '08' }]} />

          {/* Auto-Accept Toggle */}
          <View style={[styles.statusRow, { opacity: 0.6 }]}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceSecondary }]}>
              <Robot size={22} color={theme.textSecondary} weight="bold" />
            </View>
            <View style={styles.statusInfo}>
              <View style={styles.labelWithIcon}>
                <Text style={[styles.statusLabel, { color: theme.text }]}>Auto-accept orders</Text>
                <Info size={14} color={theme.textSecondary} />
              </View>
              <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
                Currently unavailable
              </Text>
            </View>
            <PremiumSwitch
              disabled
              value={autoAccept}
              onValueChange={setAutoAccept}
            />
          </View>

          <View style={[styles.rowSeparator, { backgroundColor: theme.border + '08' }]} />

          {/* Rush Mode Toggle */}
          <View style={styles.statusRow}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceSecondary }]}>
              <Lightning size={22} color={isRushMode ? theme.primary : theme.textSecondary} weight={isRushMode ? 'fill' : 'bold'} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.text }]}>Rush mode</Text>
              {isRushMode ? (
                <Text style={[styles.statusSubtext, { color: theme.primary, fontWeight: '700' }]}>
                  Ends in 28 mins
                </Text>
              ) : (
                <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
                  Temporarily increase prep time
                </Text>
              )}
            </View>
            <PremiumSwitch
              value={isRushMode}
              onValueChange={handleToggleRush}
              activeColor={theme.primary}
            />
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SCHEDULE & SLOTS</Text>
        </View>

        <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border + '15' }]}>
          <Pressable style={styles.statusRow} onPress={() => {}}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceSecondary }]}>
              <Clock size={22} color={theme.text} weight="bold" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary, ...Typography.Caption, fontSize: 13 }]}>Current delivery slot</Text>
              <Text style={[styles.slotTime, { color: theme.text, fontFamily: Fonts.inter.semibold }]}>11:15 am - 10:30 pm</Text>
            </View>
            <View style={styles.detailsBtn}>
              <Text style={[styles.detailsText, { color: theme.primary }]}>Details</Text>
              <CaretRight size={16} color={theme.primary} weight="bold" />
            </View>
          </Pressable>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
        </View>

        <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border + '15' }]}>
          <Pressable style={styles.statusRow} onPress={() => {}}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceSecondary }]}>
              <Gear size={22} color={theme.text} weight="bold" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.text, fontSize: 16 }]}>App settings</Text>
            </View>
            <CaretRight size={20} color={theme.textSecondary} />
          </Pressable>
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
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  restaurantName: {
    fontSize: 20,
    letterSpacing: -0.5,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantIdLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  restaurantIdValue: {
    fontSize: 11,
  },
  restaurantLocation: {
    ...Typography.Caption,
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  statusCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
    gap: 2,
  },
  statusLabel: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusSubtext: {
    fontSize: 12,
  },
  rowSeparator: {
    height: 1,
    marginHorizontal: 16,
  },
  slotTime: {
    fontSize: 17,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '800',
  }
});
