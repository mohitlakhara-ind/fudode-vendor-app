import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TextInputProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolateColor 
} from 'react-native-reanimated';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { IconProps } from 'phosphor-react-native';

interface PremiumInputProps extends TextInputProps {
  label: string;
  icon?: React.FC<IconProps>;
}

export const PremiumInput = ({ label, icon: Icon, ...props }: PremiumInputProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withSpring(0);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', theme.primary]
      ),
      backgroundColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', isDark ? 'rgba(250, 203, 4, 0.05)' : 'rgba(250, 203, 4, 0.03)']
      ),
    };
  });

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: isFocused ? theme.primary : theme.icon }]}>{label}</Text>
      <Animated.View style={[styles.container, containerStyle]}>
        {Icon && (
          <View style={styles.iconBox}>
            <Icon size={20} color={isFocused ? theme.primary : theme.icon} weight={isFocused ? "fill" : "regular"} />
          </View>
        )}
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  iconBox: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
});
