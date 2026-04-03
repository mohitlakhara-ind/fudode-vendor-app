import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';

interface JourneyProgressProps {
  totalSteps: number;
  currentStep: number;
}

export const JourneyProgress = ({ totalSteps, currentStep }: JourneyProgressProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(currentStep / totalSteps, {
      damping: 15,
      stiffness: 100,
    });
  }, [currentStep, totalSteps]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Your Journey</Text>
        <Text style={[styles.stepText, { color: theme.primary }]}>
          Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        <Animated.View 
          style={[
            styles.fill, 
            { backgroundColor: theme.primary },
            animatedProgressStyle
          ]} 
        />
        
        {/* Step Markers */}
        <View style={styles.markersContainer}>
          {Array.from({ length: totalSteps + 1 }).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.marker, 
                { 
                  left: `${(i / totalSteps) * 100}%`,
                  backgroundColor: i <= currentStep ? theme.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                }
              ]} 
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  title: {
    ...Typography.H3,
    fontWeight: '800',
    fontSize: 18,
  },
  stepText: {
    ...Typography.Caption,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  track: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'visible', // To allow markers to show
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#facb04',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  markersContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  marker: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#131313', // Matches obsidian background
    transform: [{ translateX: -6 }],
  },
});
