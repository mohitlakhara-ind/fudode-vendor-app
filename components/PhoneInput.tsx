import React, { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

interface PhoneInputProps extends Omit<TextInputProps, 'placeholderTextColor'> {
  error?: string;
  label?: string;
}

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  ({ error, label, style, ...props }, ref) => {
    const { colorScheme } = useAppTheme();
    const theme = Colors[colorScheme];

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: theme.text }]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surface,
              borderColor: error ? '#FF3B30' : theme.border,
            },
          ]}
        >
          <View style={styles.countryCodeContainer}>
            <Text style={[styles.countryCode, { color: theme.text }]}>
              +91
            </Text>
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
          </View>

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: theme.text,
              },
              style,
            ]}
            placeholderTextColor={theme.icon}
            keyboardType="phone-pad"
            maxLength={10}
            {...props}
          />
        </View>
        {error && (
          <Text style={[styles.errorText, { color: '#FF3B30' }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    height: 60,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    width: 1.5,
    height: 24,
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    paddingRight: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 8,
    fontWeight: '600',
  },
});
