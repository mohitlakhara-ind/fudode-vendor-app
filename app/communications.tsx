import { PremiumSwitch } from '@/components/ui/PremiumSwitch';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Bell,
  CaretLeft,
  ChatDots,
  Envelope,
  Moped,
  PhoneSlash,
  SpeakerHigh,
  WhatsappLogo,
} from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SECTION_SPACING = 24;

const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
  Haptics.impactAsync(style);
};

const SettingRow = ({
  icon: Icon,
  title,
  subtitle,
  value,
  onValueChange,
  hasSwitch = true,
  children
}: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const handleToggle = (newValue: boolean) => {
    onValueChange(newValue);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.rowWrapper}>
      <View style={styles.rowMain}>
        <View style={styles.rowLeft}>
          <View
            intensity={20}
            tint={colorScheme}
            style={[styles.iconContainer, { backgroundColor: theme.surfaceSecondary + '30' }]}
          >
            <Icon size={22} color={theme.text} weight="regular" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {hasSwitch && (
          <PremiumSwitch
            value={value}
            onValueChange={handleToggle}
            activeColor="#22C55E" // Green like in the image
          />
        )}
      </View>
      {children && <View style={styles.rowExtra}>{children}</View>}
    </View>
  );
};

const VolumeSlider = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [volume, setVolume] = useState(0.6);
  const sliderWidth = 280;
  const translateX = useSharedValue(volume * sliderWidth);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      isDragging.value = true;
      runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onUpdate((event) => {
      let newValue = startX.value + event.translationX;
      if (newValue < 0) newValue = 0;
      if (newValue > sliderWidth) newValue = sliderWidth;

      // Trigger haptic every 10%
      const oldStep = Math.floor((translateX.value / sliderWidth) * 10);
      const newStep = Math.floor((newValue / sliderWidth) * 10);
      if (oldStep !== newStep) {
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      }

      translateX.value = newValue;
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 10 },
      { scale: withSpring(isDragging.value ? 1.2 : 1) }
    ],
    backgroundColor: isDragging.value ? '#60A5FA' : '#3B82F6'
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  return (
    <View style={styles.sliderContainer}>
      <View style={[styles.sliderTrack, { backgroundColor: theme.border + '30' }]}>
        <Animated.View style={[styles.sliderProgress, { backgroundColor: '#3B82F6' }, animatedProgressStyle]} />
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sliderThumb, animatedThumbStyle]} />
      </GestureDetector>
    </View>
  );
};

export default function CommunicationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  // States
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [complaintNotifs, setComplaintNotifs] = useState(false);
  const [riderNotifs, setRiderNotifs] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Manage communications</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Report Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionInfo, { color: theme.textSecondary }]}>Every Monday for previous week</Text>
          </View>
          <SettingRow
            icon={WhatsappLogo}
            title="Share on whatsapp"
            value={whatsapp}
            onValueChange={setWhatsapp}
          />
          <View style={styles.separator} />
          <SettingRow
            icon={Envelope}
            title="Share on email"
            value={email}
            onValueChange={setEmail}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        {/* Order Notifications Section */}
        <View style={styles.section}>
          <SettingRow
            icon={Bell}
            title="Order notifications"
            subtitle="Receive order notifications on this device"
            value={orderNotifs}
            onValueChange={setOrderNotifs}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        {/* Volume Section */}
        <View style={styles.section}>
          <SettingRow
            icon={SpeakerHigh}
            title="Ring volume"
            hasSwitch={false}
          >
            <VolumeSlider />
          </SettingRow>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        {/* Silent Mode Section */}
        <View style={styles.section}>
          <SettingRow
            icon={PhoneSlash}
            title="Ring in silent mode"
            subtitle="Ring for order notifications even when phone is on silent mode"
            value={silentMode}
            onValueChange={setSilentMode}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        {/* Live Complaint Section */}
        <View style={styles.section}>
          <SettingRow
            icon={ChatDots}
            title="Live complaint notifications"
            subtitle="Receive notification when a customer raises a complaint on an order"
            value={complaintNotifs}
            onValueChange={setComplaintNotifs}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.surfaceSecondary }]} />

        {/* Rider Notifications Section */}
        <View style={styles.section}>
          <SettingRow
            icon={Moped}
            title="Rider notifications"
            subtitle="Receive notification when the rider arrives at your restaurant to pick an order"
            value={riderNotifs}
            onValueChange={setRiderNotifs}
          />
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
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H2,
    fontSize: 22,
  },
  scrollContent: {
    paddingTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionInfo: {
    ...Typography.Caption,
    fontSize: 14,
  },
  divider: {
    height: 8,
    width: '100%',
  },
  rowWrapper: {
    marginVertical: 4,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...Typography.H3,
    fontSize: 16,
  },
  rowSubtitle: {
    ...Typography.Caption,
    fontSize: 13,
    lineHeight: 18,
  },
  rowExtra: {
    marginTop: 12,
    paddingLeft: 56, // Align with title
  },
  separator: {
    height: 12,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    width: 280,
    overflow: 'hidden',
  },
  sliderProgress: {
    height: '100%',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    position: 'absolute',
    top: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
