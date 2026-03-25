import { Colors, Fonts, Typography, StatusColors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { CaretDown } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

interface RestaurantHeaderProps {
  restaurantName: string;
  locality: string;
  isOnline: boolean;
  onToggleStatus: () => void;
  onPressMenu?: () => void;
  onPressInfo: () => void;
}

export const RestaurantHeader = ({
  restaurantName,
  locality,
  isOnline,
  onToggleStatus,
  onPressMenu,
  onPressInfo,
}: RestaurantHeaderProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleToggle = () => {
    if (isOnline) {
      router.push('/restaurant-status');
    } else {
      // If offline, just go online (or show confirmation)
      onToggleStatus();
    }
  };

  return (
    <View style={styles.header}>
      <View style={[styles.headerMain]}>
        <Pressable
          onPress={onPressInfo}
          style={styles.restaurantInfo}
        >
          <View style={styles.restaurantNameRow}>
            <Text style={[styles.restaurantName, { color: theme.text, fontFamily: Fonts.rounded }]} numberOfLines={1}>
              {restaurantName}
            </Text>
            <CaretDown size={14} color={theme.textSecondary} weight="bold" />
          </View>
          <Text style={[styles.locality, { color: theme.textSecondary }]} numberOfLines={1}>
            {locality}
          </Text>
        </Pressable>
      </View>

      <View style={styles.headerActions}>
        <View style={[styles.statusContainer, { backgroundColor: isOnline ? theme.primary + '15' : StatusColors.Late + '15', borderColor: theme.border }]}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? StatusColors.Ready : StatusColors.Late }]} />
          <Text style={[styles.statusText, { color: isOnline ? StatusColors.Ready : StatusColors.Late }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <Pressable
            onPress={handleToggle}
            style={[
              styles.toggleOuter,
              {
                backgroundColor: isOnline ? StatusColors.Ready : StatusColors.Late,
                borderColor: isOnline ? StatusColors.Ready : StatusColors.Late
              }
            ]}
          >
            <View style={[styles.toggleInner, { transform: [{ translateX: isOnline ? 18 : 0 }], backgroundColor: '#fff' }]} />
          </Pressable>
        </View>
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
