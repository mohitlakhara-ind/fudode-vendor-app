import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Typography, Fonts } from '@/constants/theme';
import { X, ShieldCheck } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface OfferOtpModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  phoneNumber: string;
}

export const OfferOtpModal = ({ visible, onClose, onVerify, phoneNumber }: OfferOtpModalProps) => {
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];
  const Obsidian = theme.background;
  const Gold = theme.primary;
  const GhostBorder = theme.border + '26';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (visible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible, timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length !== 0 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      // Logic to resend OTP would go here
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: Obsidian, borderColor: GhostBorder }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: Gold + '15' }]}>
              <ShieldCheck size={32} color={Gold} weight="fill" />
            </View>
            <ThemedText style={[styles.title, { color: theme.text }]}>Secure Verification</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              We've sent a 6-digit code to your registered mobile number ending in {phoneNumber.slice(-4)}
            </ThemedText>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  { 
                    borderColor: digit ? Gold : GhostBorder, 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: theme.text 
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                selectionColor={Gold}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleResend}
            disabled={timer > 0}
            style={styles.resendContainer}
          >
            <ThemedText style={[styles.resendText, { color: Gold, opacity: timer > 0 ? 0.5 : 1 }]}>
              {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              { backgroundColor: otp.join('').length === 6 ? Gold : Gold + '40' }
            ]}
            onPress={handleVerify}
            disabled={otp.join('').length < 6}
          >
            <ThemedText style={[styles.verifyButtonText, { color: isDark ? '#131313' : '#FFF' }]}>Verify & Create Offer</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  innerModal: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.H2,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.BodyRegular,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpInput: {
    width: (width - 88) / 6,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  resendContainer: {
    marginBottom: 32,
  },
  resendText: {
    ...Typography.Caption,
    fontWeight: '700',
  },
  verifyButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
