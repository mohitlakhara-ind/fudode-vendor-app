import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { CaretRight } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StackedOrderCardProps {
  order: {
    id: string;
    customerName: string;
    itemSummary: string;
    createdAt: number;
    expiresAt?: number;
    priority?: 'high' | 'normal';
  };
  index: number; // Position in stack (0 is top)
  totalItems: number;
  onOpen: () => void;
  isMoreCard?: boolean;
  moreCount?: number;
}

import { GlassView } from '../ui/GlassView';

export const StackedOrderCard = ({
  order,
  index,
  totalItems,
  onOpen,
  isMoreCard,
  moreCount
}: StackedOrderCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [timeLeft, setTimeLeft] = useState('05:00');

  useEffect(() => {
    if (isMoreCard || !order.createdAt) return;

    const formatTime = () => {
      if (!order.expiresAt) return;
      const diff = Math.max(0, order.expiresAt - Date.now());
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const formatted = mins + ':' + (secs < 10 ? '0' : '') + secs;
      setTimeLeft(formatted);
    };

    const interval = setInterval(formatTime, 1000);
    formatTime(); // Initial run

    return () => clearInterval(interval);
  }, [order.expiresAt, isMoreCard]);

  const opacity = useSharedValue(isMoreCard ? 0.6 : 1);
  const scale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const pulse = useSharedValue(0);

  // Improved downward stacking logic
  const stackOffset = 15;
  const targetScale = isMoreCard ? 1 - (3 * 0.04) : 1 - (index * 0.04);
  const targetTranslateY = isMoreCard ? 3 * stackOffset : index * stackOffset;

  const translateY = useSharedValue(targetTranslateY);

  useEffect(() => {
    translateY.value = withSpring(targetTranslateY, { damping: 15, stiffness: 100 });
    scale.value = withSpring(targetScale, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(isMoreCard ? 0.6 : 1, { duration: 300 });

    if (index === 0 && !isMoreCard) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
    } else {
      pulse.value = 0;
    }
  }, [index, targetScale, targetTranslateY, isMoreCard]);

  const handlePress = async () => {
    if (isMoreCard) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) { }

    pressScale.value = withTiming(0.95, { duration: 100 }, () => {
      pressScale.value = withTiming(1, { duration: 100 });
    });

    onOpen();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value * pressScale.value }
      ],
      opacity: opacity.value,
      zIndex: 100 - index,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    const defaultBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
    if (index !== 0 || isMoreCard) return {
      borderColor: defaultBorder,
      borderWidth: 1
    };
    return {
      borderColor: interpolateColor(
        pulse.value,
        [0, 1],
        [defaultBorder, theme.primary]
      ),
      borderWidth: 1.5,
      shadowOpacity: interpolate(pulse.value, [0, 1], [0.1, 0.3]),
    };
  });

  const glassBackground = isDark
    ? 'rgba(31, 41, 55, 0.7)'
    : 'rgba(255, 255, 255, 0.75)';

  return (
    <View
      style={[
        styles.absoluteContainer,
        { zIndex: totalItems - index }
      ]}
      pointerEvents="box-none"
    >
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <Animated.View style={[styles.cardPulseWrapper, pulseStyle]}>
          <Pressable
            onPress={isMoreCard ? undefined : handlePress}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: isMoreCard ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : glassBackground,
                borderColor: 'transparent',
                paddingVertical: isMoreCard ? 8 : 12,
              }
            ]}
          >
            {!isMoreCard && (
              <GlassView
                intensity={95}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
            )}
            {isMoreCard ? (
              <View style={styles.moreContainer}>
                <Text style={[styles.moreText, { color: theme.textSecondary }]}>
                  + {moreCount} more orders
                </Text>
              </View>
            ) : (
              <View style={styles.compactRow}>
                <View style={styles.mainInfo}>
                  <View style={styles.topLine}>
                    <Text style={[styles.customerName, { color: theme.text, fontFamily: Fonts.rounded }]} numberOfLines={1}>
                      {order.customerName}
                    </Text>
                    <View style={styles.idBadge}>
                      <Text style={[styles.idText, { color: theme.textSecondary }]}>#{order.id}</Text>
                    </View>

                    {totalItems > 1 && !isMoreCard && (
                      <View style={[styles.miniBadge, { backgroundColor: theme.surfaceSecondary, borderWidth: 1, borderColor: theme.border }]}>
                        <Text style={[styles.miniBadgeText, { color: theme.textSecondary }]}>
                          {index + 1} / {totalItems} NEW
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.bottomLine}>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: order.priority === 'high' ? '#FEF2F2' : '#F0F9FF' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: order.priority === 'high' ? '#EF4444' : '#0EA5E9' }
                      ]}>
                        {order.priority === 'high' ? 'PRIORITY' : 'NEW'}
                      </Text>
                    </View>
                    <Text style={[styles.itemSummary, { color: theme.textSecondary, fontFamily: Fonts.sans }]} numberOfLines={1}>
                      • {order.itemSummary}
                    </Text>
                  </View>
                </View>
                <View style={styles.rightSection}>
                  <View style={styles.timerContainer}>
                    <Text style={[styles.timerLarge, { color: theme.primary }]}>
                      {timeLeft}
                    </Text>
                  </View>
                  <CaretRight size={14} color={theme.textSecondary} weight="bold" />
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH - 24,
  },
  card: {
    padding: 12,
    overflow: 'hidden',
  },
  cardPulseWrapper: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainInfo: {
    flex: 1,
    gap: 4,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerName: {
    ...Typography.H3,
    flexShrink: 1,
  },
  idBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  itemSummary: {
    ...Typography.Caption,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timerLarge: {
    ...Typography.H2,
    fontVariant: ['tabular-nums'],
  },
  moreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  moreText: {
    ...Typography.Caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
