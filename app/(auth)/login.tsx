import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { CaretLeft } from 'phosphor-react-native';
import { PhoneInput } from '@/components/PhoneInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { requestOtp } from '@/store/slices/authSlice';
export default function LoginScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { requestOtpAction, loading, error, clearError } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleContinue = async () => {
    if (phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit number');
      return;
    }
    try {
      const result = await requestOtpAction(phoneNumber);
      if (requestOtp.fulfilled.match(result)) {
        router.push({
          pathname: '/(auth)/verify',
          params: { number: phoneNumber },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <TouchableOpacity 
              style={[
                styles.backButton, 
                { 
                  borderColor: theme.border,
                  backgroundColor: theme.surfaceSecondary
                }
              ]} 
              onPress={() => router.back()}
            >
              <CaretLeft size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                      <SvgLinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={theme.primary} />
                        <Stop offset="1" stopColor={theme.primaryDark || theme.primary} />
                      </SvgLinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#logoGrad)" />
                  </Svg>
                  <Image
                    source={{ uri: 'https://cdn.fudode.in/public/Logo.png' }}
                    style={[styles.logo, { tintColor: theme.background }]}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>Welcome Partner</Text>
              <Text style={[styles.subtitle, { color: theme.icon }]}>
                Enter your mobile number to get started
              </Text>
            </View>

            <View style={styles.formContainer}>
              <PhoneInput
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChangeText={(val) => {
                  setPhoneNumber(val.replace(/\D/g, ''));
                  if (phoneError) setPhoneError('');
                }}
                error={phoneError || (error as string)}
                onSubmitEditing={handleContinue}
                autoFocus
              />

              <PrimaryButton
                title={loading ? 'Sending OTP...' : 'Get OTP'}
                onPress={handleContinue}
                loading={loading}
                disabled={phoneNumber.length !== 10}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.icon }]}>
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...Typography.H1,
    fontSize: 28, // Maintaining impact for login
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.BodyLarge,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.Caption,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
