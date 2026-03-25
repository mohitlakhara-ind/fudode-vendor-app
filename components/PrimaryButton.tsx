import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
  onDisabledPress?: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  color,
  onDisabledPress,
}) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const activeColor = color || theme.primary;

  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (isDisabled) {
      onDisabledPress?.();
    } else {
      onPress();
    }
  };

  // Glassy background logic
  const glassyBg = isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : `${activeColor}08`;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? 'rgba(0,0,0,0.05)' : glassyBg,
          borderColor: isDisabled ? theme.border : activeColor,
          borderWidth: 1.5,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={isDisabled ? 0.9 : 0.7}
    >
      {loading ? (
        <ActivityIndicator color={activeColor} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: isDisabled ? theme.icon : activeColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
