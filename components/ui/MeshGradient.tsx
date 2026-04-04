import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export const MeshGradient = () => {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme];

  // Gold accents for the "Gold & Obsidian" look
  const goldPrimary = '#facb04';
  const goldSecondary = '#fde68a';
  
  if (isDark) {
    return (
      <View 
        style={[StyleSheet.absoluteFill, { backgroundColor: '#131313' }]}
        renderToHardwareTextureAndroid={true}
        collapsable={false}
      >
        {/* Top Right Glow */}
        <LinearGradient
          colors={['rgba(250, 203, 4, 0.12)', 'transparent']}
          style={[styles.gradientCircle, { top: -height * 0.1, right: -width * 0.2, width: width * 1.2, height: width * 1.2 }]}
        />
        
        {/* Bottom Left Glow */}
        <LinearGradient
          colors={['rgba(177, 1, 1, 0.08)', 'transparent']}
          style={[styles.gradientCircle, { bottom: -height * 0.1, left: -width * 0.3, width: width * 1.3, height: width * 1.3 }]}
        />

        {/* Center Subtle Glow */}
        <LinearGradient
          colors={['rgba(250, 203, 4, 0.05)', 'transparent']}
          style={[styles.gradientCircle, { top: height * 0.2, left: width * 0.1, width: width * 0.8, height: width * 0.8 }]}
        />
      </View>
    );
  }

  return (
    <View 
      style={[StyleSheet.absoluteFill, { backgroundColor: '#F8F9FA' }]}
      renderToHardwareTextureAndroid={true}
      collapsable={false}
    >
      {/* Soft Top Gradient */}
      <LinearGradient
        colors={['rgba(250, 203, 4, 0.08)', 'transparent']}
        style={[styles.gradientCircle, { top: -height * 0.2, right: -width * 0.2, width: width * 1.4, height: width * 1.4 }]}
      />
      
      {/* Soft Bottom Gradient */}
      <LinearGradient
        colors={['rgba(0, 102, 255, 0.03)', 'transparent']}
        style={[styles.gradientCircle, { bottom: -height * 0.2, left: -width * 0.3, width: width * 1.5, height: width * 1.5 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gradientCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
});
