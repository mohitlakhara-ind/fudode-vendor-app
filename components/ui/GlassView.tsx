import { BlurView, BlurViewProps } from 'expo-blur';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface GlassViewProps extends BlurViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /**
   * Optional fallback opacity for Android if blur is not preferred or problematic.
   * Defaults to a value that matches the visual weight of the blur.
   */
  androidFallbackOpacity?: number;
}

/**
 * A senior-engineered, cross-platform Glassmorphism component.
 * 
 * Why this exists:
 * 1. Android's BlurView is notorious for failing in complex hierarchies (Modals, Overlays).
 * 2. It requires `experimentalBlurMethod="dimezisBlurView"` for real-time, high-quality results.
 * 3. It needs a carefully matched fallback to maintain UI consistency when native blur fails.
 */
export const GlassView = ({
  intensity = 50,
  tint = 'default',
  style,
  children,
  androidFallbackOpacity,
  ...props
}: GlassViewProps) => {
  const isAndroid = Platform.OS === 'android';

  // Improved fallback logic for a lighter, more transparent feel on Android
  const getFallbackColor = () => {
    const isDarkTint = tint === 'dark';
    // Significantly reduced opacities to ensure background visibility
    const baseOpacity = isDarkTint ? 0.35 : 0.25;
    const opacity = androidFallbackOpacity ?? (intensity / 100) * baseOpacity;

    if (isDarkTint) return `rgba(0, 0, 0, ${opacity})`;
    if (tint === 'light') return `rgba(255, 255, 255, ${opacity})`;
    return `rgba(255, 255, 255, ${opacity * 0.8})`;
  };

  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity / 2}
        tint={tint}
        {...props}
        // CRITICAL: This method is significantly more robust on modern Android devices
        experimentalBlurMethod={isAndroid ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />

      {/* 
         On Android, we add a semi-transparent layer to ensure visual depth 
         even if the native blur renderer is having issues with transparency.
      */}
      {isAndroid && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: getFallbackColor() }
          ]}
          pointerEvents="none"
        />
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
