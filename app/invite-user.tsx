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
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('staff');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.surface, borderBottomColor: theme.border + '26' }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <CaretLeft size={24} color={theme.text} weight="bold" />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Invite User</Text>
          </View>
          <Pressable style={styles.headerRightAction}>
            <Text style={[styles.headerLink, { color: theme.info }]}>View Permissions</Text>
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
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Enter Phone Number</Text>
              <View style={[
                styles.phoneInputContainer, 
                { 
                  borderColor: phoneNumber.length >= 10 ? theme.info : theme.border + '20', 
                  backgroundColor: theme.surface,
                  borderWidth: 1.5
                }
              ]}>
                <Pressable style={styles.countryPicker}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={[styles.countryCode, { color: theme.text }]}>+91</Text>
                  <CaretDown size={14} color={theme.text} weight="bold" />
                </Pressable>
                <View style={[styles.verticalSeparator, { backgroundColor: theme.border + '15' }]} />
                <TextInput
                  placeholder="00000 00000"
                  placeholderTextColor={theme.textSecondary + '60'}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.phoneInput, { color: theme.text }]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>

              <View style={[styles.infoBox, { backgroundColor: theme.info + '10' }]}>
                <Text style={[styles.infoText, { color: theme.info }]}>
                  We'll send an SMS invite with a secure link to join your outlet instantly.
                </Text>
              </View>

              <Pressable style={styles.emailInviteBtn}>
                <Text style={[styles.emailInviteText, { color: theme.info }]}>Invite via email instead?</Text>
              </Pressable>
            </View>

            {/* Role Selection */}
            <View style={styles.roleHeaderSection}>
              <Text style={[styles.roleSectionTitle, { color: theme.text }]}>Select User Role</Text>
              <Text style={[styles.roleSectionSubtitle, { color: theme.textSecondary }]}>Choose permissions for this user</Text>
            </View>

            <View style={styles.roleList}>
              {ROLES.map((role) => (
                <Pressable
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  style={[
                    styles.roleCard, 
                    { 
                      backgroundColor: selectedRole === role.id ? theme.info + '10' : theme.surface,
                      borderColor: selectedRole === role.id ? theme.info : theme.border + '20',
                      borderWidth: 1.5
                    }
                  ]}
                >
                  <View style={styles.roleCardMain}>
                    <View style={[styles.roleIconContainer, { backgroundColor: selectedRole === role.id ? theme.info : theme.surfaceSecondary }]}>
                       <Text style={{ fontSize: 20 }}>{role.id === 'staff' ? '🤝' : role.id === 'manager' ? '👤' : '👑'}</Text>
                    </View>
                    <View style={styles.roleTextContainer}>
                      <Text style={[styles.roleLabel, { color: theme.text }]}>{role.label}</Text>
                      <Text style={[styles.roleDescription, { color: theme.textSecondary }]}>
                        {role.id === 'staff' ? 'Limited access to orders and basics' : role.id === 'manager' ? 'Full operational access and reporting' : 'Complete control over the entire outlet'}
                      </Text>
                    </View>
                    <RadioButton
                      selected={selectedRole === role.id}
                      onPress={() => setSelectedRole(role.id)}
                      activeColor={theme.info}
                    />
                  </View>
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
              <Text style={[styles.sendInviteBtnText, { color: phoneNumber.length >= 10 ? (isDark ? '#000' : '#FFF') : theme.textSecondary }]}>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
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
    ...Typography.H2,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRightAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerLink: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 24,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: SECTION_SPACING * 1.5,
  },
  inputLabel: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  flag: {
    fontSize: 22,
  },
  countryCode: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
  },
  verticalSeparator: {
    width: 1.5,
    height: 28,
  },
  phoneInput: {
    flex: 1,
    ...Typography.H2,
    fontSize: 20,
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    height: '100%',
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
  },
  infoText: {
    ...Typography.BodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  emailInviteBtn: {
    marginTop: 16,
    alignSelf: 'center',
  },
  emailInviteText: {
    ...Typography.H3,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  roleHeaderSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  roleSectionTitle: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
  roleSectionSubtitle: {
    ...Typography.BodyRegular,
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  roleList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  roleCard: {
    borderRadius: 20,
    padding: 16,
  },
  roleCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTextContainer: {
    flex: 1,
    gap: 2,
  },
  roleLabel: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '700',
  },
  roleDescription: {
    ...Typography.Caption,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  sendInviteBtn: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sendInviteBtnText: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
});
