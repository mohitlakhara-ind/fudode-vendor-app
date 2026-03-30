import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { WarningCircle } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModalWrapper } from '../ui/ModalWrapper';
import { PremiumButton } from '../ui/PremiumButton';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal = ({
  visible,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Delete Account">
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <WarningCircle size={48} color={theme.error} weight="duotone" />
        </View>
        
        <Text style={[styles.warningTitle, { color: theme.text }]}>
          This action is permanent
        </Text>
        
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          Deleting your account will remove all your restaurant data, order history, and payout information. This action cannot be undone.
        </Text>
        
        <View style={styles.buttonContainer}>
          <PremiumButton
            label="Keep Account"
            variant="secondary"
            onPress={onClose}
            style={styles.button}
          />
          <PremiumButton
            label="Delete Account"
            variant="primary"
            color={theme.error}
            onPress={onConfirm}
            style={styles.button}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  warningTitle: {
    ...Typography.H2,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...Typography.BodyRegular,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});
