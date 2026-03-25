import { Colors, Fonts, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CaretDown, CaretLeft } from 'phosphor-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  interpolateColor 
} from 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface RestaurantHeaderProps {
  restaurantName: string;
  locality: string;
  isOnline: boolean;
  onToggleStatus: () => void;
  onPressMenu?: () => void;
  onPressInfo: () => void;
  onBack?: () => void;
  title?: string;
  onTitlePress?: () => void;
}

export const RestaurantHeader = ({
  restaurantName,
  locality,
  isOnline,
  onToggleStatus,
  onPressMenu,
  onPressInfo,
  onBack,
  title,
  onTitlePress,
}: RestaurantHeaderProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const progress = useSharedValue(isOnline ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isOnline ? 1 : 0, {
      damping: 15,
      stiffness: 150,
      mass: 0.5
    });
  }, [isOnline]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 18 }],
  }));

  const animatedOuterStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [StatusColors.Late, StatusColors.Ready]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [StatusColors.Late, StatusColors.Ready]
    ),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [StatusColors.Late + '15', theme.primary + '15']
    ),
  }));

  const animatedStatusDotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [StatusColors.Late, StatusColors.Ready]
    ),
  }));

  const animatedStatusTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [StatusColors.Late, StatusColors.Ready]
    ),
  }));

  const handleToggle = () => {
    if (isOnline) {
      router.push('/restaurant-status');
    } else {
      onToggleStatus();
    }
  };

  return (
    <View style={styles.header}>
      <View style={[styles.headerMain]}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <CaretLeft size={24} color={theme.text} weight="bold" />
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            onPressInfo();
            onTitlePress?.();
          }}
          style={styles.restaurantInfo}
        >
          <View style={styles.restaurantNameRow}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.rounded }]}>
                {title || restaurantName}
              </Text>
              {!title && <CaretDown size={14} color={theme.textSecondary} weight="bold" />}
            </View>
          </View>
          {!title && (
            <Text style={[styles.locality, { color: theme.textSecondary }]}>
              {locality}
            </Text>
          )}
       </Pressable>
      </View>

      <View style={styles.headerActions}>
        <Animated.View style={[styles.statusContainer, { borderColor: theme.border }, animatedContainerStyle]}>
          <Animated.View style={[styles.statusDot, animatedStatusDotStyle]} />
          <Animated.Text style={[styles.statusText, animatedStatusTextStyle]}>
            {isOnline ? 'Online' : 'Offline'}
          </Animated.Text>
          <Pressable
            onPress={handleToggle}
          >
            <Animated.View style={[styles.toggleOuter, animatedOuterStyle]}>
              <Animated.View style={[styles.toggleInner, animatedThumbStyle, { backgroundColor: theme.surface }]} />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantInfo: {
    flex: 1,
  },
  backButton: {
    paddingRight: 12,
    justifyContent: 'center',
  },
  restaurantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantName: {
    ...Typography.H2,
    fontSize: 18, // Adjusted for header space
    maxWidth: '85%',
  },
  locality: {
    ...Typography.Caption,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.Caption,
    fontWeight: '700',
    marginRight: 4,
  },
  toggleOuter: {
    width: 40,
    height: 22,
    borderRadius: 12,
    padding: 2,
  },
  toggleInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
    top: 2,
    left: 2,

  },
});
