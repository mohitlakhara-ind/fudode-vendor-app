import { OrderCardContent } from '@/components/orders/OrderCard';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { SwipeToConfirm } from '@/components/ui/SwipeToConfirm';
import { Colors, Fonts, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import {
  Bicycle,
  CookingPot,
  DotsThreeCircle,
  Package,
  Phone,
  Storefront,
  XCircle
} from 'phosphor-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface NewOrderSheetProps {
  visible: boolean;
  order: any;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss: () => void;
  onContact: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export const NewOrderSheet = ({
  visible,
  order,
  onConfirm,
  onCancel,
  onDismiss,
  onContact,
  currentIndex,
  totalCount
}: NewOrderSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [isConfirmingCancel, setIsConfirmingCancel] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [otherReason, setOtherReason] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState('');
  const [isLowTime, setIsLowTime] = React.useState(false);

  const shakeOffset = useSharedValue(0);

  const triggerShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const pulseOpacity = useSharedValue(1);

  React.useEffect(() => {
    if (isLowTime) {
      pulseOpacity.value = withRepeat(
        withTiming(0.4, { duration: 500 }),
        -1,
        true
      );
    } else {
      pulseOpacity.value = withTiming(1);
    }
  }, [isLowTime]);

  const pulsingStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const CANCEL_REASONS = [
    { label: "Item(s) out of stock", icon: Package },
    { label: "Restaurant is closed/closing", icon: Storefront },
    { label: "Too much rush in kitchen", icon: CookingPot },
    { label: "Delivery not available", icon: Bicycle },
    { label: "Other", icon: DotsThreeCircle }
  ];

  React.useEffect(() => {
    if (!order?.expiresAt || !visible) return;

    const updateTimer = () => {
      const diff = Math.max(0, order.expiresAt - Date.now());
      setIsLowTime(diff > 0 && diff <= 15000);

      if (diff <= 0 && visible) {
        onCancel();
        Alert.alert("Order Cancelled", "Order was cancelled due to delay.");
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.expiresAt, visible]);

  // Reset confirmation state when sheet hidden
  React.useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setIsConfirmingCancel(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!order) return null;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onDismiss}
      isNonDismissible={false}
      title={isConfirmingCancel ? "Cancel Order?" : `Incoming Order (${timeLeft})`}
    >
      <View style={styles.container}>
        {!isConfirmingCancel ? (
          <>
            <View style={styles.badgeRow}>
              <View style={[styles.miniBadge, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
                <Text style={[styles.miniBadgeText, { color: theme.textSecondary }]}>#{order.id}</Text>
              </View>

              <View style={styles.rightBadges}>

                <View style={[styles.miniBadge, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
                  <Text style={[styles.miniBadgeText, { color: theme.textSecondary }]}>
                    {currentIndex && totalCount ? `${currentIndex} / ${totalCount}` : `1 / 1`} NEW ORDERS
                  </Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: StatusColors[order.status as keyof typeof StatusColors] || theme.primary }]}>
                  <Text style={[styles.miniBadgeText, { color: '#FFF' }]}>{order.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              {isLowTime && (
                <Animated.View style={[styles.lowTimeAlert, pulsingStyle]}>
                  <XCircle size={20} color="#FFF" weight="fill" />
                  <Text style={styles.lowTimeText}>Last chance to accept order!</Text>
                </Animated.View>
              )}
              <OrderCardContent
                {...order}
                hideActions={true}
                hideHeader={true}
              />
            </View>

            <View style={styles.actionSection}>
              <View style={styles.buttonRow}>
                <PremiumButton
                  variant="glassy"
                  label="Call Customer"
                  onPress={onContact}
                  leftIcon={<Phone size={20} color={theme.text} weight="bold" />}
                  style={{ flex: 1.5, height: 56, borderRadius: 16 }}
                  textStyle={{ color: theme.text }}
                  color={theme.text}
                />
                <View style={{ width: 12 }} />
                <PremiumButton
                  variant="glassy"
                  label="Cancel"
                  onPress={() => setIsConfirmingCancel(true)}
                  leftIcon={<XCircle size={20} color="#EF4444" weight="bold" />}
                  style={{ flex: 1, height: 56, borderRadius: 16 }}
                  textStyle={{ color: '#EF4444' }}
                  color="#EF4444"
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <SwipeToConfirm
                  onConfirm={onConfirm}
                  label="Slide to Accept"
                  color={theme.primary}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.confirmContainer}>
            <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
              <Text style={[styles.warningText, { color: '#B91C1C', fontFamily: Fonts.sans }]}>
                Please select a reason for rejection. This helps us improve the customer experience.
              </Text>
            </View>

            <Animated.View style={[styles.chipsContainer, animatedShakeStyle]}>
              {CANCEL_REASONS.map((item) => {
                const isSelected = cancelReason === item.label;
                return (
                  <Pressable
                    key={item.label}
                    onPress={() => {
                      setCancelReason(item.label);
                      if (item.label !== 'Other') setOtherReason('');
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? (colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)')
                          : theme.surfaceSecondary,
                        borderColor: isSelected ? '#EF4444' : 'rgba(0,0,0,0.08)',
                        borderWidth: isSelected ? 1.5 : 1,
                      }
                    ]}
                  >
                    <item.icon
                      size={18}
                      color={isSelected ? '#EF4444' : theme.textSecondary}
                      weight={isSelected ? "fill" : "regular"}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#EF4444' : theme.textSecondary,
                          fontWeight: isSelected ? '600' : '400'
                        }
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </Animated.View>

            {cancelReason === 'Other' && (
              <Animated.View style={[styles.otherInputContainer, animatedShakeStyle]}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Specify Reason (Required)
                </Text>
                <TextInput
                  style={[
                    styles.otherInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      color: theme.text,
                      borderColor: theme.border,
                      fontFamily: Fonts.sans
                    }
                  ]}
                  placeholder="Tell us exactly why..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                  value={otherReason}
                  onChangeText={setOtherReason}
                  selectionColor="#EF4444"
                />
              </Animated.View>
            )}

            <View style={[styles.buttonRow, { marginTop: 20 }]}>
              <PremiumButton
                variant="primary"
                label="Confirm Rejection"
                onPress={onCancel}
                disabled={!cancelReason || (cancelReason === 'Other' && !otherReason.trim())}
                onDisabledPress={triggerShake}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: (!cancelReason || (cancelReason === 'Other' && !otherReason.trim()))
                    ? (colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5')
                    : '#EF4444'
                }}
                textStyle={{ color: '#FFF' }}
              />
            </View>
            <PremiumButton
              variant="ghost"
              label="No, Go Back"
              onPress={() => {
                setIsConfirmingCancel(false);
                setCancelReason('');
              }}
              style={{ marginTop: 12, height: 48 }}
              textStyle={{ color: theme.textSecondary }}
            />
          </View>
        )}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  actionSection: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  confirmContainer: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  warningBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
  },
  warningText: {
    ...Typography.BodyRegular,
    textAlign: 'center',
  },
  orderCountBadge: {
    alignItems: 'flex-end',
  },
  orderIdLabel: {
    ...Typography.Caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orderIdValue: {
    ...Typography.H3,
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  largeCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  largeCountText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  lowTimeAlert: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  lowTimeText: {
    color: '#FFF',
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    width: '100%',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipText: {
    ...Typography.Caption,
    fontSize: 13,
  },
  otherInputContainer: {
    marginTop: 12,
    width: '100%',
  },
  inputLabel: {
    ...Typography.Caption,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  otherInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    height: 90,
    textAlignVertical: 'top',
    ...Typography.BodyRegular,
  }
});
