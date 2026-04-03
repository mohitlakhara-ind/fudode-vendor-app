import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconProps } from 'phosphor-react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * A premium, standardized Empty State component.
 * Features:
 * - Phosphor icon with themed background circle
 * - H2 Title with bold typography
 * - Body description
 * - Optional CTA button
 * - Entrance animation
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).springify()}
      style={[styles.container, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <Icon size={48} color={theme.text} weight="duotone" />
      </View>
      
      <ThemedText style={[styles.title, { color: theme.text, fontFamily: Fonts.bold }]}>
        {title}
      </ThemedText>
      
      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </ThemedText>

      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  title: {
    ...Typography.H2,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 22,
  },
  description: {
    ...Typography.BodyRegular,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionBtn: {
    minWidth: 180,
    height: 52,
  },
});
