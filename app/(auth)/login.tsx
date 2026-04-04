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
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { CaretLeft } from 'phosphor-react-native';
import { PhoneInput } from '@/components/PhoneInput';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { requestOtp } from '@/store/slices/authSlice';
import { GlassView } from '@/components/ui/GlassView';
import { AnimatedPage } from '@/components/ui/AnimatedPage';

const { width } = Dimensions.get('window');

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
      <AnimatedPage style={[styles.container, { backgroundColor: theme.background }]}>
        <MeshGradient />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
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

            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: 'https://cdn.fudode.in/public/Logo.png' }}
                  style={[styles.logo, { tintColor: theme.primary }]}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.text }]}>Welcome Partner</Text>
                <View style={[styles.titleUnderline, { backgroundColor: theme.primary }]} />
              </View>
              
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Empowering your business with every delivery.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <PhoneInput
                  label="Phone Number"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChangeText={(val) => {
                    setPhoneNumber(val.replace(/\D/g, ''));
                    if (phoneError) setPhoneError('');
                  }}
                  error={phoneError || (error as string)}
                  onSubmitEditing={handleContinue}
                  autoFocus
                />
              </View>

              <View style={styles.termsFooter}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                  By proceeding, you agree to our{' '}
                  <Text style={{ color: theme.primary, fontWeight: '600' }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: theme.primary, fontWeight: '600' }}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          </View>

          <GlassView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.stickyFooter}>
            <PremiumButton
              label={loading ? 'Verifying...' : 'Get OTP'}
              onPress={handleContinue}
              isLoading={loading}
              disabled={phoneNumber.length !== 10}
              variant="primary"
              size="large"
              isPulsing={phoneNumber.length === 10 && !loading}
            />
          </GlassView>
        </KeyboardAvoidingView>
      </AnimatedPage>
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
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width: width * 0.6,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...Typography.Display,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: -1,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  subtitle: {
    ...Typography.BodyLarge,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  formContainer: {
    width: '100%',
    paddingTop: 20,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  termsFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.Caption,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
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
});
