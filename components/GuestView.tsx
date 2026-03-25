import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconProps } from 'phosphor-react-native';

interface GuestViewProps {
  title: string;
  description: string;
  icon: React.FC<IconProps>;
}

export const GuestView = ({ title, description, icon: Icon }: GuestViewProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.bgCircle, { backgroundColor: theme.primary, opacity: 0.1, top: -100, left: -50 }]} />
      <View style={[styles.bgCircle, { backgroundColor: theme.secondary, opacity: 0.05, bottom: -100, right: -50 }]} />
      
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
          <Icon size={80} color={theme.primary} weight="duotone" />
        </View>
        
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.icon }]}>
          {description}
        </Text>
        
        <PrimaryButton 
          title="Login to Access" 
          onPress={() => router.push('/(auth)/login')}
          style={styles.button}
        />
        
        <Text style={[styles.footerText, { color: theme.icon }]}>
          New to Fudode? Register to get started.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: -1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...Typography.H1,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    ...Typography.BodyLarge,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  button: {
    width: '100%',
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  footerText: {
    ...Typography.Caption,
    marginTop: 24,
    opacity: 0.6,
  },
});
