import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ModalWrapper } from './ModalWrapper';
import { PrimaryButton } from './PrimaryButton';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { Info, Warning } from 'phosphor-react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'info';
}

export const ConfirmDialog = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'info',
}: ConfirmDialogProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const Icon = variant === 'danger' ? Warning : Info;
  const iconColor = variant === 'danger' ? theme.error : theme.primary;

  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor + '10' }]}>
          <Icon size={32} color={iconColor} weight="duotone" />
        </View>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
        <View style={styles.footer}>
          <PrimaryButton
            title={cancelLabel}
            variant="outline"
            onPress={onClose}
            style={styles.button}
          />
          <PrimaryButton
            title={confirmLabel}
            onPress={onConfirm}
            loading={loading}
            style={StyleSheet.flatten([
              styles.button,
              variant === 'danger' ? { backgroundColor: theme.error } : {}
            ])}
            textStyle={variant === 'danger' ? { color: '#FFF' } : undefined}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    ...Typography.BodyLarge,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});
