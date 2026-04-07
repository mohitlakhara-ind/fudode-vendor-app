import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { SignOut, Devices, Users } from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogoutPress: () => void;
  userData: {
    name: string;
    phone: string;
    email: string;
    role: string;
    avatar?: any;
  };
}

export const ProfileModal = ({ visible, onClose, userData, onLogoutPress }: ProfileModalProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const avatarSource = typeof userData.avatar === 'string' 
    ? { uri: userData.avatar } 
    : (userData.avatar || { uri: 'https://via.placeholder.com/100' });

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="My profile"
      footer={
        <View style={styles.footerLinks}>
          <Text style={[styles.footerText, { color: theme.text, opacity: 0.6 }]}>
            Terms of Service | Privacy Policy | Code of Conduct
          </Text>
        </View>
      }
    >
      <View style={styles.userInfoSection}>
        <Image 
          source={avatarSource} 
          style={styles.avatar} 
        />
        <View style={styles.details}>
          <Text style={[styles.userName, { color: theme.text }]}>{userData.name}</Text>
          <Text style={[styles.userDetail, { color: theme.text, opacity: 0.7 }]}>{userData.phone}</Text>
          <Text style={[styles.userDetail, { color: theme.text, opacity: 0.7 }]}>{userData.email}</Text>
          <Text style={[styles.userRole, { color: theme.primary }]}>{userData.role}</Text>
        </View>
      </View>

      <View style={[styles.actionsDivider, { backgroundColor: theme.border }]} />

      <View style={styles.actionButtons}>
        <Pressable 
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
          onPress={onLogoutPress}
        >
          <SignOut size={20} weight="bold" color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Logout</Text>
        </Pressable>

        <Pressable 
          style={[styles.outlineButton, { borderColor: theme.secondary }]}
          onPress={onLogoutPress}
        >
          <Devices size={20} weight="bold" color={theme.secondary} style={{ marginRight: 8 }} />
          <Text style={[styles.outlineButtonText, { color: theme.secondary }]}>Logout from all devices</Text>
        </Pressable>

        <Pressable 
          style={[styles.outlineButton, { borderColor: theme.secondary }]}
          onPress={onLogoutPress}
        >
          <Users size={20} weight="bold" color={theme.secondary} style={{ marginRight: 8 }} />
          <Text style={[styles.outlineButtonText, { color: theme.secondary }]}>Logout all users and devices</Text>
        </Pressable>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#333',
  },
  details: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    ...Typography.H2,
    fontSize: 22,
    marginBottom: 4,
  },
  userDetail: {
    ...Typography.BodyRegular,
    fontSize: 15,
    marginBottom: 2,
  },
  userRole: {
    ...Typography.BodyLarge,
    marginTop: 6,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionsDivider: {
    height: 1,
    opacity: 0.1,
    marginBottom: 24,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.BodyLarge,
    color: '#FFF',
    fontWeight: '700',
  },
  outlineButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    ...Typography.BodyLarge,
    fontWeight: '700',
  },
  footerLinks: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.Caption,
    textDecorationLine: 'underline',
  }
});
