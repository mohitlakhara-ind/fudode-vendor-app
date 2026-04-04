import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ModalWrapper } from './ModalWrapper';
import { PremiumInput } from './PremiumInput';
import { PrimaryButton } from './PrimaryButton';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

interface InputDialogProps {
  visible: boolean;
  title: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  confirmLabel?: string;
  loading?: boolean;
}

export const InputDialog = ({
  visible,
  title,
  label,
  placeholder,
  initialValue = '',
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  loading = false,
}: InputDialogProps) => {
  const [value, setValue] = useState(initialValue);
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <PremiumInput
          label={label}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          autoFocus
        />
        <View style={styles.footer}>
          <PrimaryButton
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.button}
          />
          <PrimaryButton
            title={confirmLabel}
            onPress={handleConfirm}
            loading={loading}
            disabled={!value.trim()}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
