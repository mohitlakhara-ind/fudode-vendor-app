import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  CaretDown,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { RadioButton } from '@/components/ui/RadioButton';

const SECTION_SPACING = 24;

const ROLES = [
  { id: 'staff', label: 'Staff' },
  { id: 'manager', label: 'Manager' },
  { id: 'owner', label: 'Owner' },
];

export default function InviteUserScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('staff');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <CaretLeft size={28} color={theme.text} weight="bold" />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Invite user</Text>
          </View>
          <Pressable>
            <Text style={[styles.headerLink, { color: theme.info }]}>View permissions</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Phone Input Box */}
            <View style={styles.inputSection}>
              <View style={[styles.phoneInputContainer, { borderColor: theme.border + '30', backgroundColor: theme.surface + '50' }]}>
                <Pressable style={styles.countryPicker}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={[styles.countryCode, { color: theme.text }]}>+91</Text>
                  <CaretDown size={14} color={theme.text} weight="bold" />
                </Pressable>
                <View style={[styles.verticalSeparator, { backgroundColor: theme.border + '30' }]} />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  style={[styles.phoneInput, { color: theme.text }]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                This user will receive a link by SMS which they need to click on to accept the invite and be added to your outlet.
              </Text>

              <Pressable style={styles.emailInviteBtn}>
                <Text style={[styles.emailInviteText, { color: theme.info }]}>Invite by email</Text>
              </Pressable>
            </View>

            {/* Role Selection */}
            <View style={[styles.roleSectionHeader, { backgroundColor: theme.surfaceSecondary + '30' }]}>
              <Text style={[styles.roleSectionTitle, { color: theme.text }]}>Select user role</Text>
            </View>

            <View style={styles.roleList}>
              {ROLES.map((role) => (
                <Pressable
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  style={[styles.roleItem, { borderBottomColor: theme.border + '15' }]}
                >
                  <Text style={[styles.roleLabel, { color: theme.text }]}>{role.label}</Text>
                  <RadioButton
                    selected={selectedRole === role.id}
                    onPress={() => setSelectedRole(role.id)}
                    activeColor={theme.info}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Sticky Footer Button */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              style={[
                styles.sendInviteBtn, 
                { 
                  backgroundColor: phoneNumber.length >= 10 ? theme.primary : theme.surfaceSecondary,
                  opacity: phoneNumber.length >= 10 ? 1 : 0.6
                }
              ]}
              disabled={phoneNumber.length < 10}
            >
              <Text style={[styles.sendInviteBtnText, { color: phoneNumber.length >= 10 ? '#000' : theme.textSecondary }]}>
                Send invite
              </Text>
            </Pressable>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  headerLink: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 16,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: SECTION_SPACING * 1.5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '600',
  },
  verticalSeparator: {
    width: 1,
    height: 24,
  },
  phoneInput: {
    flex: 1,
    ...Typography.H2,
    fontSize: 18,
    paddingHorizontal: 16,
    height: '100%',
  },
  infoText: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    opacity: 0.8,
  },
  emailInviteBtn: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  emailInviteText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  roleSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  roleSectionTitle: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '700',
  },
  roleList: {
    paddingHorizontal: 0,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  roleLabel: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sendInviteBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendInviteBtnText: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
});
