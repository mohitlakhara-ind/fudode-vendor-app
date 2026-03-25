import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { CaretLeft } from 'phosphor-react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { verifyOtp } from '@/store/slices/authSlice';
import { getPersistentDeviceId } from '@/api/api';

export default function VerifyScreen() {
  const router = useRouter();
  const { number } = useLocalSearchParams<{ number: string }>();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const { verifyOtpAction, loading, error, clearError } = useAuth();
  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Auto focus with slight delay for smoother transition
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => {
      clearTimeout(timer);
      clearError();
    };
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    try {
      console.log('handleVerify called with OTP:', otp);
      const deviceId = await getPersistentDeviceId();
      console.log('Using Device ID:', deviceId);
      
      const result = await verifyOtpAction({
        number: number!,
        otp,
        deviceId,
        deviceType: Platform.OS.toUpperCase() as any,
      });
      
      if (verifyOtp.fulfilled.match(result)) {
        router.replace('/(auth)/onboarding');
      }
    } catch (e) {
      // console.error('Verify error:', e); // Removed as per instruction
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { 
              borderColor: theme.border,
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
            }
          ]} 
          onPress={() => router.back()}
        >
          <CaretLeft size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Verify Phone</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            We've sent a 6-digit code to {'\n'}
            <Text style={{ color: theme.text, fontWeight: '700' }}>+91 {number}</Text>
          </Text>
        </View>

        <View style={styles.otpSection}>
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={otp}
            onChangeText={(val) => setOtp(val.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode"
          />
          <View style={styles.squaresContainer}>
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.square,
                  {
                    borderColor: otp.length === i ? theme.primary : theme.border,
                    backgroundColor: theme.surface,
                    borderWidth: otp.length === i ? 2 : 1.5,
                  },
                ]}
              >
                <Text style={[styles.squareText, { color: theme.text }]}>{otp[i] || ''}</Text>
              </View>
            ))}
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error as string}</Text>}

        <View style={styles.footer}>
          <PrimaryButton
            title={loading ? 'Verifying...' : 'Verify & Continue'}
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== 6}
          />

          <TouchableOpacity style={styles.resendButton}>
            <Text style={[styles.resendText, { color: theme.icon }]}>
              Didn't receive code? <Text style={{ color: theme.primary, fontWeight: '700' }}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  otpSection: {
    marginBottom: 40,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  squaresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  square: {
    width: 48,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  squareText: {
    fontSize: 24,
    fontWeight: '800',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  resendButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
