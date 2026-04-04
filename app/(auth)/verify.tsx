import { getPersistentDeviceId } from '@/api/api';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { verifyOtp } from '@/store/slices/authSlice';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CaretLeft, Timer, ShieldCheck } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  interpolateColor
} from 'react-native-reanimated';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { GlassView } from '@/components/ui/GlassView';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { AnimatedPage } from '@/components/ui/AnimatedPage';

const { width } = Dimensions.get('window');

const OTP_BOX_SIZE = (width - 48 - 50) / 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { number } = useLocalSearchParams<{ number: string }>();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { verifyOtpAction, requestOtpAction, loading, error, clearError } = useAuth();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRef = useRef<TextInput>(null);
  
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => {
      clearInterval(countdown);
      clearTimeout(focusTimer);
      clearError();
    };
  }, []);

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  useEffect(() => {
    if (error) {
      triggerShake();
    }
  }, [error]);

  const handleVerify = async () => {
    if (otp.length !== 6 || loading) return;
    try {
      const deviceId = await getPersistentDeviceId();
      const result = await verifyOtpAction({
        number: number!,
        otp,
        deviceId,
        deviceType: Platform.OS.toUpperCase() as any,
      });

      if (verifyOtp.fulfilled.match(result)) {
        router.replace('/(auth)/onboarding');
      } else {
        // If OTP didn't match, clear and let user re-try
        setOtp('');
        triggerShake();
        inputRef.current?.focus();
      }
    } catch (e) {
      setOtp('');
      triggerShake();
      inputRef.current?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !number) return;
    try {
      setTimer(30);
      await requestOtpAction(number);
      setOtp(''); // Clear existing digits when resending
      inputRef.current?.focus();
    } catch (e) {
      console.error('[Verify] Resend failed:', e);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background }]}>
      <MeshGradient />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'
                }
              ]}
              onPress={() => router.back()}
            >
              <CaretLeft size={24} color={theme.text} weight="bold" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.header}>
            <Animated.View entering={FadeInUp.delay(200).duration(800)}>
              <View style={styles.badge}>
                <ShieldCheck size={14} color={theme.primary} weight="fill" />
                <Text style={[styles.badgeText, { color: theme.primary }]}>SECURE VERIFICATION</Text>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>Confirm OTP</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We've sent a 6-digit code to {'\n'}
                <Text style={{ color: theme.text, fontWeight: '900' }}>+91 {number}</Text>
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={[styles.otpSection, animatedContainerStyle]}
          >
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={otp}
              onChangeText={(val) => setOtp(val.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              autoFocus
            />
            <View style={styles.squaresContainer}>
              {[...Array(6)].map((_, i) => {
                const isFocused = otp.length === i;
                const hasDigit = otp.length > i;
                
                return (
                  <Animated.View 
                    key={i} 
                    entering={FadeInDown.delay(500 + i * 50).duration(400)}
                    style={styles.squareWrapper}
                  >
                    <GlassView
                      intensity={isDark ? 30 : 50}
                      style={[
                        styles.square,
                        {
                          borderColor: isFocused ? theme.primary : (hasDigit ? theme.primary + '40' : theme.border),
                          borderWidth: isFocused ? 2 : 1.5,
                          backgroundColor: isFocused ? theme.primary + '08' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)'),
                        }
                      ]}
                    >
                      <Text style={[styles.squareText, { color: theme.text }]}>{otp[i] || ''}</Text>
                      {isFocused && (
                        <Animated.View
                          entering={FadeInUp.duration(400)}
                          style={[styles.cursor, { backgroundColor: theme.primary }]}
                        />
                      )}
                    </GlassView>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>

          {error && (
            <Animated.View entering={FadeInUp} style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error as string}
              </Text>
            </Animated.View>
          )}

        </View>

        <GlassView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.stickyFooter}>
          <TouchableOpacity 
            disabled={timer > 0} 
            onPress={handleResendOtp}
            style={styles.timerRow}
          >
            <Timer size={18} color={timer > 0 ? theme.textSecondary : theme.primary} weight="bold" />
            <Text style={[styles.resendText, { color: timer > 0 ? theme.textSecondary : theme.primary }]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code Now'}
            </Text>
          </TouchableOpacity>

          <PremiumButton
            label={loading ? 'Verifying...' : 'Authenticate'}
            onPress={handleVerify}
            isLoading={loading}
            disabled={otp.length !== 6}
            variant="primary"
            size="large"
          />
        </GlassView>
      </KeyboardAvoidingView>
    </AnimatedPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
  },
  header: {
    marginBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(250, 203, 4, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    ...Typography.Display,
    fontSize: 32,
    textAlign: 'left',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    ...Typography.BodyLarge,
    lineHeight: 26,
    opacity: 0.8,
  },
  otpSection: {
    marginBottom: 40,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  squaresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  squareWrapper: {
    width: OTP_BOX_SIZE,
    height: 68,
    borderRadius: 16,
    overflow: 'hidden',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
  },
  squareText: {
    fontSize: 28,
    fontWeight: '800',
  },
  cursor: {
    position: 'absolute',
    bottom: 12,
    width: 14,
    height: 3,
    borderRadius: 2,
  },
  errorContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  errorText: {
    ...Typography.BodyRegular,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
