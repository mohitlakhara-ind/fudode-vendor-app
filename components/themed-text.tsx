import { StyleSheet, Text, type TextProps } from 'react-native';
import { Typography } from '@/constants/theme';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...Typography.BodyRegular,
  },
  defaultSemiBold: {
    ...Typography.BodyLarge,
    fontWeight: '600',
  },
  title: {
    ...Typography.Display,
  },
  subtitle: {
    ...Typography.H2,
  },
  link: {
    ...Typography.BodyRegular,
    color: '#0a7ea4',
  },
});
