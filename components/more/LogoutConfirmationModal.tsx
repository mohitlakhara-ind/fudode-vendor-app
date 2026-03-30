import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModalWrapper } from '../ui/ModalWrapper';
import { PremiumButton } from '../ui/PremiumButton';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Logout">
      <View style={styles.container}>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          Are you sure you want to logout from your account? You will need to login again to manage your restaurant.
        </Text>
        
        <View style={styles.buttonContainer}>
          <PremiumButton
            label="Cancel"
            variant="secondary"
            onPress={onClose}
            style={styles.button}
          />
          <PremiumButton
            label="Logout"
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
  },
  message: {
    ...Typography.BodyLarge,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
