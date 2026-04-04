import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ModalWrapper } from './ModalWrapper';
import { PrimaryButton } from './PrimaryButton';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { Info, WarningCircle, CheckCircle } from 'phosphor-react-native';

interface MessageDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'info' | 'error' | 'success';
}

export const MessageDialog = ({
  visible,
  title,
  message,
  onClose,
  type = 'info',
}: MessageDialogProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const getIcon = () => {
    switch (type) {
      case 'error': return WarningCircle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error': return theme.error;
      case 'success': return '#10B981';
      default: return theme.primary;
    }
  };

  const Icon = getIcon();
  const iconColor = getIconColor();

  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor + '10' }]}>
          <Icon size={32} color={iconColor} weight="duotone" />
        </View>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
        <PrimaryButton
          title="Dismiss"
          onPress={onClose}
          style={styles.button}
        />
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
  button: {
    width: '100%',
  },
});
