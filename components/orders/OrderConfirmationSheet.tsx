import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withRepeat,
  interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CheckCircle, Clock, Warning, Minus, Plus } from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

interface OrderConfirmationSheetProps {
  visible: boolean;
  onAccept: (prepTime: number) => void;
  onBack: () => void;
}

export const OrderConfirmationSheet = ({
  visible,
  onAccept,
  onBack
}: OrderConfirmationSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const [isItemsAvailable, setIsItemsAvailable] = useState(false);
  const [selectedTime, setSelectedTime] = useState(20);
  const successGreen = '#10B981';

  // Animation shared values
  const shakeOffset = useSharedValue(0);
  const pulseValue = useSharedValue(0);

  const incrementTime = () => setSelectedTime(prev => Math.min(prev + 5, 120));
  const decrementTime = () => setSelectedTime(prev => Math.max(prev - 5, 5));

  const triggerRequirementFeedback = () => {
    // Haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Shake animation
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    );

    // Pulse animation
    pulseValue.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 400 })
    );
  };

  const animatedCheckRowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
      borderColor: interpolateColor(
        pulseValue.value,
        [0, 1],
        [isItemsAvailable ? successGreen : theme.border, theme.secondary]
      ),
      borderWidth: 2,
    };
  });

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onBack} 
      isNonDismissible={false}
      title="Confirm Preparation"
    >
      <View style={styles.container}>
        {/* Step 1: Items Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>1. Inventory Check</Text>
          <Animated.View style={[styles.checkRowContainer, animatedCheckRowStyle]}>
            <Pressable 
              style={[
                styles.checkRow,
                { 
                  backgroundColor: isItemsAvailable ? successGreen + '15' : theme.surfaceSecondary,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  gap: 12,
                }
              ]}
              onPress={() => setIsItemsAvailable(!isItemsAvailable)}
            >
              <View style={[
                styles.checkIconWrapper, 
                { backgroundColor: isItemsAvailable ? successGreen : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }
              ]}>
                <CheckCircle 
                  size={22} 
                  weight={isItemsAvailable ? "bold" : "regular"} 
                  color={isItemsAvailable ? '#FFF' : theme.textSecondary} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkText, { color: theme.text, fontFamily: Fonts.sans }]}>
                  Everything is ready to cook
                </Text>
                <Text style={[styles.checkSubtext, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
                  I have confirmed all items are in stock
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Step 2: Custom Prep Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>2. Expected Prep Time</Text>
          
          <View style={[styles.timePickerContainer, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            <Pressable 
              style={[styles.timeBtn, { backgroundColor: theme.surface }]} 
              onPress={decrementTime}
            >
              <Minus size={24} color={theme.text} weight="bold" />
            </Pressable>
            
            <View style={styles.timeDisplay}>
              <Text style={[styles.timeValue, { color: theme.text, fontFamily: Fonts.rounded }]}>
                {selectedTime}
              </Text>
              <Text style={[styles.timeUnit, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
                MINUTES
              </Text>
            </View>

            <Pressable 
              style={[styles.timeBtn, { backgroundColor: theme.surface }]} 
              onPress={incrementTime}
            >
              <Plus size={24} color={theme.text} weight="bold" />
            </Pressable>
          </View>
          
          <Text style={[styles.timeHint, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
            Adjust time based on kitchen load
          </Text>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: theme.secondary + '15', borderColor: theme.secondary + '30' }]}>
          <Clock size={20} color={theme.secondary} weight="fill" />
          <Text style={[styles.infoText, { color: theme.secondary, fontFamily: Fonts.sans }]}>
            Late signals trigger after {selectedTime} minutes
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <PremiumButton 
            variant="ghost"
            label="Go Back"
            onPress={onBack}
            style={{ flex: 1, height: 56 }}
          />
          <View style={{ width: 12 }} />
          <PrimaryButton 
            title="Confirm Order"
            onPress={() => onAccept(selectedTime)}
            disabled={!isItemsAvailable}
            onDisabledPress={triggerRequirementFeedback}
            style={{ flex: 2 }}
            color={successGreen}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.Caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  checkRowContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  checkIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    ...Typography.H3,
  },
  checkSubtext: {
    ...Typography.Caption,
    marginTop: 2,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  timeDisplay: {
    alignItems: 'center',
    flex: 1,
  },
  timeValue: {
    ...Typography.Display,
    fontSize: 42,
    lineHeight: 48,
  },
  timeUnit: {
    ...Typography.Caption,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: -4,
  },
  timeHint: {
    ...Typography.Caption,
    textAlign: 'center',
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    ...Typography.BodyRegular,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
  }
});
