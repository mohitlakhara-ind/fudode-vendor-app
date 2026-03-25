import React from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { Lightning, BatteryLow, X } from 'phosphor-react-native';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '@/components/themed-text';
import { BlurView } from 'expo-blur';

interface BatteryWarningBannerProps {
  level: number;
  onDismiss?: () => void;
}

export const BatteryWarningBanner = ({ level, onDismiss }: BatteryWarningBannerProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const percentage = Math.round(level * 100);

  // Animation for the pulsing warning icon
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint={colorScheme} style={styles.blurContainer}>
        <View style={[styles.content, { borderColor: '#FF3B30' + '40' }]}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.iconWrapper}>
              <BatteryLow size={24} color="#FF3B30" weight="fill" />
            </View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <ThemedText style={styles.titleText}>Critical Battery: {percentage}%</ThemedText>
            <ThemedText style={styles.subtitleText}>
              Plug in your device to ensure you don't miss any orders.
            </ThemedText>
          </View>

          {onDismiss && (
            <Pressable onPress={onDismiss} style={styles.dismissBtn}>
              <X size={18} color={theme.textSecondary} weight="bold" />
            </Pressable>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  blurContainer: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF3B30' + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FF3B30',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginTop: 2,
  },
  dismissBtn: {
    padding: 4,
  },
});
