import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { MeshGradient } from './MeshGradient';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const Loading = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MeshGradient />
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={{ uri: 'https://cdn.fudode.in/public/Logo.png' }}
            style={[styles.logo, { tintColor: theme.primary }]}
            resizeMode="contain"
          />
        </Animated.View>
        <ActivityIndicator size="small" color={theme.primary} style={styles.loader} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.4,
    height: 60,
    marginBottom: 24,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginTop: 8,
  }
});
